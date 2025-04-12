import Task from "../models/Task.js";

export const getTasks = async (req, res) => {
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
}

export const createTask = async (req, res) => {
    const task = await Task.create({ ...req.body, userId: req.userId });
    res.status(201).json(task);
}

export const deleteTask = async (req, res) => {
    await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: "Task deleted"});
}


export const updateTask = async (req, res) => {
    const updatedTask = await Task.findOneAndUpdate(
        { _id: req.params.id, userId: req.userId },
        req.body,
        {new: true}
    );
    res.json(updatedTask);
}
