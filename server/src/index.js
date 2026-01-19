import express from "express";
import dotenv from "dotenv";
dotenv.config();

import http from "http";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectToMongoDB from "./db/connectToMongoDB.js";
import authRoutes from "./routes/authRoutes.js";
import setupSocket from "./socket.js";

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);

/* ---------- MIDDLEWARE ---------- */
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

/* ---------- ROUTES ---------- */
app.use("/api/auth", authRoutes);

/* ---------- SOCKET ---------- */
setupSocket(server);

/* ---------- START ---------- */
server.listen(PORT, async () => {
    try {
        await connectToMongoDB();
        console.log(`Server running on port ${PORT}`);
    } catch (err) {
        console.error("MongoDB connection failed");
    }
});
