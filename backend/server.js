import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import taskRoutes from "./routes/taskRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
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
    app.listen(5000, ()=> console.log("Server is running on port 5000"));
})

.catch(err => console.error(err));
