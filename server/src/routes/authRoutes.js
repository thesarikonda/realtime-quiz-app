import express from 'express';

const authRoutes = express.Router();

import {register, login, logout} from '../controllers/auth.controller.js'
import getMe from '../controllers/me.controller.js';
import protectRoute from '../middleware/protectRoute.js';



authRoutes.post('/register', register);
authRoutes.get('/me', protectRoute ,getMe);
authRoutes.post('/login', login);
authRoutes.post('/logout', logout);

export default authRoutes;
