import express from "express";
import {
    getTasks,
    createTask,
    deleteTask,
    updateTask,
} from "../controllers/taskController.js";

import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", getTasks);
router.post("/", createTask);
router.delete("/:id", deleteTask);
router.put("/:id", updateTask);

export default router;