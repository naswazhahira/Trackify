const express = require('express');
const router = express.Router();
const dailySummaryController = require('../controllers/dailySummaryController');
const authenticateToken = require('../middlewares/authMiddleware');

// Buat atau update daily summary
router.post('/create-or-update', authenticateToken, dailySummaryController.createOrUpdateDailySummary);

// Dapatkan daily summary by date
router.get('/get-by-date/:date', authenticateToken, dailySummaryController.getDailySummaryByDate);

// Dapatkan semua daily summaries user
router.get('/get-all', authenticateToken, dailySummaryController.getAllDailySummaries);

// Dapatkan daily summaries by date range
router.get('/get-by-date-range', authenticateToken, dailySummaryController.getDailySummariesByDateRange);

// Dapatkan weekly summaries (7 hari terakhir)
router.get('/get-weekly', authenticateToken, dailySummaryController.getWeeklySummaries);

// Dapatkan monthly summaries (30 hari terakhir)
router.get('/get-monthly', authenticateToken, dailySummaryController.getMonthlySummaries);

// Update total study time saja
router.put('/update-study-time', authenticateToken, dailySummaryController.updateTotalStudyTime);

// Update goals completed saja
router.put('/update-goals-completed', authenticateToken, dailySummaryController.updateGoalsCompleted);

// Hapus daily summary
router.delete('/delete/:date', authenticateToken, dailySummaryController.deleteDailySummary);

// Dapatkan statistik bulanan
router.get('/get-monthly-stats', authenticateToken, dailySummaryController.getMonthlyStats);

module.exports = router;