import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    title: String,
    desc: String,
    isCompleted: {type: Boolean, default: false},
    dueDate: Date,
    category: String,
    priority: String,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
})

export default mongoose.model("Task", taskSchema);