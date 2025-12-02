const express = require('express');
const router = express.Router();
const goalsController = require('../controllers/goalsController');
const authenticateToken = require('../middlewares/authMiddleware');

// Buat goal baru
router.post('/create-goal', authenticateToken, goalsController.createGoal);

// Dapatkan semua goals user
router.get('/get-goals', authenticateToken, goalsController.getAllGoals);

// Dapatkan goal by ID
router.get('/get-goal/:id', authenticateToken, goalsController.getGoalById);

// Update goal
router.put('/update-goal/:id', authenticateToken, goalsController.updateGoal);

// Hapus goal
router.delete('/delete-goal/:id', authenticateToken, goalsController.deleteGoal);

// Dapatkan goals by status
router.get('/get-goals-by-status/:status', authenticateToken, goalsController.getGoalsByStatus);

// Update status goal
router.put('/update-goal-status/:id', authenticateToken, goalsController.updateGoalStatus);

// Cari goals by title
router.get('/search-goals', authenticateToken, goalsController.searchGoals);

// Dapatkan goals aktif
router.get('/get-active-goals', authenticateToken, goalsController.getActiveGoals);

// Dapatkan goals yang sudah lewat
router.get('/get-overdue-goals', authenticateToken, goalsController.getOverdueGoals);

// Update hanya judul goal
router.put('/update-goal-title/:id', authenticateToken, goalsController.updateGoalTitle);

// Update hanya target waktu harian
router.put('/update-daily-target/:id', authenticateToken, goalsController.updateGoalDailyTarget);

// Update hanya target tanggal
router.put('/update-target-date/:id', authenticateToken, goalsController.updateGoalTargetDate);

// ✅ TAMBAHAN ROUTES BARU
// Dapatkan goals by tanggal spesifik (untuk frontend)
router.get('/get-goals-by-date/:date', authenticateToken, goalsController.getGoalsByDate);

// Soft delete goal (recommended)
router.put('/soft-delete-goal/:id', authenticateToken, goalsController.softDeleteGoal);

module.exports = router;