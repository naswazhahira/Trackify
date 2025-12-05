const pool = require('../config/db');

// Buat folder baru
async function createFolder(userId, folderName, color = null) {
    const query = `
        INSERT INTO repository_folders(user_id, folder_name, color)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;
    const values = [userId, folderName, color];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

// Ambil semua folder milik user
async function getFoldersByUserId(userId) {
    const query = `
        SELECT * FROM repository_folders
        WHERE user_id = $1
        ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query, [userId]);
    return rows;
}

// Update folder (nama atau warna)
async function updateFolder(folderId, folderName, color) {
    const query = `
        UPDATE repository_folders
        SET folder_name = $1,
            color = $2
        WHERE id = $3
        RETURNING *;
    `;
    const values = [folderName, color, folderId];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

// Hapus folder (+ file di dalam folder)
async function deleteFolder(folderId, userId) {
    const check = await pool.query(
        `SELECT * FROM repository_folders WHERE id = $1 AND user_id = $2`,
        [folderId, userId]
    );
    if (check.rows.length === 0) {
        return null; // Folder tidak ada atau bukan milik user ini
    }

    await pool.query(`DELETE FROM repository_files WHERE folder_id = $1`, [folderId]);

    const query = `
        DELETE FROM repository_folders
        WHERE id = $1 AND user_id = $2
        RETURNING *;
    `;

    const { rows } = await pool.query(query, [folderId, userId]);
    return rows[0];
}

module.exports = {
    createFolder,
    getFoldersByUserId,
    updateFolder,
    deleteFolder
};

