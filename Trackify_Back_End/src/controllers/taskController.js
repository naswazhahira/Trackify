const taskService = require('../services/taskService');

// Buat task baru - DIPERBAIKI
async function createTask(req, res) {
    try {
        console.log('🎯 [CONTROLLER] createTask called');
        console.log('   Headers:', req.headers);
        console.log('   Body:', req.body);
        
        const userId = req.user.id;
        const { title, description, dueDate, priority, category } = req.body;

        if (!title || !dueDate) {
            console.log('   ❌ Missing title or dueDate');
            return res.status(400).json({ error: 'Judul dan tanggal jatuh tempo wajib diisi.' });
        }

        // Validasi format tanggal
        console.log('   Validating date:', dueDate);
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dueDate)) {
            console.log('   ❌ Invalid date format');
            return res.status(400).json({ error: 'Format tanggal harus YYYY-MM-DD.' });
        }

        // Validasi tanggal tidak boleh masa lalu
        const selectedDate = new Date(dueDate + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        console.log('   Selected Date:', selectedDate);
        console.log('   Today:', today);
       
        if (selectedDate < today) {
            console.log('   ❌ Date is in the past');
            return res.status(400).json({ error: 'Tidak bisa memilih tanggal masa lalu.' });
        }

        console.log('   📞 Calling service...');
        const newTask = await taskService.createTask(
            userId,
            title,
            description || '',
            dueDate, // Kirim string YYYY-MM-DD
            priority || 'normal',
            category || 'kuliah'
        );

        console.log('   ✅ Task created successfully');
        return res.status(201).json({
            message: 'Tugas berhasil ditambahkan.',
            task: newTask
        });
    } catch (err) {
        console.error('❌ [CONTROLLER] Error in createTask:', err);
        return res.status(500).json({ error: err.message });
    }
}

// Ambil semua tasks user
async function getUserTasks(req, res) {
    try {
        console.log('🎯 [CONTROLLER] getUserTasks called');
        const userId = req.user.id;
        
        console.log('   📞 Calling service...');
        const tasks = await taskService.findTasksByUserId(userId);

        console.log(`   ✅ Returning ${tasks.length} tasks`);
        return res.status(200).json({
            message: 'Tasks berhasil diambil.',
            tasks: tasks
        });
    } catch (err) {
        console.error('❌ [CONTROLLER] Error in getUserTasks:', err);
        return res.status(500).json({ error: err.message });
    }
}

// Ambil tasks berdasarkan tanggal - DIPERBAIKI
async function getTasksByDate(req, res) {
    try {
        console.log('🎯 [CONTROLLER] getTasksByDate called');
        const userId = req.user.id;
        const { date } = req.params;

        if (!date) {
            console.log('   ❌ No date provided');
            return res.status(400).json({ error: 'Tanggal wajib diisi.' });
        }

        // Validasi format tanggal
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            console.log('   ❌ Invalid date format:', date);
            return res.status(400).json({ error: 'Format tanggal harus YYYY-MM-DD.' });
        }

        console.log('   User ID:', userId);
        console.log('   Request Date:', date);
        console.log('   Date as Date object:', new Date(date));
        console.log('   Date as ISO:', new Date(date).toISOString());
        console.log('   Date Local (WIB):', new Date(date + 'T00:00:00+07:00').toISOString());

        console.log('   📞 Calling service...');
        const tasks = await taskService.findTasksByDate(userId, date);

        console.log(`   ✅ Found ${tasks.length} tasks for date ${date}`);
        return res.status(200).json({
            message: 'Tasks berhasil diambil.',
            tasks: tasks
        });
    } catch (err) {
        console.error('❌ [CONTROLLER] Error in getTasksByDate:', err);
        return res.status(500).json({ error: err.message });
    }
}

// Update task - DIPERBAIKI
async function updateTask(req, res) {
    try {
        console.log('🎯 [CONTROLLER] updateTask called');
        const { id } = req.params;
        const { title, description, dueDate, priority, category, status } = req.body;

        console.log('   Task ID:', id);
        console.log('   Update Data:', { title, dueDate, priority, category, status });

        if (!title || !dueDate) {
            console.log('   ❌ Missing title or dueDate');
            return res.status(400).json({ error: 'Judul dan tanggal jatuh tempo wajib diisi.' });
        }

        // Validasi format tanggal
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(dueDate)) {
            console.log('   ❌ Invalid date format');
            return res.status(400).json({ error: 'Format tanggal harus YYYY-MM-DD.' });
        }

        // Validasi tanggal tidak boleh masa lalu
        const selectedDate = new Date(dueDate + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            console.log('   ❌ Date is in the past');
            return res.status(400).json({ error: 'Tidak bisa memilih tanggal masa lalu.' });
        }

        // Validasi task exists dan milik user
        console.log('   📞 Validating task...');
        const existingTask = await taskService.findTaskById(id);
        if (!existingTask) {
            console.log('   ❌ Task not found');
            return res.status(404).json({ error: 'Task tidak ditemukan.' });
        }

        if (existingTask.user_id !== req.user.id) {
            console.log('   ❌ Unauthorized access');
            return res.status(403).json({ error: 'Anda tidak memiliki akses ke task ini.' });
        }

        console.log('   📞 Calling service update...');
        const updatedTask = await taskService.updateTask(
            id, title, description || '', dueDate, priority, category, status
        );

        console.log('   ✅ Task updated successfully');
        return res.status(200).json({
            message: 'Task berhasil diperbarui.',
            task: updatedTask
        });
    } catch (err) {
        console.error('❌ [CONTROLLER] Error in updateTask:', err);
        return res.status(500).json({ error: err.message });
    }
}

// Update status task
async function updateTaskStatus(req, res) {
    try {
        console.log('🎯 [CONTROLLER] updateTaskStatus called');
        const { id } = req.params;
        const { status } = req.body;

        console.log('   Task ID:', id);
        console.log('   New Status:', status);

        if (!status) {
            console.log('   ❌ No status provided');
            return res.status(400).json({ error: 'Status wajib diisi.' });
        }

        // Validasi status
        const validStatuses = ['todo', 'in_progress', 'completed'];
        if (!validStatuses.includes(status)) {
            console.log('   ❌ Invalid status');
            return res.status(400).json({ error: 'Status tidak valid.' });
        }

        // Validasi task exists dan milik user
        console.log('   📞 Validating task...');
        const existingTask = await taskService.findTaskById(id);
        if (!existingTask) {
            console.log('   ❌ Task not found');
            return res.status(404).json({ error: 'Task tidak ditemukan.' });
        }

        if (existingTask.user_id !== req.user.id) {
            console.log('   ❌ Unauthorized access');
            return res.status(403).json({ error: 'Anda tidak memiliki akses ke task ini.' });
        }

        console.log('   📞 Calling service...');
        const updatedTask = await taskService.updateTaskStatus(id, status);

        console.log('   ✅ Status updated successfully');
        return res.status(200).json({
            message: 'Status task berhasil diperbarui.',
            task: updatedTask
        });
    } catch (err) {
        console.error('❌ [CONTROLLER] Error in updateTaskStatus:', err);
        return res.status(500).json({ error: err.message });
    }
}

// Hapus task
async function deleteTask(req, res) {
    try {
        console.log('🎯 [CONTROLLER] deleteTask called');
        const { id } = req.params;

        console.log('   Task ID:', id);

        // Validasi task exists dan milik user
        console.log('   📞 Validating task...');
        const existingTask = await taskService.findTaskById(id);
        if (!existingTask) {
            console.log('   ❌ Task not found');
            return res.status(404).json({ error: 'Task tidak ditemukan.' });
        }

        if (existingTask.user_id !== req.user.id) {
            console.log('   ❌ Unauthorized access');
            return res.status(403).json({ error: 'Anda tidak memiliki akses ke task ini.' });
        }

        console.log('   📞 Calling service...');
        await taskService.deleteTask(id);

        console.log('   ✅ Task deleted successfully');
        return res.status(200).json({
            message: 'Task berhasil dihapus.'
        });
    } catch (err) {
        console.error('❌ [CONTROLLER] Error in deleteTask:', err);
        return res.status(500).json({ error: err.message });
    }
}

// Ambil statistik tasks
async function getTaskStats(req, res) {
    try {
        console.log('🎯 [CONTROLLER] getTaskStats called');
        const userId = req.user.id;
        
        console.log('   📞 Calling service...');
        const stats = await taskService.getTaskStats(userId);

        console.log('   ✅ Stats retrieved');
        return res.status(200).json({
            message: 'Statistik tasks berhasil diambil.',
            stats: stats
        });
    } catch (err) {
        console.error('❌ [CONTROLLER] Error in getTaskStats:', err);
        return res.status(500).json({ error: err.message });
    }
}

// Cari tasks
async function searchTasks(req, res) {
    try {
        console.log('🎯 [CONTROLLER] searchTasks called');
        const userId = req.user.id;
        const { q } = req.query;

        console.log('   Search Query:', q);

        if (!q) {
            console.log('   ❌ No search query');
            return res.status(400).json({ error: 'Kata kunci pencarian wajib diisi.' });
        }

        console.log('   📞 Calling service...');
        const tasks = await taskService.searchTasks(userId, q);

        console.log(`   ✅ Found ${tasks.length} search results`);
        return res.status(200).json({
            message: 'Pencarian tasks berhasil.',
            tasks: tasks
        });
    } catch (err) {
        console.error('❌ [CONTROLLER] Error in searchTasks:', err);
        return res.status(500).json({ error: err.message });
    }
}

// Filter tasks
async function filterTasks(req, res) {
    try {
        console.log('🎯 [CONTROLLER] filterTasks called');
        const userId = req.user.id;
        const { status, priority, category, dueDate } = req.query;

        console.log('   Filters:', { status, priority, category, dueDate });

        const filters = {
            status: status || '',
            priority: priority || '',
            category: category || '',
            dueDate: dueDate || ''
        };

        console.log('   📞 Calling service...');
        const tasks = await taskService.filterTasks(userId, filters);

        console.log(`   ✅ Found ${tasks.length} filtered tasks`);
        return res.status(200).json({
            message: 'Filter tasks berhasil.',
            tasks: tasks
        });
    } catch (err) {
        console.error('❌ [CONTROLLER] Error in filterTasks:', err);
        return res.status(500).json({ error: err.message });
    }
}

// Get today's tasks
async function getTodayTasks(req, res) {
    try {
        console.log('📅 [CONTROLLER] getTodayTasks called');
        const userId = req.user.id;
        
        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayStr = `${year}-${month}-${day}`;
        
        console.log('   Today:', todayStr);
        console.log('   📞 Calling service...');
        
        const tasks = await taskService.findTasksByDate(userId, todayStr);
        
        console.log(`   ✅ Found ${tasks.length} tasks for today`);
        return res.status(200).json({
            message: 'Tasks hari ini berhasil diambil.',
            tasks: tasks
        });
    } catch (err) {
        console.error('❌ [CONTROLLER] Error in getTodayTasks:', err);
        return res.status(500).json({ error: err.message });
    }
}

module.exports = {
    createTask,
    getUserTasks,
    getTasksByDate,
    updateTask,
    updateTaskStatus,
    deleteTask,
    getTaskStats,
    searchTasks,
    filterTasks,
    getTodayTasks
};
