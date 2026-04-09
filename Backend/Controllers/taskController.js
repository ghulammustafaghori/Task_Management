const taskModel = require('../models/taskModel');

// Add Task
const addTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const task = await taskModel.create({
            title,
            description,
            status: status || 'todo',
            userId: req.user.id  // comes from verifyToken middleware
        });
        //  Emit task-created event
    const io = req.app.get("io");
    io.emit("task-created", task); // everyone gets it
        res.status(201).json({ success: true, message: 'Task created', data: task });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Get all tasks for logged-in user
const getMyTasks = async (req, res) => {
    try {
        const tasks = await taskModel.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: tasks });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Get single task
const getTask = async (req, res) => {
    try {
        const task = await taskModel.findOne({ _id: req.params.id, userId: req.user.id });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        res.status(200).json({ success: true, data: task });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Update Task
const updateTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;
        const task = await taskModel.findOne({ _id: req.params.id, userId: req.user.id });
        if (!task) return res.status(404).json({ message: 'Task not found' });

        task.title = title;
        task.description = description;
        task.status = status;
        await task.save();

        // Emit event to all clients
    const io = req.app.get("io");
    io.emit("task-updated", task); // emit the updated task

        res.status(200).json({ success: true, message: 'Task updated successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// Delete Task
const deleteTask = async (req, res) => {
    try {
        const task = await taskModel.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!task) return res.status(404).json({ message: 'Task not found' });
        // Emit task-deleted event
    const io = req.app.get("io");
    io.emit("task-deleted", task._id); // emit the deleted task's id
        res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

module.exports = { addTask, getMyTasks, getTask, updateTask, deleteTask };