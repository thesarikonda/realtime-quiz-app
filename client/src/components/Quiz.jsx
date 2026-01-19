import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSocket } from "../context/socketContext";
import { useAuthContext } from "../context/authContext";

const Quiz = () => {
  const { roomId } = useParams();
  const socket = useSocket();
  const { authUser } = useAuthContext();

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const [loading, setLoading] = useState(true);
  const [quizEnded, setQuizEnded] = useState(false);

  const [scoreboard, setScoreboard] = useState([]);
  const [finalScoreboard, setFinalScoreboard] = useState([]);

  const [hostId, setHostId] = useState(null);

  /* ===============================
     FETCH QUIZ DATA
  =============================== */
  useEffect(() => {
    if (!socket) return;

    socket.emit("get_quiz_data", { roomId });

    socket.on("quiz_data", ({ questions, hostId }) => {
      if (!questions || questions.length === 0) return;

      setQuestions(questions);
      setHostId(hostId);
      setCurrentIndex(0);
      setTimeLeft(questions[0].timeLimit || 30);
      setLoading(false);
    });

    return () => socket.off("quiz_data");
  }, [socket, roomId]);

  /* ===============================
     LIVE SCORE UPDATES
  =============================== */
  useEffect(() => {
    if (!socket) return;

    socket.on("score_update", ({ scoreboard }) => {
      setScoreboard(scoreboard);
    });

    socket.on("final_scoreboard", ({ scoreboard }) => {
      setFinalScoreboard(scoreboard);
    });

    return () => {
      socket.off("score_update");
      socket.off("final_scoreboard");
    };
  }, [socket]);

  /* ===============================
     TIMER
  =============================== */
  useEffect(() => {
    if (loading || quizEnded) return;
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, quizEnded]);

  /* ===============================
     AUTO NEXT WHEN TIME ENDS
  =============================== */
  useEffect(() => {
    if (!loading && timeLeft === 0) {
      goNext();
    }
  }, [timeLeft, loading]);

  /* ===============================
     ANSWER HANDLER (PLAYERS ONLY)
  =============================== */
  const handleAnswer = (index) => {
    if (selectedOption !== null) return;

    setSelectedOption(index);

    socket.emit("submit_answer", {
      roomId,
      questionIndex: currentIndex,
      selectedIndex: index,
    });
  };

  /* ===============================
     NEXT QUESTION / END QUIZ
  =============================== */
  const goNext = () => {
    setSelectedOption(null);

    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setTimeLeft(questions[nextIndex].timeLimit || 30);
    } else {
      socket.emit("end_quiz", { roomId });
      setQuizEnded(true);
    }
  };

  /* ===============================
     RENDER STATES
  =============================== */

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
        <p className="mt-3">Preparing quiz...</p>
      </div>
    );
  }

  const isHost = socket?.id === hostId;
  const resultData =
    finalScoreboard.length > 0 ? finalScoreboard : scoreboard;

  if (quizEnded) {
    return (
      <div className="container mt-5">
        <div className="card shadow p-5 text-center">
          <h2>Quiz Completed 🎉</h2>
          <h5 className="mt-4">Final Scoreboard</h5>

          <ul className="list-group mt-3">
            {resultData
              .filter((p) => !p.isHost)
              .sort((a, b) => b.score - a.score)
              .map((p, i) => (
                <li
                  key={p.userId}
                  className="list-group-item d-flex justify-content-between"
                >
                  <span>
                    #{i + 1} {p.username}
                  </span>
                  <strong>{p.score}</strong>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }

  const q = questions[currentIndex];

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h5>
          Question {currentIndex + 1} / {questions.length}
        </h5>

        <div className="alert alert-warning text-center">
          ⏱ Time Left: <strong>{timeLeft}s</strong>
        </div>

        <h4 className="mb-4">{q.text}</h4>

        {/* ================= PLAYER OPTIONS ================= */}
        {!isHost ? (
          <div className="list-group">
            {q.options.map((opt, i) => (
              <button
                key={i}
                className={`list-group-item list-group-item-action ${
                  selectedOption === i ? "active" : ""
                }`}
                onClick={() => handleAnswer(i)}
                disabled={selectedOption !== null}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <div className="alert alert-info text-center">
            You are the host. Monitoring players and scoreboard…
          </div>
        )}

        {/* ================= NEXT BUTTON ================= */}
        <button
          className="btn btn-primary w-100 mt-4"
          onClick={goNext}
          disabled={!isHost && selectedOption === null}
        >
          {currentIndex === questions.length - 1
            ? "Finish Quiz"
            : "Next Question"}
        </button>

        {/* ================= LIVE SCOREBOARD ================= */}
        <div className="mt-5">
          <h5>Live Scoreboard</h5>

          <ul className="list-group">
            {scoreboard
              .filter((p) => !p.isHost)
              .sort((a, b) => b.score - a.score)
              .map((p, i) => (
              <li
                key={p.userId}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span className="player-name">
                  #{i + 1} {p.username}
                </span>
                <span className="player-score">{p.score}</span>
              </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
