
import React ,{ useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/home/Home';
import Login from './pages/login/Login'
import Register from './pages/register/Register'
import CreateRoom from './components/CreateRoom.jsx';
import JoinRoom from './components/JoinRoom.jsx';

import Lobby from './components/Lobby.jsx';
import Quiz from './components/Quiz.jsx';

import './App.css'
import { useAuthContext } from './context/authContext.jsx';

function App() {
  const {authUser} = useAuthContext();

  return (

    <Router>
      <Routes>
        <Route path='/' element={authUser === null ? <Navigate to="/login" /> : <Home />} />
        <Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
				<Route path='/register' element={authUser ? <Navigate to='/' />  : <Register/>} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/join-room" element={<JoinRoom />} />
        <Route path="/lobby/:roomId" element={<Lobby />} />
        <Route path="/quiz/:roomId" element={<Quiz/>}/>

      </Routes>
    </Router>

  )
}

export default App
