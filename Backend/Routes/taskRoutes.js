const express = require('express');
const { addTask, getMyTasks, getTask, updateTask, deleteTask } = require('../Controllers/taskController');
const { veryfyToken } = require('../Controllers/userController');
const router = express.Router();

router.post('/addTask', veryfyToken, addTask);
router.get('/myTasks', veryfyToken, getMyTasks);
router.get('/getTask/:id', veryfyToken, getTask);
router.put('/updateTask/:id', veryfyToken, updateTask);
router.delete('/deleteTask/:id', veryfyToken, deleteTask);

module.exports = router;