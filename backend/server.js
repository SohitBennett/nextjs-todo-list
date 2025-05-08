import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

// Middlewares
// app.use(cors());
app.use(cors({
    origin: process.env.FRONTEND_URL || "*", // safer to whitelist your frontend URL
    credentials: true
}));
app.use(express.json());

// Routes 
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// db
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true,
})
.then(() => {
    app.listen(port, ()=> console.log("Server is running on port 5000"));
})

.catch(err => console.error(err));
