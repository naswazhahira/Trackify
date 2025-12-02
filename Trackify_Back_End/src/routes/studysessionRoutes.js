const express = require('express');
const router = express.Router();
const studysessionController = require('../controllers/studysessionController');
const authenticateToken = require('../middlewares/authMiddleware');

// Study Session routes
router.post('/create-session', authenticateToken, studysessionController.createStudySession);
router.put('/complete-session/:id', authenticateToken, studysessionController.completeStudySession);
router.get('/get-active-session', authenticateToken, studysessionController.getActiveStudySession);
router.get('/get-sessions', authenticateToken, studysessionController.getStudySessions);
router.get('/get-sessions-by-goal/:goalId', authenticateToken, studysessionController.getStudySessionsByGoal);
router.get('/get-sessions-by-date/:date', authenticateToken, studysessionController.getStudySessionsByDate);
router.get('/get-today-time', authenticateToken, studysessionController.getTodayStudyTime);
router.delete('/delete-session/:id', authenticateToken, studysessionController.deleteStudySession);
router.get('/get-stats', authenticateToken, studysessionController.getStudyStats);
router.get('/get-recent-sessions', authenticateToken, studysessionController.getRecentSessions);

module.exports = router;