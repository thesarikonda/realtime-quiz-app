import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/socketContext";

const Lobby = () => {
  const { roomId } = useParams();
  const socket = useSocket();

  const [players, setPlayers] = useState([]);
  const [status, setStatus] = useState("waiting");
  const navigate = useNavigate();

  const [roomData, setRoomData] = useState({
    hostId: null,
    questionCount: 0,
    totalQuestions: 0,
    marksPerQuestion: 0,
  });

  const [roomReady, setRoomReady] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState({
    text: "",
    options: ["", "", "", ""],
    correctIndex: 0,
    timeLimit: 30,
  });

  const isHost = socket && roomData.hostId === socket.id;

  useEffect(() => {
    if (!socket) return;

    socket.emit("get_room_state", { roomId });

    socket.on("room_update", (data) => {
      setRoomData(data);
      setPlayers(data.players);
      setStatus(data.status);
      setRoomReady(true);
    });

    socket.on("game_started", ({ roomId }) => {
      alert("Quiz Started!");
      navigate(`/quiz/${roomId}`);

    });

    return () => {
      socket.off("room_update");
      socket.off("game_started");
    };
  }, [socket, roomId]);

  useEffect(()=>{
    console.log(roomData);
  },[roomData])

  const addQuestion = () => {
    if (!currentQuestion.text || currentQuestion.options.some(o => !o)) {
      alert("Fill all fields");
      return;
    }

    socket.emit("add_question", {
      roomId,
      question: currentQuestion,
    });

    setCurrentQuestion({
      text: "",
      options: ["", "", "", ""],
      correctIndex: 0,
      timeLimit: 30,
    });
  };

  const startQuiz = () => {
    socket.emit("start_quiz", { roomId });
  };

  if (!socket) {
    return <div className="text-center mt-5">Connecting to lobby...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h3>Room Code: {roomId}</h3>

        {/* PLAYERS */}
        <h5 className="mt-3">Players ({players.length})</h5>
        <ul className="list-group">
          {players.map((p, i) => (
            <li key={i} className="list-group-item">
              {p.username} {p.isHost && "(Host)"}
            </li>
          ))}
        </ul>

        {/* HOST UI */}
        {roomReady && isHost && status === "waiting" && (
          <div className="mt-4">
            <h5>
              Prepare Quiz ({roomData.questionCount}/{roomData.totalQuestions})
            </h5>

            <p className="text-muted">
              Marks per question: {roomData.marksPerQuestion}
            </p>

            <input
              className="form-control mb-2"
              placeholder="Question text"
              value={currentQuestion.text}
              onChange={(e) =>
                setCurrentQuestion({ ...currentQuestion, text: e.target.value })
              }
            />

            {currentQuestion.options.map((opt, i) => (
              <div key={i} className="input-group mb-2">
                <input
                  className="form-control"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...currentQuestion.options];
                    newOpts[i] = e.target.value;
                    setCurrentQuestion({
                      ...currentQuestion,
                      options: newOpts,
                    });
                  }}
                />
                <div className="input-group-text">
                  <input
                    type="radio"
                    checked={currentQuestion.correctIndex === i}
                    onChange={() =>
                      setCurrentQuestion({
                        ...currentQuestion,
                        correctIndex: i,
                      })
                    }
                  />
                </div>
              </div>
            ))}

            <input
              type="number"
              className="form-control mb-3"
              value={currentQuestion.timeLimit}
              onChange={(e) =>
                setCurrentQuestion({
                  ...currentQuestion,
                  timeLimit: +e.target.value,
                })
              }
            />

            {/* ADD QUESTION (LIMITED) */}
            <button
              className="btn btn-success mb-3"
              onClick={addQuestion}
              disabled={roomData.questionCount >= roomData.totalQuestions}
            >
              Add Question
            </button>

            {/* START QUIZ (ONLY WHEN READY) */}
            <button
              className="btn btn-primary w-100"
              onClick={startQuiz}
              disabled={
                roomData.questionCount !== roomData.totalQuestions ||
                roomData.totalQuestions === 0
              }
            >
              Start Quiz
            </button>
          </div>
        )}

        {/* PLAYER UI */}
        {roomReady && !isHost && status === "waiting" && (
          <div className="text-center mt-4">
            <div className="spinner-border"></div>
            <p>Waiting for host to start the quiz...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Lobby;
