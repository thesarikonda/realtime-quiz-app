// import { Server } from "socket.io";
// import jwt from 'jsonwebtoken';

// const setupSocket = (server) => {
//     const rooms = {};
//     const io = new Server(server, {
//         cors: {
//             origin: "http://localhost:5173",
//             methods: ["GET", "POST"],
//             credentials: true
//         }
//     });

//     io.use(async (socket, next) => {
//         console.log("--- Handshake started for new connection ---");
//         console.log("Cookies received:", socket.handshake.headers.cookie);
//         try {
//             const cookies = socket.handshake.headers.cookie;
//             if(!cookies){
//                 return next(new Error("No Authentication Cookies"));

//             }
//             const token = cookies.split(';').find(row => row.trim().startsWith('jwt='))?.split('=')[1];
//             if(!token){
//                 return next(new Error("No JWT token found"))
//             }

//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             console.log("Handshake successful! Token verified for user:", decoded.userId);
//             socket.user = {
//                 id : decoded.userId,
//                 username : decoded.username
//             }



//             next();
//         } catch (error) {
//             console.log("Socekt Authentication failed", error.message);
//             next(new Error("Authentication Failed"));
            
//         }
//     })

//     io.on("connection", (socket) => {
//         console.log(`Socket connected: ${socket.user.id} ", ${socket.id}`);
//         // 1. CREATE ROOM (Host only)
//         socket.on("create_room", ({ totalQuestions, marksPerQuestion }) => {
//             const roomId = Math.floor(100000 + Math.random() * 900000).toString();

//             rooms[roomId] = {
//                 hostId: socket.id,
//                 hostUserId: socket.user.id,
//                 players: [{ id: socket.id, userId: socket.user.id, username: "Host", isHost: true }],
//                 status: "waiting",
//                 questions: [] // Filled later by host
//             };

//             socket.join(roomId);

//             // Send room details back to host
//             socket.emit("room_created", { roomId });

//             // Initial update to the room (just the host for now)
//             io.to(roomId).emit("room_update", {
//                 roomId,
//                 players: rooms[roomId].players,
//                 status: "waiting"
//             });

//             console.log(`Room ${roomId} created by user ${socket.user.id}`);
//         });

//         socket.on("get_room_state", ({ roomId }) => {
//             if (rooms[roomId]) {
//                 socket.emit("room_update", rooms[roomId]);
//             }
//         });



//         // 2. JOIN ROOM (Any authenticated user)
//         socket.on("join_room", ({ roomId }) => {
//             if (!rooms[roomId]) {
//                 return socket.emit("error", "Room not found");
//             }

//             if (rooms[roomId].status !== "waiting") {
//                 return socket.emit("error", "Quiz already started");
//             }

//             // Prevent duplicate join
//             if (rooms[roomId].players.some(p => p.id === socket.id)) {
//                 return socket.emit("error", "You are already in this room");
//             }

//             // Add player
//             rooms[roomId].players.push({
//                 id: socket.id,
//                 userId: socket.user.id,
//                 username: "Player", // Later: fetch real username from DB
//                 isHost: false
//             });

//             socket.join(roomId);

//             // Broadcast updated player list to ALL in room
//             io.to(roomId).emit("room_update", {
//                 roomId,
//                 hostId : rooms[roomId].hostId,
//                 players: rooms[roomId].players,
//                 status: rooms[roomId].status
//             });

//             // Confirm join to the player
//             socket.emit("joined_room", { roomId });

//             console.log(`User ${socket.user.id} joined room ${roomId}`);
//         });

//         // 3. ADD QUESTION (Host only)
//         socket.on("add_question", ({ roomId, question }) => {
//             if (!rooms[roomId] || rooms[roomId].hostId !== socket.id) {
//                 return socket.emit("error", "Only host can add questions");
//             }

//             if (rooms.questions.length >= rooms.totalQuestions) {
//                 return socket.emit("error", "Question limit reached");
//             }

//             // Validate question (optional but good)
//             if (!question.text || question.options.length !== 4 || !question.options.every(o => o)) {
//                 return socket.emit("error", "Invalid question format");
//             }

//             rooms[roomId].questions.push(question);

//             // Optional: notify room that questions updated
//             io.to(roomId).emit("room_update", {
//                 roomId,
//                 players: rooms[roomId].players,
//                 status: rooms[roomId].status,
//                 questionCount: rooms[roomId].questions.length,
//                 totalQuestions : rooms.totalQuestions,
//                 marksPerQuestion : rooms.marksPerQuestion
//             });

//             console.log(`Question added in room ${roomId} (total: ${rooms[roomId].questions.length})`);
//         });


//         // 4. START QUIZ (Host only)
//         socket.on("start_quiz", ({ roomId }) => {
//             if (!rooms[roomId] || rooms[roomId].hostId !== socket.id) {
//                 return socket.emit("error", "Only host can start quiz");
//             }

//             if (rooms[roomId].questions.length === 0) {
//                 return socket.emit("error", "Add at least one question first");
//             }

//             rooms[roomId].status = "in_progress";

//             // Notify all in room that game started
//             io.to(roomId).emit("game_started", {
//                 roomId,
//                 questions: rooms[roomId].questions // Send all questions to clients
//             });

//             console.log(`Quiz started in room ${roomId} with ${rooms[roomId].questions.length} questions`);
//         });


//         socket.on("disconnect", () => {
//             console.log("Socket disconnected:", socket.id);
//             for (const roomId in rooms) {
//                 const room = rooms[roomId];

//                 if (room.hostId === socket.id) {
//                     // Host left → close room
//                     io.to(roomId).emit("room_closed", "Host left the room");
//                     delete rooms[roomId];
//                     console.log(`Room ${roomId} closed (host disconnected)`);
//                 } else {
//                 // Remove player from list
//                 room.players = room.players.filter(p => p.id !== socket.id);
//                 io.to(roomId).emit("room_update", room);
//                 console.log(`Player removed from room ${roomId}`);
//                 };
//             }

//             });
//     });
// };

// export default setupSocket;


import { Server } from "socket.io";
import jwt from "jsonwebtoken";

const setupSocket = (server) => {
  const rooms = {};

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // 🔹 helper: always emit normalized room data
  const emitRoomUpdate = (roomId) => {
    const room = rooms[roomId];
    if (!room) return;

    io.to(roomId).emit("room_update", {
      roomId,
      hostId: room.hostId,
      hostUserId: room.hostUserId,
      players: room.players,
      status: room.status,
      questionCount: room.questions.length,
      totalQuestions: room.totalQuestions,
      marksPerQuestion: room.marksPerQuestion,
    });
  };

  // 🔐 socket auth
  io.use((socket, next) => {
    try {
      const cookies = socket.handshake.headers.cookie;
      if (!cookies) return next(new Error("No Authentication Cookies"));

      const token = cookies
        .split(";")
        .find((c) => c.trim().startsWith("jwt="))
        ?.split("=")[1];

      if (!token) return next(new Error("No JWT token found"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.user = {
        id: decoded.userId,
        username: decoded.username,
      };

      next();
    } catch (err) {
      next(new Error("Authentication Failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // 1️⃣ CREATE ROOM
    socket.on("create_room", ({ totalQuestions, marksPerQuestion }) => {
      const roomId = Math.floor(100000 + Math.random() * 900000).toString();

      rooms[roomId] = {
        hostId: socket.id,
        hostUserId: socket.user.id,
        players: [
          {
            id: socket.id,
            userId: socket.user.id,
            username: socket.user.username || "Host",
            isHost: true,
            score:0
          },
        ],
        status: "waiting",
        totalQuestions,
        marksPerQuestion,
        questions: [],
      };

      socket.join(roomId);
      socket.emit("room_created", { roomId });

      emitRoomUpdate(roomId);

      console.log(`Room ${roomId} created`);
    });

    // 2️⃣ GET ROOM STATE
    socket.on("get_room_state", ({ roomId }) => {
      if (!rooms[roomId]) return;
      emitRoomUpdate(roomId);
    });

    // 3️⃣ JOIN ROOM
    socket.on("join_room", ({ roomId }) => {
      const room = rooms[roomId];
      if (!room) return socket.emit("error", "Room not found");

      if (room.status !== "waiting") {
        return socket.emit("error", "Quiz already started");
      }

      if (room.players.some((p) => p.id === socket.id)) {
        return socket.emit("error", "Already in room");
      }

      room.players.push({
        id: socket.id,
        userId: socket.user.id,
        username: socket.user.username || "Player",
        isHost: false,
        score:0
      });

      socket.join(roomId);
      socket.emit("joined_room", { roomId });

      emitRoomUpdate(roomId);
    });

    // 4️⃣ ADD QUESTION (HOST ONLY)
    socket.on("add_question", ({ roomId, question }) => {
      const room = rooms[roomId];
      if (!room || room.hostId !== socket.id) {
        return socket.emit("error", "Only host can add questions");
      }

      if (room.questions.length >= room.totalQuestions) {
        return socket.emit("error", "Question limit reached");
      }

      if (
        !question.text ||
        !question.options ||
        question.options.length !== 4 ||
        question.options.some((o) => !o)
      ) {
        return socket.emit("error", "Invalid question format");
      }

      room.questions.push(question);

      emitRoomUpdate(roomId);
    });

    // 5️⃣ START QUIZ
    socket.on("start_quiz", ({ roomId }) => {
      const room = rooms[roomId];
      if (!room || room.hostId !== socket.id) {
        return socket.emit("error", "Only host can start quiz");
      }

      if (room.questions.length !== room.totalQuestions) {
        return socket.emit("error", "Add all questions first");
      }

      room.status = "in_progress";

      io.to(roomId).emit("game_started", {
        roomId,
        questions: room.questions,
        marksPerQuestion: room.marksPerQuestion,
      });

      console.log(`Quiz started in room ${roomId}`);
    });

    socket.on('get_quiz_data',({roomId})=>{
      const room = rooms[roomId];
      if(!room) return;
      socket.emit('quiz_data',{
        questions : room.questions,
        marksPerQuestion : room.marksPerQuestion,
        hostId:room.hostId
      })
    });

    socket.on("submit_answer",({roomId, questionIndex, selectedIndex})=>{
      const room =rooms[roomId];
      const player = room.players.find(p => p.id === socket.id);
      if(!player || player.isHost) return;

      const question = room.questions[questionIndex];

      if(!question) return

      if(selectedIndex === question.correctIndex){
        player.score += room.marksPerQuestion;
      }

      io.to(roomId).emit('score_update',{
        scoreboard: room.players.map(p => ({
          userId:p.userId,
          username:p.username,
          score:p.score,
          isHost:p.isHost,
        }))
      })
    });

    socket.on("end_quiz", ({ roomId }) => {
    const room = rooms[roomId];
    if (!room) return;

    io.to(roomId).emit("final_scoreboard", {
      scoreboard: room.players.map(p => ({
          userId: p.userId,
          username: p.username,
          score: p.score,
          isHost: p.isHost,
        })),
      });
    });

    // 6️⃣ DISCONNECT
    socket.on("disconnect", () => {
      for (const roomId in rooms) {
        const room = rooms[roomId];

        if (room.hostId === socket.id) {
          io.to(roomId).emit("room_closed", "Host left the room");
          delete rooms[roomId];
        } else {
          room.players = room.players.filter((p) => p.id !== socket.id);
          emitRoomUpdate(roomId);
        }
      }
    });
  });
};

export default setupSocket;
