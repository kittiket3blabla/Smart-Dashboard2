import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./authRoutes.js";
import taskRoutes from "./taskRoutes.js"; 
import noteRoutes from "./noteRoutes.js";
import leaderboardRoutes from "./leaderboardRoutes.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Раздача статики
app.use(express.static(path.join(__dirname, '../public')));
app.use('/src', express.static(path.join(__dirname, '../src')));

app.use(cors());
app.use(express.json());

// API Роуты
app.use("/api", authRoutes);
app.use("/api/tasks", taskRoutes); 
app.use("/api/notes", noteRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

// ВАЖНО: Если юзер обновит страницу не на корне, отдаем index.html (для SPA)
app.use((req, res, next) => {
    // Если запрос не к API, отдаем главную страницу
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    }
});

const PORT = process.env.PORT || 4000;
// На Render ОБЯЗАТЕЛЬНО слушать на 0.0.0.0
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});