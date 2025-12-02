const pool = require('../config/db');

// Buat study session baru
async function createStudySession(userId, goalId, startTime) {
    const query = `
        INSERT INTO study_sessions(user_id, goal_id, start_time)
        VALUES($1, $2, $3)
        RETURNING *;
    `;
    const values = [userId, goalId, startTime];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

// Update end time dan hitung duration
async function completeStudySession(sessionId, endTime) {
    try {
        console.log('Completing session in service - Session ID:', sessionId, 'End Time:', endTime);
        
        // Dapatkan session data dulu
        const session = await getStudySessionById(sessionId);
        if (!session) {
            throw new Error('Session tidak ditemukan');
        }

        console.log('Session data:', session);

        // Hitung duration dalam seconds
        const startTime = new Date(session.start_time);
        const endTimeDate = new Date(endTime);
        const durationSeconds = Math.round((endTimeDate - startTime) / 1000);

        console.log('Calculated duration:', durationSeconds, 'seconds');

        const query = `
            UPDATE study_sessions 
            SET end_time = $1,
                duration_seconds = $2,
                updated_at = NOW()
            WHERE id = $3
            RETURNING *;
        `;
        const values = [endTime, durationSeconds, sessionId];
        
        console.log('Executing query with values:', values);
        
        const { rows } = await pool.query(query, values);
        
        if (rows.length === 0) {
            throw new Error('Gagal mengupdate study session');
        }

        console.log('Session updated successfully:', rows[0]);
        return rows[0];
    } catch (error) {
        console.error('❌ Error in completeStudySession service:', error);
        console.error('Error stack:', error.stack);
        throw error;
    }
}

// Dapatkan study session by ID
async function getStudySessionById(id) {
    try {
        const query = `
            SELECT ss.*, g.title as goal_title, u.username
            FROM study_sessions ss
            LEFT JOIN goals g ON ss.goal_id = g.id
            LEFT JOIN users u ON ss.user_id = u.id
            WHERE ss.id = $1;
        `;
        const { rows } = await pool.query(query, [id]);
        return rows[0]; // Return first row or undefined
    } catch (error) {
        console.error('Error in getStudySessionById:', error);
        throw error;
    }
}

// Dapatkan semua study sessions untuk user
async function getStudySessionsByUser(userId) {
    const query = `
        SELECT ss.*, g.title as goal_title
        FROM study_sessions ss
        LEFT JOIN goals g ON ss.goal_id = g.id
        WHERE ss.user_id = $1
        ORDER BY ss.start_time DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
}

// Dapatkan study sessions untuk goal tertentu
async function getStudySessionsByGoal(goalId) {
    const query = `
        SELECT ss.*, g.title as goal_title, u.username
        FROM study_sessions ss
        LEFT JOIN goals g ON ss.goal_id = g.id
        LEFT JOIN users u ON ss.user_id = u.id
        WHERE ss.goal_id = $1
        ORDER BY ss.start_time DESC;
    `;
    const { rows } = await pool.query(query, [goalId]);
    return rows;
}

// Dapatkan study sessions untuk tanggal tertentu
async function getStudySessionsByDate(userId, date) {
    const query = `
        SELECT ss.*, g.title as goal_title
        FROM study_sessions ss
        LEFT JOIN goals g ON ss.goal_id = g.id
        WHERE ss.user_id = $1 
        AND DATE(ss.start_time) = $2
        ORDER BY ss.start_time DESC;
    `;
    const { rows } = await pool.query(query, [userId, date]);
    return rows;
}

// Dapatkan active study session (yang belum selesai)
async function getActiveStudySession(userId) {
    const query = `
        SELECT ss.*, g.title as goal_title
        FROM study_sessions ss
        LEFT JOIN goals g ON ss.goal_id = g.id
        WHERE ss.user_id = $1 
        AND ss.end_time IS NULL
        ORDER BY ss.start_time DESC
        LIMIT 1;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows[0];
}

// Hapus study session
async function deleteStudySession(sessionId) {
    const query = `
        DELETE FROM study_sessions
        WHERE id = $1
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [sessionId]);
    return rows[0];
}

// Dapatkan total study time untuk user (dalam seconds)
async function getTotalStudyTimeByUser(userId) {
    const query = `
        SELECT COALESCE(SUM(duration_seconds), 0) as total_seconds
        FROM study_sessions 
        WHERE user_id = $1 AND duration_seconds IS NOT NULL;
    `;
    const { rows } = await pool.query(query, [userId]);
    return parseInt(rows[0]?.total_seconds) || 0;
}

// Dapatkan today's study time untuk user
async function getTodayStudyTime(userId) {
    const query = `
        SELECT COALESCE(SUM(duration_seconds), 0) as total_seconds
        FROM study_sessions 
        WHERE user_id = $1 
        AND DATE(start_time) = CURRENT_DATE
        AND duration_seconds IS NOT NULL;
    `;
    const { rows } = await pool.query(query, [userId]);
    return parseInt(rows[0]?.total_seconds) || 0;
}

// Dapatkan study statistics untuk user
async function getStudyStatistics(userId, startDate, endDate) {
    const query = `
        SELECT 
            COUNT(*) as total_sessions,
            COALESCE(SUM(duration_seconds), 0) as total_seconds,
            COALESCE(AVG(duration_seconds), 0) as avg_seconds,
            COALESCE(MAX(duration_seconds), 0) as max_seconds,
            COALESCE(MIN(duration_seconds), 0) as min_seconds
        FROM study_sessions 
        WHERE user_id = $1 
        AND duration_seconds IS NOT NULL
        AND start_time BETWEEN $2 AND $3;
    `;
    const { rows } = await pool.query(query, [userId, startDate, endDate]);
    return rows[0];
}

// Dapatkan recent study sessions
async function getRecentStudySessions(userId, limit = 10) {
    const query = `
        SELECT ss.*, g.title as goal_title
        FROM study_sessions ss
        LEFT JOIN goals g ON ss.goal_id = g.id
        WHERE ss.user_id = $1
        ORDER BY ss.start_time DESC
        LIMIT $2;
    `;
    const { rows } = await pool.query(query, [userId, limit]);
    return rows;
}

// Update goal_id untuk study session
async function updateStudySessionGoal(sessionId, goalId) {
    const query = `
        UPDATE study_sessions
        SET goal_id = $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [goalId, sessionId]);
    return rows[0];
}

module.exports = {
    createStudySession,
    completeStudySession,
    getStudySessionById,
    getStudySessionsByUser,
    getStudySessionsByGoal,
    getStudySessionsByDate,
    getActiveStudySession,
    deleteStudySession,
    getTotalStudyTimeByUser,
    getTodayStudyTime,
    getStudyStatistics,
    getRecentStudySessions,
    updateStudySessionGoal
};