const pool = require('../config/db');

// Upload file
async function createFile(folderId, userId, fileName, fileUrl, fileType, fileSize) {
    const query = `
        INSERT INTO repository_files
        (folder_id, user_id, file_name, file_url, file_type, file_size)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
    `;
    const values = [folderId, userId, fileName, fileUrl, fileType, fileSize];
    const { rows } = await pool.query(query, values);
    return rows[0];
}


// Ambil semua file dalam folder (sudah ada)
async function getFilesByFolderId(folderId) {
    const query = `
        SELECT * FROM repository_files
        WHERE folder_id = $1
        ORDER BY uploaded_at DESC;
    `;
    const { rows } = await pool.query(query, [folderId]);
    return rows;
}


// Ambil semua file berdasarkan user_id (fungsi yang dibutuhkan)
async function getFilesByUserId(userId) {
    const query = `
        SELECT * FROM repository_files
        WHERE user_id = $1
        ORDER BY uploaded_at DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
}


// Update file (misalnya rename file)
async function updateFile(fileId, fileName) {
    const query = `
        UPDATE repository_files
        SET file_name = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [fileName, fileId]);
    return rows[0];
}


// Hapus file
async function deleteFile(fileId) {
    const query = `
        DELETE FROM repository_files
        WHERE id = $1
        RETURNING *;
    `;
    const { rows } = await pool.query(query, [fileId]);
    return rows[0];
}


// Export semua fungsi
module.exports = {
    createFile,
    getFilesByUserId,    
    getFilesByFolderId,  
    updateFile,          
    deleteFile,
};
