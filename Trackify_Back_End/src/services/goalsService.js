const pool = require('../config/db');

// Buat goal baru - DITAMBAH user_id
async function createGoal(user_id, title, dailyTargetTime, targetDate, status = 'active') {
    const query = `
        INSERT INTO goals(user_id, title, daily_target_time, target_date, status)
        VALUES($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const values = [user_id, title, dailyTargetTime, targetDate, status];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

// Dapatkan semua goals - DITAMBAH filter by user_id
async function getAllGoals(user_id) {
    const query = `SELECT * FROM goals WHERE user_id = $1 ORDER BY created_at DESC;`;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
}

// Dapatkan goal by ID - DITAMBAH filter by user_id
async function getGoalById(id, user_id) {
    const query = `SELECT * FROM goals WHERE id = $1 AND user_id = $2;`;
    const { rows } = await pool.query(query, [id, user_id]);
    return rows[0];
}

// Update goal - DITAMBAH filter by user_id
async function updateGoal(id, user_id, title, dailyTargetTime, targetDate, status) {
    const query = `
        UPDATE goals
        SET title = $1,
            daily_target_time = $2,
            target_date = $3,
            status = $4,
            updated_at = NOW()
        WHERE id = $5 AND user_id = $6
        RETURNING *;
    `;
    const values = [title, dailyTargetTime, targetDate, status, id, user_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

// Hapus goal - DITAMBAH filter by user_id
async function deleteGoal(id, user_id) {
    const query = `
        DELETE FROM goals
        WHERE id = $1 AND user_id = $2
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [id, user_id]);
    return rows[0];
}

// Dapatkan goals by status - DITAMBAH filter by user_id
async function getGoalsByStatus(user_id, status) {
    const query = `SELECT * FROM goals WHERE user_id = $1 AND status = $2 ORDER BY created_at DESC;`;
    const { rows } = await pool.query(query, [user_id, status]);
    return rows;
}

// Update status goal - DITAMBAH filter by user_id
async function updateGoalStatus(id, user_id, status) {
    const query = `
        UPDATE goals
        SET status = $1,
            updated_at = NOW()
        WHERE id = $2 AND user_id = $3
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [status, id, user_id]);
    return rows[0];
}

// Cari goals by title - DITAMBAH filter by user_id
async function searchGoalsByTitle(user_id, keyword) {
    const query = `SELECT * FROM goals WHERE user_id = $1 AND title ILIKE $2 ORDER BY created_at DESC;`;
    const { rows } = await pool.query(query, [user_id, `%${keyword}%`]);
    return rows;
}

// Dapatkan goals aktif dengan target date mendatang - DITAMBAH filter by user_id
async function getActiveGoalsWithFutureDate(user_id) {
    const query = `
        SELECT * FROM goals 
        WHERE user_id = $1 AND status = 'active' AND target_date >= CURRENT_DATE 
        ORDER BY target_date ASC;
    `;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
}

// Dapatkan goals yang sudah lewat target date - DITAMBAH filter by user_id
async function getOverdueGoals(user_id) {
    const query = `
        SELECT * FROM goals 
        WHERE user_id = $1 AND status = 'active' AND target_date < CURRENT_DATE 
        ORDER BY target_date ASC;
    `;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
}

// Update hanya judul goal - DITAMBAH filter by user_id
async function updateGoalTitle(id, user_id, title) {
    const query = `
        UPDATE goals
        SET title = $1,
            updated_at = NOW()
        WHERE id = $2 AND user_id = $3
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [title, id, user_id]);
    return rows[0];
}

// Update hanya target waktu harian - DITAMBAH filter by user_id
async function updateGoalDailyTarget(id, user_id, dailyTargetTime) {
    const query = `
        UPDATE goals
        SET daily_target_time = $1,
            updated_at = NOW()
        WHERE id = $2 AND user_id = $3
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [dailyTargetTime, id, user_id]);
    return rows[0];
}

// Update hanya target tanggal - DITAMBAH filter by user_id
async function updateGoalTargetDate(id, user_id, targetDate) {
    const query = `
        UPDATE goals
        SET target_date = $1,
            updated_at = NOW()
        WHERE id = $2 AND user_id = $3
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [targetDate, id, user_id]);
    return rows[0];
}

// FUNGSI BARU: Dapatkan goals by user_id dan target_date
async function getGoalsByUserIdAndDate(user_id, target_date) {
    const query = `
        SELECT * FROM goals 
        WHERE user_id = $1 AND target_date = $2 AND status != 'deleted' 
        ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query, [user_id, target_date]);
    return rows;
}

// FUNGSI BARU: Dapatkan goals untuk grafik mingguan
async function getWeeklyGoals(user_id, start_date, end_date) {
    const query = `
        SELECT * FROM goals 
        WHERE user_id = $1 AND target_date BETWEEN $2 AND $3 AND status != 'deleted'
        ORDER BY target_date ASC;
    `;
    const { rows } = await pool.query(query, [user_id, start_date, end_date]);
    return rows;
}

// FUNGSI BARU: Soft delete goal
async function softDeleteGoal(id, user_id) {
    const query = `
        UPDATE goals
        SET status = 'deleted',
            updated_at = NOW()
        WHERE id = $1 AND user_id = $2
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [id, user_id]);
    return rows[0];
}

module.exports = {
    createGoal,
    getAllGoals,
    getGoalById,
    updateGoal,
    deleteGoal,
    getGoalsByStatus,
    updateGoalStatus,
    searchGoalsByTitle,
    getActiveGoalsWithFutureDate,
    getOverdueGoals,
    updateGoalTitle,
    updateGoalDailyTarget,
    updateGoalTargetDate,
    getGoalsByUserIdAndDate,
    getWeeklyGoals,
    softDeleteGoal
};