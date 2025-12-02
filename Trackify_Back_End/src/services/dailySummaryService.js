const pool = require('../config/db');

// Buat atau update daily summary
async function createOrUpdateDailySummary(user_id, summary_date, total_study_time_seconds, goals_completed) {
    const query = `
        INSERT INTO daily_summaries (user_id, summary_date, total_study_time_seconds, goals_completed)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (user_id, summary_date) 
        DO UPDATE SET 
            total_study_time_seconds = EXCLUDED.total_study_time_seconds,
            goals_completed = EXCLUDED.goals_completed,
            created_at = CURRENT_TIMESTAMP
        RETURNING *;
    `;
    const values = [user_id, summary_date, total_study_time_seconds, goals_completed];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

// Dapatkan daily summary by user_id dan date
async function getDailySummaryByDate(user_id, summary_date) {
    const query = `
        SELECT * FROM daily_summaries 
        WHERE user_id = $1 AND summary_date = $2;
    `;
    const { rows } = await pool.query(query, [user_id, summary_date]);
    return rows[0];
}

// Dapatkan semua daily summaries user
async function getAllDailySummaries(user_id) {
    const query = `
        SELECT * FROM daily_summaries 
        WHERE user_id = $1 
        ORDER BY summary_date DESC;
    `;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
}

// Dapatkan daily summaries dalam range tanggal
async function getDailySummariesByDateRange(user_id, start_date, end_date) {
    const query = `
        SELECT * FROM daily_summaries 
        WHERE user_id = $1 AND summary_date BETWEEN $2 AND $3
        ORDER BY summary_date ASC;
    `;
    const { rows } = await pool.query(query, [user_id, start_date, end_date]);
    return rows;
}

// Dapatkan weekly summaries (7 hari terakhir)
async function getWeeklySummaries(user_id) {
    const query = `
        SELECT * FROM daily_summaries 
        WHERE user_id = $1 AND summary_date >= CURRENT_DATE - INTERVAL '7 days'
        ORDER BY summary_date ASC;
    `;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
}

// Dapatkan monthly summaries (30 hari terakhir)
async function getMonthlySummaries(user_id) {
    const query = `
        SELECT * FROM daily_summaries 
        WHERE user_id = $1 AND summary_date >= CURRENT_DATE - INTERVAL '30 days'
        ORDER BY summary_date ASC;
    `;
    const { rows } = await pool.query(query, [user_id]);
    return rows;
}

// Update total study time
async function updateTotalStudyTime(user_id, summary_date, total_study_time_seconds) {
    const query = `
        INSERT INTO daily_summaries (user_id, summary_date, total_study_time_seconds, goals_completed)
        VALUES ($1, $2, $3, 0)
        ON CONFLICT (user_id, summary_date) 
        DO UPDATE SET 
            total_study_time_seconds = EXCLUDED.total_study_time_seconds,
            created_at = CURRENT_TIMESTAMP
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [user_id, summary_date, total_study_time_seconds]);
    return rows[0];
}

// Update goals completed
async function updateGoalsCompleted(user_id, summary_date, goals_completed) {
    const query = `
        INSERT INTO daily_summaries (user_id, summary_date, total_study_time_seconds, goals_completed)
        VALUES ($1, $2, 0, $3)
        ON CONFLICT (user_id, summary_date) 
        DO UPDATE SET 
            goals_completed = EXCLUDED.goals_completed,
            created_at = CURRENT_TIMESTAMP
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [user_id, summary_date, goals_completed]);
    return rows[0];
}

// Hapus daily summary
async function deleteDailySummary(user_id, summary_date) {
    const query = `
        DELETE FROM daily_summaries 
        WHERE user_id = $1 AND summary_date = $2
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [user_id, summary_date]);
    return rows[0];
}

// Dapatkan statistik bulan ini
async function getMonthlyStats(user_id) {
    const query = `
        SELECT 
            COUNT(*) as total_days,
            COALESCE(SUM(total_study_time_seconds), 0) as total_study_seconds,
            COALESCE(SUM(goals_completed), 0) as total_goals_completed,
            COALESCE(AVG(total_study_time_seconds), 0) as avg_daily_study_seconds
        FROM daily_summaries 
        WHERE user_id = $1 
        AND summary_date >= DATE_TRUNC('month', CURRENT_DATE)
        AND summary_date < DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month';
    `;
    const { rows } = await pool.query(query, [user_id]);
    return rows[0];
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