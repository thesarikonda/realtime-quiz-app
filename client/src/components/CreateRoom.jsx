import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/socketContext"

const CreateRoom = () => {
  const socket = useSocket();
  const navigate = useNavigate();
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [marksPerQuestion, setMarksPerQuestion] = useState(5);
  const [loading, setLoading] = useState(false);

  const handleCreate = () => {
    if (!socket) return;
    setLoading(true);
    socket.emit("create_room",{
      totalQuestions, marksPerQuestion
    });
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("room_created", ({ roomId }) => {
      navigate(`/lobby/${roomId}`);
    });

    return () => socket.off("room_created");
  }, [socket, navigate]);

  return (
      <div className="container mt-5 text-center">
    <div className="card shadow p-5">
      <h2>Create a New Quiz Room</h2>

      {/* 👇 ADD HERE */}
            <div className="mb-3 text-start">
        <label className="form-label fw-semibold">
          Number of Questions
        </label>
        <input
          type="number"
          className="form-control"
          min={1}
          value={totalQuestions}
          onChange={(e) => setTotalQuestions(+e.target.value)}
        />
      </div>

      <div className="mb-3 text-start">
        <label className="form-label fw-semibold">
          Marks per Question
        </label>
        <input
          type="number"
          className="form-control"
          min={1}
          value={marksPerQuestion}
          onChange={(e) => setMarksPerQuestion(+e.target.value)}
        />
      </div>



      <button
        className="btn btn-primary btn-lg mt-3"
        onClick={handleCreate}
        disabled={loading}
      >
        {loading ? "Creating..." : "Create Room"}
      </button>
    </div>
  </div>


  );
};

export default CreateRoom;
