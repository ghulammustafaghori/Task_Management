const express = require('express');
const { addTask, getMyTasks, getTask, updateTask, deleteTask } = require('../Controllers/taskController');
const { veryfyToken } = require('../Controllers/userController');
const router = express.Router();

router.post('/addTask', veryfyToken, addTask);  // Add task
router.get('/myTasks', veryfyToken, getMyTasks); // Task list
router.get('/getTask/:id', veryfyToken, getTask);  // Get single task
router.put('/updateTask/:id', veryfyToken, updateTask);  // Update task
router.delete('/deleteTask/:id', veryfyToken, deleteTask);   // Delete task

module.exports = router;