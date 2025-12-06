const pool = require('../config/db');

// Buat task baru - DIPERBAIKI: Simpan tanggal sebagai DATE bukan TIMESTAMP
async function createTask(userId, title, description, dueDate, priority, category, status = 'todo') {
    console.log('📝 [SERVICE] Creating task...');
    console.log('   User ID:', userId);
    console.log('   Title:', title);
    console.log('   Due Date Received:', dueDate, 'Type:', typeof dueDate);
    
    // Validasi dan normalisasi tanggal ke format YYYY-MM-DD
    let dateString;
    
    try {
        if (typeof dueDate === 'string') {
            // Format YYYY-MM-DD
            if (dueDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
                dateString = dueDate;
            }
            // Format ISO String (YYYY-MM-DDTHH:mm:ss.sssZ)
            else if (dueDate.includes('T')) {
                dateString = dueDate.split('T')[0];
            }
            else {
                // Coba parse sebagai Date
                const dateObj = new Date(dueDate);
                if (isNaN(dateObj.getTime())) {
                    throw new Error('Invalid date format');
                }
                const year = dateObj.getFullYear();
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const day = String(dateObj.getDate()).padStart(2, '0');
                dateString = `${year}-${month}-${day}`;
            }
        } else if (dueDate instanceof Date) {
            const year = dueDate.getFullYear();
            const month = String(dueDate.getMonth() + 1).padStart(2, '0');
            const day = String(dueDate.getDate()).padStart(2, '0');
            dateString = `${year}-${month}-${day}`;
        } else {
            throw new Error('Invalid dueDate format');
        }
        
        console.log('   Normalized Due Date String:', dateString);
        
        const query = `
            INSERT INTO tasks(user_id, title, description, due_date, priority, category, status)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            RETURNING *;
        `;
        
        const values = [userId, title, description || '', dateString, priority || 'normal', category || 'kuliah', status];
        
        console.log('   Executing query...');
        const { rows } = await pool.query(query, values);
        console.log('   ✅ Task created successfully');
        console.log('   Stored due_date:', rows[0].due_date);
        
        return {
            ...rows[0],
            due_date_formatted: dateString
        };
    } catch (error) {
        console.error('❌ [SERVICE] Error in createTask:', error);
        throw error;
    }
}

// Ambil tasks berdasarkan tanggal - DIPERBAIKI: Query DATE langsung
async function findTasksByDate(userId, date) {
    console.log('📅 [SERVICE] Finding tasks by date...');
    console.log('   User ID:', userId);
    console.log('   Request Date:', date);
    
    try {
        // Validasi format tanggal
        if (!date.match(/^\d{4}-\d{2}-\d{2}$/)) {
            throw new Error('Invalid date format. Expected YYYY-MM-DD');
        }
        
        // Query langsung dengan DATE comparison
        const query = `
            SELECT * FROM tasks
            WHERE user_id = $1 
            AND due_date = $2
            ORDER BY
                CASE priority
                    WHEN 'high' THEN 1
                    WHEN 'normal' THEN 2
                    ELSE 3
                END,
                created_at ASC;
        `;
        
        const values = [userId, date];
        
        console.log('   Executing query...');
        const { rows } = await pool.query(query, values);
        console.log(`   📊 Found ${rows.length} tasks for date ${date}`);
        
        // Format response
        const formattedRows = rows.map(task => ({
            ...task,
            due_date_formatted: task.due_date instanceof Date 
                ? task.due_date.toISOString().split('T')[0]
                : task.due_date
        }));
        
        return formattedRows;
    } catch (error) {
        console.error('❌ [SERVICE] Error in findTasksByDate:', error);
        throw error;
    }
}

// Ambil semua tasks berdasarkan user_id
async function findTasksByUserId(userId) {
    console.log('📋 [SERVICE] Finding all tasks for user:', userId);
    
    const query = `
        SELECT * FROM tasks
        WHERE user_id = $1
        ORDER BY
            due_date ASC,
            CASE priority
                WHEN 'high' THEN 1
                WHEN 'normal' THEN 2
                ELSE 3
            END,
            created_at DESC;
    `;
    
    try {
        const { rows } = await pool.query(query, [userId]);
        console.log(`   📊 Found ${rows.length} total tasks`);
        
        // Format tanggal untuk response
        const formattedRows = rows.map(task => {
            const taskDate = new Date(task.due_date);
            return {
                ...task,
                due_date_formatted: taskDate.toISOString().split('T')[0]
            };
        });
        
        return formattedRows;
    } catch (error) {
        console.error('❌ [SERVICE] Error in findTasksByUserId:', error);
        throw error;
    }
}

// Ambil task berdasarkan ID
async function findTaskById(taskId) {
    const query = 'SELECT * FROM tasks WHERE id = $1';
    const { rows } = await pool.query(query, [taskId]);
    
    if (rows[0]) {
        const taskDate = new Date(rows[0].due_date);
        return {
            ...rows[0],
            due_date_formatted: taskDate.toISOString().split('T')[0]
        };
    }
    return rows[0];
}

// Update task - DIPERBAIKI: Gunakan DATE string
async function updateTask(taskId, title, description, dueDate, priority, category, status) {
    console.log('✏️ [SERVICE] Updating task:', taskId);
    console.log('   New Due Date:', dueDate);
    
    // Normalisasi tanggal ke format YYYY-MM-DD
    let dateString;
    
    if (typeof dueDate === 'string' && dueDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        dateString = dueDate;
    } else if (typeof dueDate === 'string' && dueDate.includes('T')) {
        dateString = dueDate.split('T')[0];
    } else {
        const dateObj = new Date(dueDate);
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        dateString = `${year}-${month}-${day}`;
    }
    
    console.log('   Normalized Due Date String:', dateString);
    
    const query = `
        UPDATE tasks
        SET title = $1,
            description = $2,
            due_date = $3,
            priority = $4,
            category = $5,
            status = $6,
            updated_at = NOW()
        WHERE id = $7
        RETURNING *;
    `;
    
    const values = [title, description || '', dateString, priority || 'normal', category || 'kuliah', status || 'todo', taskId];
    
    const { rows } = await pool.query(query, values);
    
    if (rows[0]) {
        return {
            ...rows[0],
            due_date_formatted: dateString
        };
    }
    return rows[0];
}

// Update status task saja
async function updateTaskStatus(taskId, status) {
    console.log('🔄 [SERVICE] Updating task status:', taskId, '->', status);
    
    const query = `
        UPDATE tasks
        SET status = $1,
            updated_at = NOW()
        WHERE id = $2
        RETURNING *;
    `;
    
    const { rows } = await pool.query(query, [status, taskId]);
    
    if (rows[0]) {
        const taskDate = new Date(rows[0].due_date);
        return {
            ...rows[0],
            due_date_formatted: taskDate.toISOString().split('T')[0]
        };
    }
    return rows[0];
}

// Hapus task
async function deleteTask(taskId) {
    console.log('🗑️ [SERVICE] Deleting task:', taskId);
    
    const query = `
        DELETE FROM tasks
        WHERE id = $1
        RETURNING *;
    `;
    
    const { rows } = await pool.query(query, [taskId]);
    return rows[0];
}

// Ambil statistik tasks
async function getTaskStats(userId) {
    console.log('📊 [SERVICE] Getting task stats for user:', userId);
    
    const query = `
        SELECT
            COUNT(*) as total,
            COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
            COUNT(CASE WHEN status IN ('todo', 'in_progress') THEN 1 END) as pending,
            COUNT(CASE WHEN status IN ('todo', 'in_progress') AND due_date < CURRENT_DATE THEN 1 END) as overdue
        FROM tasks
        WHERE user_id = $1;
    `;
    
    const { rows } = await pool.query(query, [userId]);
    
    if (rows[0]) {
        console.log('   Stats:', rows[0]);
    }
    
    return rows[0];
}

// Cari tasks berdasarkan kata kunci
async function searchTasks(userId, searchTerm) {
    console.log('🔍 [SERVICE] Searching tasks:', searchTerm);
    
    const query = `
        SELECT * FROM tasks
        WHERE user_id = $1 AND (
            title ILIKE $2 OR
            description ILIKE $2
        )
        ORDER BY 
            CASE 
                WHEN due_date < CURRENT_DATE AND status != 'completed' THEN 0
                ELSE 1
            END,
            due_date ASC,
            CASE priority
                WHEN 'high' THEN 1
                WHEN 'normal' THEN 2
                ELSE 3
            END;
    `;
    
    const { rows } = await pool.query(query, [userId, `%${searchTerm}%`]);
    
    // Format tanggal untuk response
    const formattedRows = rows.map(task => {
        const taskDate = new Date(task.due_date);
        return {
            ...task,
            due_date_formatted: taskDate.toISOString().split('T')[0]
        };
    });
    
    return formattedRows;
}

// Filter tasks - DIPERBAIKI
async function filterTasks(userId, filters) {
    console.log('🎛️ [SERVICE] Filtering tasks:', filters);
    
    let query = 'SELECT * FROM tasks WHERE user_id = $1';
    const values = [userId];
    let paramCount = 1;

    if (filters.status && filters.status !== '') {
        paramCount++;
        query += ` AND status = $${paramCount}`;
        values.push(filters.status);
    }

    if (filters.priority && filters.priority !== '') {
        paramCount++;
        query += ` AND priority = $${paramCount}`;
        values.push(filters.priority);
    }

    if (filters.category && filters.category !== '') {
        paramCount++;
        query += ` AND category = $${paramCount}`;
        values.push(filters.category);
    }

    if (filters.dueDate && filters.dueDate !== '') {
        paramCount++;
        const [year, month, day] = filters.dueDate.split('-').map(Number);
        const startDate = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0));
        const endDate = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));
        
        paramCount += 2;
        query += ` AND due_date >= $${paramCount - 1} AND due_date <= $${paramCount}`;
        values.push(startDate, endDate);
    }

    query += ` ORDER BY 
        CASE 
            WHEN due_date < CURRENT_DATE AND status != 'completed' THEN 0
            ELSE 1
        END,
        due_date ASC,
        CASE priority
            WHEN 'high' THEN 1
            WHEN 'normal' THEN 2
            ELSE 3
        END;`;

    console.log('   Final query:', query);
    console.log('   Values:', values);
    
    const { rows } = await pool.query(query, values);
    
    // Format tanggal untuk response
    const formattedRows = rows.map(task => {
        const taskDate = new Date(task.due_date);
        return {
            ...task,
            due_date_formatted: taskDate.toISOString().split('T')[0]
        };
    });
    
    console.log(`   📊 Found ${formattedRows.length} filtered tasks`);
    return formattedRows;
}

module.exports = {
    createTask,
    findTasksByUserId,
    findTasksByDate,
    findTaskById,
    updateTask,
    updateTaskStatus,
    deleteTask,
    getTaskStats,
    searchTasks,
    filterTasks
};
