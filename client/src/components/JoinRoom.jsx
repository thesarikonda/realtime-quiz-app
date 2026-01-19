import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/socketContext";

const JoinRoom = () => {
  const socket = useSocket();
  const navigate = useNavigate();

  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoin = () => {
    if (!roomCode.trim()) return;
    setLoading(true);
    setError("");
    socket.emit("join_room", { roomId: roomCode });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("joined_room", ({ roomId }) => {
      navigate(`/lobby/${roomId}`);
    });

    socket.on("error", (msg) => {
      setError(msg);
      setLoading(false);
    });

    return () => {
      socket.off("joined_room");
      socket.off("error");
    };
  }, [socket, navigate]);

  if (!socket) {
    return <div className="text-center mt-5">Connecting...</div>;
  }

  return (
    <div className="container mt-5 text-center">
      <div className="card shadow p-5">
        <h2>Join Quiz Room</h2>

        <input
          className="form-control mt-3"
          placeholder="Enter Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />

        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <button
          className="btn btn-success btn-lg w-100 mt-3"
          onClick={handleJoin}
          disabled={loading}
        >
          {loading ? "Joining..." : "Join Room"}
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;
