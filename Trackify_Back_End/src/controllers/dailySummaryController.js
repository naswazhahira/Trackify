const dailySummaryService = require('../services/dailySummaryService');

// Buat atau update daily summary
async function createOrUpdateDailySummary(req, res) {
    try {
        const user_id = req.user.id;
        const { summary_date, total_study_time_seconds, goals_completed } = req.body;
        
        if (!summary_date) {
            return res.status(400).json({ error: 'Tanggal summary wajib diisi.' });
        }

        const summary = await dailySummaryService.createOrUpdateDailySummary(
            user_id, 
            summary_date, 
            total_study_time_seconds || 0, 
            goals_completed || 0
        );

        return res.status(200).json({
            message: 'Daily summary berhasil disimpan.',
            summary: summary
        });
    } catch (err) {
        console.error('Error detail:', err);
        return res.status(500).json({ error: err.message });
    }
}

// Dapatkan daily summary by date
async function getDailySummaryByDate(req, res) {
    try {
        const user_id = req.user.id;
        const { date } = req.params;
        
        if (!date) {
            return res.status(400).json({ error: 'Tanggal wajib diisi.' });
        }

        const summary = await dailySummaryService.getDailySummaryByDate(user_id, date);
        
        if (!summary) {
            return res.status(404).json({ 
                message: 'Daily summary tidak ditemukan.',
                summary: null 
            });
        }

        return res.status(200).json({
            message: 'Daily summary berhasil diambil.',
            summary: summary
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Dapatkan semua daily summaries user
async function getAllDailySummaries(req, res) {
    try {
        const user_id = req.user.id;
        const summaries = await dailySummaryService.getAllDailySummaries(user_id);

        return res.status(200).json({
            message: 'Daily summaries berhasil diambil.',
            summaries: summaries,
            total: summaries.length
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Dapatkan daily summaries by date range
async function getDailySummariesByDateRange(req, res) {
    try {
        const user_id = req.user.id;
        const { start_date, end_date } = req.query;
        
        if (!start_date || !end_date) {
            return res.status(400).json({ error: 'Start date dan end date wajib diisi.' });
        }

        const summaries = await dailySummaryService.getDailySummariesByDateRange(user_id, start_date, end_date);

        return res.status(200).json({
            message: `Daily summaries dari ${start_date} hingga ${end_date} berhasil diambil.`,
            summaries: summaries,
            total: summaries.length
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Dapatkan weekly summaries
async function getWeeklySummaries(req, res) {
    try {
        const user_id = req.user.id;
        const summaries = await dailySummaryService.getWeeklySummaries(user_id);

        return res.status(200).json({
            message: 'Weekly summaries berhasil diambil.',
            summaries: summaries,
            total: summaries.length
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Dapatkan monthly summaries
async function getMonthlySummaries(req, res) {
    try {
        const user_id = req.user.id;
        const summaries = await dailySummaryService.getMonthlySummaries(user_id);

        return res.status(200).json({
            message: 'Monthly summaries berhasil diambil.',
            summaries: summaries,
            total: summaries.length
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Update total study time saja
async function updateTotalStudyTime(req, res) {
    try {
        const user_id = req.user.id;
        const { summary_date, total_study_time_seconds } = req.body;
        
        if (!summary_date || total_study_time_seconds === undefined) {
            return res.status(400).json({ error: 'Tanggal dan total study time wajib diisi.' });
        }

        const summary = await dailySummaryService.updateTotalStudyTime(
            user_id, 
            summary_date, 
            parseInt(total_study_time_seconds)
        );

        return res.status(200).json({
            message: 'Total study time berhasil diperbarui.',
            summary: summary
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Update goals completed saja
async function updateGoalsCompleted(req, res) {
    try {
        const user_id = req.user.id;
        const { summary_date, goals_completed } = req.body;
        
        if (!summary_date || goals_completed === undefined) {
            return res.status(400).json({ error: 'Tanggal dan goals completed wajib diisi.' });
        }

        const summary = await dailySummaryService.updateGoalsCompleted(
            user_id, 
            summary_date, 
            parseInt(goals_completed)
        );

        return res.status(200).json({
            message: 'Goals completed berhasil diperbarui.',
            summary: summary
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Hapus daily summary
async function deleteDailySummary(req, res) {
    try {
        const user_id = req.user.id;
        const { date } = req.params;
        
        if (!date) {
            return res.status(400).json({ error: 'Tanggal wajib diisi.' });
        }

        const deletedSummary = await dailySummaryService.deleteDailySummary(user_id, date);

        if (!deletedSummary) {
            return res.status(404).json({ error: 'Daily summary tidak ditemukan.' });
        }

        return res.status(200).json({
            message: 'Daily summary berhasil dihapus.',
            summary: deletedSummary
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Dapatkan statistik bulan ini
async function getMonthlyStats(req, res) {
    try {
        const user_id = req.user.id;
        const stats = await dailySummaryService.getMonthlyStats(user_id);

        return res.status(200).json({
            message: 'Statistik bulanan berhasil diambil.',
            stats: stats
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

module.exports = {
    createOrUpdateDailySummary,
    getDailySummaryByDate,
    getAllDailySummaries,
    getDailySummariesByDateRange,
    getWeeklySummaries,
    getMonthlySummaries,
    updateTotalStudyTime,
    updateGoalsCompleted,
    deleteDailySummary,
    getMonthlyStats
};