import React, { useState, useRef, useEffect } from "react";
import { useAuthContext } from "../../context/authContext";
import useLogout from "../../hooks/useLogout";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { logout } = useLogout();
  const { authUser } = useAuthContext();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="container-fluid vh-100 d-flex flex-column p-0 bg-light">
      
      {/* ================= NAVBAR ================= */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4">
        {/* Logo - Left */}
        <span className="navbar-brand fw-bold text-primary">
          QuizArena
        </span>

        {/* Search - Center */}
        <form className="mx-auto w-50 d-none d-md-block">
          <input
            className="form-control"
            type="search"
            placeholder="Search rooms or quizzes..."
          />
        </form>

        {/* Profile - Right */}
        <div className="position-relative" ref={dropdownRef}>
          <button
            className="btn btn-outline-primary"
            onClick={() => setOpen(!open)}
          >
            Profile
          </button>

          {open && (
            <div className="dropdown-menu dropdown-menu-end show">
              <button className="dropdown-item">{authUser.username}</button>
              <button className="dropdown-item">Settings</button>
              <div className="dropdown-divider"></div>
              <button
                className="dropdown-item text-danger"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <div className="flex-grow-1 d-flex align-items-center justify-content-center">
        <div className="container">
          <div className="row justify-content-center g-4">

            {/* CREATE ROOM */}
            <div className="col-lg-5 col-md-6">
              <div className="card shadow-lg border-0 h-100">
                <div className="card-body d-flex flex-column text-center p-5">
                  <div className="display-4 text-primary mb-3">➕</div>
                  <h3 className="fw-bold mb-2">Create Room</h3>
                  <p className="text-muted mb-4">
                    Create a quiz room and invite participants.
                  </p>
                  <button
                    className="btn btn-primary btn-lg mt-auto"
                    onClick={() => navigate("/create-room")}
                  >
                    Create Room
                  </button>
                </div>
              </div>
            </div>

            {/* JOIN ROOM */}
            <div className="col-lg-5 col-md-6">
              <div className="card shadow-lg border-0 h-100">
                <div className="card-body d-flex flex-column text-center p-5">
                  <div className="display-4 text-primary mb-3">🔑</div>
                  <h3 className="fw-bold mb-2">Join Room</h3>
                  <p className="text-muted mb-4">
                    Enter a room code to join a quiz.
                  </p>
                  <button
                    className="btn btn-outline-primary btn-lg mt-auto"
                    onClick={() => navigate("/join-room")}
                  >
                    Join Room
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
