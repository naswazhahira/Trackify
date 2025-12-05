const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authenticateToken = require('../middlewares/authMiddleware');


// Buat task baru
router.post('/', authenticateToken, taskController.createTask);


// Ambil semua tasks user 
router.get('/', authenticateToken, taskController.getUserTasks);


// Ambil tasks berdasarkan tanggal
router.get('/date/:date', authenticateToken, taskController.getTasksByDate);


// Ambil statistik tasks
router.get('/stats', authenticateToken, taskController.getTaskStats);


// Cari tasks
router.get('/search', authenticateToken, taskController.searchTasks);


// Filter tasks
router.get('/filter', authenticateToken, taskController.filterTasks);


// Update task
router.put('/:id', authenticateToken, taskController.updateTask);


// Update status task
router.put('/:id/status', authenticateToken, taskController.updateTaskStatus);


// Hapus task
router.delete('/:id', authenticateToken, taskController.deleteTask);


module.exports = router;

