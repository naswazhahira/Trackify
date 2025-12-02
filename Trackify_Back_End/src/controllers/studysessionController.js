const studySessionService = require('../services/studysessionService');

// Buat study session baru
async function createStudySession(req, res) {
    try {
        const { goalId, startTime } = req.body;
        const userId = req.user.id; // DARI TOKEN JWT

        console.log('Creating study session - User ID:', userId, 'Goal ID:', goalId);

        if (!startTime) {
            return res.status(400).json({ error: 'Start time wajib diisi.' });
        }

        if (!userId) {
            return res.status(400).json({ error: 'User ID tidak ditemukan.' });
        }

        const newSession = await studySessionService.createStudySession(
            userId, goalId, startTime
        );

        return res.status(201).json({
            message: 'Study session berhasil dibuat.',
            session: newSession
        });
    } catch (err) {
        console.error('Error detail:', err);
        return res.status(500).json({ error: err.message });
    }
}

// Complete study session
async function completeStudySession(req, res) {
    try {
        const { id } = req.params;
        const { endTime } = req.body;
        const userId = req.user.id;

        console.log('Completing session - Session ID:', id, 'User ID:', userId, 'End Time:', endTime);

        if (!endTime) {
            return res.status(400).json({ error: 'End time wajib diisi.' });
        }

        // Cek session exists
        const session = await studySessionService.getStudySessionById(id);
        if (!session) {
            console.log('Session not found for ID:', id);
            return res.status(404).json({ error: 'Study session tidak ditemukan.' });
        }

        console.log('Found session:', session);

        // Check ownership
        if (session.user_id !== userId) {
            console.log('Ownership mismatch - Session user:', session.user_id, 'Request user:', userId);
            return res.status(403).json({ error: 'Akses ditolak.' });
        }

        // Complete the session
        const completedSession = await studySessionService.completeStudySession(id, endTime);
        console.log('Session completed successfully:', completedSession);

        return res.status(200).json({
            message: 'Study session berhasil diselesaikan.',
            session: completedSession
        });
    } catch (err) {
        console.error('❌ Error in completeStudySession:', err);
        console.error('Error stack:', err.stack);
        return res.status(500).json({ error: 'Terjadi kesalahan server: ' + err.message });
    }
}

// Dapatkan active study session
async function getActiveStudySession(req, res) {
    try {
        const userId = req.user.id; // DARI TOKEN JWT
        const activeSession = await studySessionService.getActiveStudySession(userId);

        return res.status(200).json({
            message: 'Active session berhasil diambil.',
            session: activeSession
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Dapatkan study sessions untuk user
async function getStudySessions(req, res) {
    try {
        const userId = req.user.id; // DARI TOKEN JWT
        const sessions = await studySessionService.getStudySessionsByUser(userId);

        return res.status(200).json({
            message: 'Study sessions berhasil diambil.',
            sessions: sessions,
            total: sessions.length
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Dapatkan study sessions by goal
async function getStudySessionsByGoal(req, res) {
    try {
        const { goalId } = req.params;
        const userId = req.user.id; // DARI TOKEN JWT

        const sessions = await studySessionService.getStudySessionsByGoal(goalId);

        // Filter ownership
        const userSessions = sessions.filter(session => session.user_id === userId);

        return res.status(200).json({
            message: 'Study sessions berhasil diambil.',
            sessions: userSessions,
            total: userSessions.length
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Dapatkan study sessions by date
async function getStudySessionsByDate(req, res) {
    try {
        const { date } = req.params;
        const userId = req.user.id; // DARI TOKEN JWT

        const sessions = await studySessionService.getStudySessionsByDate(userId, date);

        return res.status(200).json({
            message: `Study sessions untuk tanggal ${date} berhasil diambil.`,
            sessions: sessions,
            total: sessions.length
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Dapatkan today's study time
async function getTodayStudyTime(req, res) {
    try {
        const userId = req.user.id; // DARI TOKEN JWT
        const totalSeconds = await studySessionService.getTodayStudyTime(userId);

        return res.status(200).json({
            message: "Today's study time berhasil diambil.",
            total_seconds: totalSeconds
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Hapus study session
async function deleteStudySession(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id; // DARI TOKEN JWT

        const session = await studySessionService.getStudySessionById(id);
        if (!session) {
            return res.status(404).json({ error: 'Study session tidak ditemukan.' });
        }

        if (session.user_id !== userId) {
            return res.status(403).json({ error: 'Akses ditolak.' });
        }

        const deletedSession = await studySessionService.deleteStudySession(id);

        return res.status(200).json({
            message: 'Study session berhasil dihapus.',
            session: deletedSession
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Dapatkan statistics
async function getStudyStats(req, res) {
    try {
        const userId = req.user.id; // DARI TOKEN JWT
        const { startDate, endDate } = req.query;

        const stats = await studySessionService.getStudyStatistics(
            userId, 
            startDate || new Date('2000-01-01'), 
            endDate || new Date()
        );

        return res.status(200).json({
            message: 'Statistics berhasil diambil.',
            statistics: stats
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Dapatkan recent sessions
async function getRecentSessions(req, res) {
    try {
        const userId = req.user.id; // DARI TOKEN JWT
        const { limit } = req.query;

        const sessions = await studySessionService.getRecentStudySessions(userId, parseInt(limit) || 10);

        return res.status(200).json({
            message: 'Recent sessions berhasil diambil.',
            sessions: sessions,
            total: sessions.length
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

module.exports = {
    createStudySession,
    completeStudySession,
    getActiveStudySession,
    getStudySessions,
    getStudySessionsByGoal,
    getStudySessionsByDate,
    getTodayStudyTime,
    deleteStudySession,
    getStudyStats,
    getRecentSessions
};