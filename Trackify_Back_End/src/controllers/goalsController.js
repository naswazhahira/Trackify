const goalsService = require('../services/goalsService');

// goalsController.js - function createGoal
async function createGoal(req, res) {
    try {
        const user_id = req.user.id; // ✅ INI HARUS ADA
        const { title, dailyTargetTime, targetDate, status = 'active' } = req.body;
        
        if (!title || !dailyTargetTime || !targetDate) {
            return res.status(400).json({ error: 'Judul, target waktu harian, dan target tanggal wajib diisi.' });
        }

        // ✅ PASTIKAN user_id dikirim ke service
        const newGoal = await goalsService.createGoal(user_id, title, dailyTargetTime, targetDate, status);

        return res.status(201).json({
            message: 'Goal berhasil dibuat.',
            goal: newGoal
        });
    } catch (err) {
        console.error('Error detail:', err);
        return res.status(500).json({ error: err.message });
    }
}

// Dapatkan semua goals - DITAMBAH user_id
async function getAllGoals(req, res) {
    try {
        const user_id = req.user.id; // Ambil user_id dari auth middleware
        const goals = await goalsService.getAllGoals(user_id);
        
        return res.status(200).json({
            message: 'Goals berhasil diambil.',
            goals: goals,
            total: goals.length
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Dapatkan goal by ID - DITAMBAH user_id
async function getGoalById(req, res) {
    try {
        const user_id = req.user.id; // Ambil user_id dari auth middleware
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: 'ID goal wajib diisi.' });
        }

        const goal = await goalsService.getGoalById(parseInt(id), user_id);
        if (!goal) {
            return res.status(404).json({ error: 'Goal tidak ditemukan.' });
        }

        return res.status(200).json({
            message: 'Goal berhasil diambil.',
            goal: goal
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Update goal - DITAMBAH user_id
async function updateGoal(req, res) {
    try {
        const user_id = req.user.id; // Ambil user_id dari auth middleware
        const { id } = req.params;
        const { title, dailyTargetTime, targetDate, status } = req.body;
        
        if (!id) {
            return res.status(400).json({ error: 'ID goal wajib diisi.' });
        }

        const existingGoal = await goalsService.getGoalById(parseInt(id), user_id);
        if (!existingGoal) {
            return res.status(404).json({ error: 'Goal tidak ditemukan.' });
        }

        const updatedGoal = await goalsService.updateGoal(
            parseInt(id), 
            user_id,
            title || existingGoal.title,
            dailyTargetTime || existingGoal.daily_target_time,
            targetDate || existingGoal.target_date,
            status || existingGoal.status
        );

        return res.status(200).json({
            message: 'Goal berhasil diperbarui.',
            goal: updatedGoal
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Hapus goal - DITAMBAH user_id
async function deleteGoal(req, res) {
    try {
        const user_id = req.user.id; // Ambil user_id dari auth middleware
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: 'ID goal wajib diisi.' });
        }

        const existingGoal = await goalsService.getGoalById(parseInt(id), user_id);
        if (!existingGoal) {
            return res.status(404).json({ error: 'Goal tidak ditemukan.' });
        }

        const deletedGoal = await goalsService.deleteGoal(parseInt(id), user_id);

        return res.status(200).json({
            message: 'Goal berhasil dihapus.',
            goal: deletedGoal
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Dapatkan goals by status - DITAMBAH user_id
async function getGoalsByStatus(req, res) {
    try {
        const user_id = req.user.id; // Ambil user_id dari auth middleware
        const { status } = req.params;
        
        if (!status) {
            return res.status(400).json({ error: 'Status wajib diisi.' });
        }

        const goals = await goalsService.getGoalsByStatus(user_id, status);

        return res.status(200).json({
            message: `Goals dengan status ${status} berhasil diambil.`,
            goals: goals,
            total: goals.length
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Update status goal - DITAMBAH user_id
async function updateGoalStatus(req, res) {
    try {
        const user_id = req.user.id; // Ambil user_id dari auth middleware
        const { id } = req.params;
        const { status } = req.body;
        
        if (!id || !status) {
            return res.status(400).json({ error: 'ID goal dan status wajib diisi.' });
        }

        const existingGoal = await goalsService.getGoalById(parseInt(id), user_id);
        if (!existingGoal) {
            return res.status(404).json({ error: 'Goal tidak ditemukan.' });
        }

        const updatedGoal = await goalsService.updateGoalStatus(parseInt(id), user_id, status);

        return res.status(200).json({
            message: 'Status goal berhasil diperbarui.',
            goal: updatedGoal
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Cari goals by title - DITAMBAH user_id
async function searchGoals(req, res) {
    try {
        const user_id = req.user.id; // Ambil user_id dari auth middleware
        const { keyword } = req.query;
        
        if (!keyword) {
            return res.status(400).json({ error: 'Kata kunci pencarian wajib diisi.' });
        }

        const goals = await goalsService.searchGoalsByTitle(user_id, keyword);

        return res.status(200).json({
            message: `Pencarian untuk "${keyword}" berhasil.`,
            goals: goals,
            total: goals.length
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Dapatkan goals aktif dengan target date mendatang - DITAMBAH user_id
async function getActiveGoals(req, res) {
    try {
        const user_id = req.user.id; // Ambil user_id dari auth middleware
        const goals = await goalsService.getActiveGoalsWithFutureDate(user_id);

        return res.status(200).json({
            message: 'Goals aktif berhasil diambil.',
            goals: goals,
            total: goals.length
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Dapatkan goals yang sudah lewat - DITAMBAH user_id
async function getOverdueGoals(req, res) {
    try {
        const user_id = req.user.id; // Ambil user_id dari auth middleware
        const goals = await goalsService.getOverdueGoals(user_id);

        return res.status(200).json({
            message: 'Goals yang sudah lewat berhasil diambil.',
            goals: goals,
            total: goals.length
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Update judul goal - DITAMBAH user_id
async function updateGoalTitle(req, res) {
    try {
        const user_id = req.user.id; // Ambil user_id dari auth middleware
        const { id } = req.params;
        const { title } = req.body;
        
        if (!id || !title) {
            return res.status(400).json({ error: 'ID goal dan judul wajib diisi.' });
        }

        const existingGoal = await goalsService.getGoalById(parseInt(id), user_id);
        if (!existingGoal) {
            return res.status(404).json({ error: 'Goal tidak ditemukan.' });
        }

        const updatedGoal = await goalsService.updateGoalTitle(parseInt(id), user_id, title);

        return res.status(200).json({
            message: 'Judul goal berhasil diperbarui.',
            goal: updatedGoal
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Update target waktu harian - DITAMBAH user_id
async function updateGoalDailyTarget(req, res) {
    try {
        const user_id = req.user.id; // Ambil user_id dari auth middleware
        const { id } = req.params;
        const { dailyTargetTime } = req.body;
        
        if (!id || !dailyTargetTime) {
            return res.status(400).json({ error: 'ID goal dan target waktu harian wajib diisi.' });
        }

        const existingGoal = await goalsService.getGoalById(parseInt(id), user_id);
        if (!existingGoal) {
            return res.status(404).json({ error: 'Goal tidak ditemukan.' });
        }

        const updatedGoal = await goalsService.updateGoalDailyTarget(parseInt(id), user_id, dailyTargetTime);

        return res.status(200).json({
            message: 'Target waktu harian berhasil diperbarui.',
            goal: updatedGoal
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Update target tanggal - DITAMBAH user_id
async function updateGoalTargetDate(req, res) {
    try {
        const user_id = req.user.id; // Ambil user_id dari auth middleware
        const { id } = req.params;
        const { targetDate } = req.body;
        
        if (!id || !targetDate) {
            return res.status(400).json({ error: 'ID goal dan target tanggal wajib diisi.' });
        }

        const existingGoal = await goalsService.getGoalById(parseInt(id), user_id);
        if (!existingGoal) {
            return res.status(404).json({ error: 'Goal tidak ditemukan.' });
        }

        const updatedGoal = await goalsService.updateGoalTargetDate(parseInt(id), user_id, targetDate);

        return res.status(200).json({
            message: 'Target tanggal berhasil diperbarui.',
            goal: updatedGoal
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// FUNGSI BARU: Dapatkan goals by date - untuk kebutuhan frontend
async function getGoalsByDate(req, res) {
    try {
        const user_id = req.user.id;
        const { date } = req.params;
        
        if (!date) {
            return res.status(400).json({ error: 'Tanggal wajib diisi.' });
        }

        const goals = await goalsService.getGoalsByUserIdAndDate(user_id, date);

        return res.status(200).json({
            message: `Goals untuk tanggal ${date} berhasil diambil.`,
            goals: goals,
            total: goals.length
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// FUNGSI BARU: Soft delete goal
async function softDeleteGoal(req, res) {
    try {
        const user_id = req.user.id;
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ error: 'ID goal wajib diisi.' });
        }

        const existingGoal = await goalsService.getGoalById(parseInt(id), user_id);
        if (!existingGoal) {
            return res.status(404).json({ error: 'Goal tidak ditemukan.' });
        }

        const deletedGoal = await goalsService.softDeleteGoal(parseInt(id), user_id);

        return res.status(200).json({
            message: 'Goal berhasil dihapus.',
            goal: deletedGoal
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

module.exports = {
    createGoal,
    getAllGoals,
    getGoalById,
    updateGoal,
    deleteGoal,
    getGoalsByStatus,
    updateGoalStatus,
    searchGoals,
    getActiveGoals,
    getOverdueGoals,
    updateGoalTitle,
    updateGoalDailyTarget,
    updateGoalTargetDate,
    getGoalsByDate,
    softDeleteGoal
};