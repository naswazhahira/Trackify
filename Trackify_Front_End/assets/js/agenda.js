// sidebar functionality
const hamburgerBtn = document.getElementById('hamburgerBtn');
const closeSidebar = document.getElementById('closeSidebar');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');

// Buka sidebar
if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// Tutup sidebar
if (closeSidebar) {
    closeSidebar.addEventListener('click', function(e) {
        e.preventDefault();
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Tutup sidebar ketika overlay diklik
if (overlay) {
    overlay.addEventListener('click', function() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });
}

// Tutup sidebar ketika ESC ditekan
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    // Konfigurasi API
    const API_BASE_URL = 'http://localhost:5000/api'; // Port 5000
    let todos = [];
    let selectedDate = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
    
    // DOM Elements
    const monthYear = document.getElementById('monthYear');
    const calendarGrid = document.getElementById('calendarGrid');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const eventName = document.getElementById('eventName');
    const eventDate = document.getElementById('eventDate');
    const addEventBtn = document.getElementById('addEventBtn');
    const dateLabel = document.getElementById('dateLabel');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    const percentText = document.getElementById('percentText');
    const todoListEl = document.getElementById('todoList');
    const addForm = document.getElementById('addForm');
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDate');
    const priorityInput = document.getElementById('priority');
    const categoryInput = document.getElementById('category');
    const filterDate = document.getElementById('filterDate');
    const filterPriority = document.getElementById('filterPriority');
    const clearFilters = document.getElementById('clearFilters');
    const rewardPopup = document.getElementById('rewardPopup');
    const closeReward = document.getElementById('closeReward');
    const viewAllTasksBtn = document.getElementById('viewAllTasksBtn');
    const tasksPopup = document.getElementById('tasksPopup');
    const tasksPopupClose = document.getElementById('tasksPopupClose');
    const tasksPopupList = document.getElementById('tasksPopupList');
    const tasksFilterMonth = document.getElementById('tasksFilterMonth');
    const tasksFilterStatus = document.getElementById('tasksFilterStatus');
    const tasksFilterPriority = document.getElementById('tasksFilterPriority');
    const tasksFilterCategory = document.getElementById('tasksFilterCategory');
    const totalTasks = document.getElementById('totalTasks');
    const completedTasks = document.getElementById('completedTasks');
    const pendingTasks = document.getElementById('pendingTasks');
    const overdueTasks = document.getElementById('overdueTasks');
    const tasksPopupOverlay = document.getElementById('tasksPopupOverlay');
    const loadingElement = document.getElementById('loading');
    const taskSearch = document.getElementById('taskSearch');
    
    // Edit Modal Elements
    const editModal = document.getElementById('editModal');
    const editModalOverlay = document.getElementById('editModalOverlay');
    const editModalClose = document.getElementById('editModalClose');
    const editForm = document.getElementById('editForm');
    const editTaskId = document.getElementById('editTaskId');
    const editTaskText = document.getElementById('editTaskText');
    const editDueDate = document.getElementById('editDueDate');
    const editPriority = document.getElementById('editPriority');
    const editCategory = document.getElementById('editCategory');
    const editCancel = document.getElementById('editCancel');
    const editDescription = document.getElementById('editDescription');
    const editStatus = document.getElementById('editStatus');
    
    // Reminder Elements
    const reminderNotification = document.getElementById('reminderNotification');
    const reminderTitle = document.getElementById('reminderTitle');
    const reminderMessage = document.getElementById('reminderMessage');
    const reminderClose = document.getElementById('reminderClose');
    const reminderBadge = document.getElementById('reminderBadge');

    // Helper functions
    const pad = n => String(n).padStart(2, '0');
    const today = new Date();
    const toISO = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    
    // URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('date')) {
        selectedDate = urlParams.get('date');
    }
    let currentDate = new Date();

    // Priority mapping
    const priorityLabels = {
        'low': 'Rendah',
        'normal': 'Normal',
        'high': 'Tinggi'
    };

    // Category mapping
    const categoryLabels = {
        'kuliah': 'Kuliah',
        'praktikum': 'Praktikum',
        'uts': 'UTS',
        'uas': 'UAS',
        'organisasi': 'Organisasi',
        'lainnya': 'Lainnya'
    };

    // Status mapping
    const statusLabels = {
        'todo': 'Belum Mulai',
        'in_progress': 'Sedang Dikerjakan',
        'completed': 'Selesai'
    };

    // API Service - DIPERBAIKI
    class ApiService {
        constructor() {
            this.baseUrl = API_BASE_URL;
            this.token = localStorage.getItem('token');
            console.log('🔧 API Service initialized with token:', this.token ? 'Yes' : 'No');
        }

        setToken(token) {
            this.token = token;
            localStorage.setItem('token', token);
            console.log('🔑 Token set:', this.token ? 'Yes' : 'No');
        }

        async request(endpoint, options = {}) {
            const url = `${this.baseUrl}${endpoint}`;
            
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };

            if (this.token) {
                headers['Authorization'] = `Bearer ${this.token}`;
            }

            const config = {
                ...options,
                headers
            };

            console.log(`📤 API Request: ${url}`, config);

            try {
                const response = await fetch(url, config);
                
                console.log(`📥 API Response: ${response.status} ${response.statusText}`);
                
                if (response.status === 401) {
                    localStorage.removeItem('token');
                    window.location.href = '/login.html';
                    return null;
                }

                if (!response.ok) {
                    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.error || errorMessage;
                    } catch (e) {
                        // Tidak bisa parse JSON
                    }
                    throw new Error(errorMessage);
                }

                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    console.log('📦 API Response data:', data);
                    return data;
                } else {
                    console.log('📦 API Response: Non-JSON response');
                    return null;
                }
            } catch (error) {
                console.error('❌ API Request Error:', error);
                throw error;
            }
        }

        // Task endpoints - DIPERBAIKI
        async getTasks() {
            console.log('📋 Getting all tasks...');
            return this.request('/tasks');
        }

        async getTasksByDate(date) {
            console.log('📅 Getting tasks for date:', date);
            // Validasi format tanggal
            if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                console.error('❌ Invalid date format in getTasksByDate:', date);
                throw new Error('Format tanggal harus YYYY-MM-DD');
            }
            return this.request(`/tasks/date/${date}`);
        }

        async getTaskStats() {
            console.log('📊 Getting task stats...');
            return this.request('/tasks/stats');
        }

        async createTask(taskData) {
            console.log('➕ Creating task with data:', taskData);
            
            // PASTIKAN dueDate dalam format YYYY-MM-DD
            const formattedTaskData = {
                ...taskData,
                dueDate: taskData.dueDate // Jangan diubah formatnya!
            };
            
            console.log('📤 Sending to backend:', formattedTaskData);
            
            return this.request('/tasks', {
                method: 'POST',
                body: JSON.stringify(formattedTaskData)
            });
        }

        async updateTask(id, taskData) {
            console.log('✏️ Updating task', id, 'with data:', taskData);
            return this.request(`/tasks/${id}`, {
                method: 'PUT',
                body: JSON.stringify(taskData)
            });
        }

        async updateTaskStatus(id, status) {
            console.log('🔄 Updating task status', id, 'to:', status);
            return this.request(`/tasks/${id}/status`, {
                method: 'PUT',
                body: JSON.stringify({ status })
            });
        }

        async deleteTask(id) {
            console.log('🗑️ Deleting task:', id);
            return this.request(`/tasks/${id}`, {
                method: 'DELETE'
            });
        }

        async searchTasks(query) {
            console.log('🔍 Searching tasks:', query);
            return this.request(`/tasks/search?q=${encodeURIComponent(query)}`);
        }

        async filterTasks(filters) {
            console.log('🎛️ Filtering tasks:', filters);
            const cleanFilters = {};
            Object.keys(filters).forEach(key => {
                if (filters[key] !== undefined && filters[key] !== '' && filters[key] !== null) {
                    cleanFilters[key] = filters[key];
                }
            });
            
            const queryParams = new URLSearchParams(cleanFilters).toString();
            return this.request(`/tasks/filter?${queryParams}`);
        }
    }

    const apiService = new ApiService();

    // Notification Manager
    class NotificationManager {
        constructor() {
            this.setupStyles();
        }

        setupStyles() {
            if (!document.getElementById('notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    .notification {
                        position: fixed;
                        top: 120px;
                        right: 20px;
                        background: #4CAF50;
                        color: white;
                        padding: 15px 20px;
                        border-radius: 12px;
                        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                        z-index: 10001;
                        animation: slideInRight 0.3s ease;
                        max-width: 300px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    
                    .notification.success { background: #4CAF50; }
                    .notification.error { background: #ff6b6b; }
                    .notification.info { background: #2196F3; }
                    .notification.warning { background: #ffa726; }
                    
                    .notification-content {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                    }
                    
                    @keyframes slideOutRight {
                        from { transform: translateX(0); opacity: 1; }
                        to { transform: translateX(100%); opacity: 0; }
                    }
                `;
                document.head.appendChild(style);
            }
        }

        showMessage(message, type = 'info', duration = 3000) {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class='bx ${this.getIcon(type)}'></i>
                    <span>${message}</span>
                </div>
            `;

            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }, duration);
        }

        getIcon(type) {
            const icons = {
                'success': 'bx-check-circle',
                'error': 'bx-error-circle',
                'info': 'bx-info-circle',
                'warning': 'bx-error'
            };
            return icons[type] || 'bx-info-circle';
        }

        showReminder(urgentTasks) {
            const totalReminders = urgentTasks.length;
            
            if (totalReminders === 0) {
                this.hideReminder();
                return;
            }

            if (reminderBadge) {
                reminderBadge.textContent = totalReminders;
            }

            if (urgentTasks.length > 0 && reminderTitle && reminderMessage) {
                const urgentTask = urgentTasks[0];
                reminderTitle.textContent = '⏰ Pengingat Deadline!';
                reminderMessage.textContent = `"${urgentTask.title}" deadline besok!`;
            }

            if (reminderNotification) {
                reminderNotification.classList.add('show');
            }

            setTimeout(() => {
                this.hideReminder();
            }, 10000);
        }

        hideReminder() {
            if (reminderNotification) {
                reminderNotification.classList.remove('show');
            }
        }
    }

    const notificationManager = new NotificationManager();

    // Initialize App - DIPERBAIKI
    async function initializeApp() {
        console.log('🚀 Initializing app...');
        
        if (loadingElement) {
            loadingElement.style.display = 'flex';
        }

        setupEventListeners();
        
        const token = localStorage.getItem('token');
        console.log('🔑 Token from localStorage:', token ? 'Found' : 'Not found');
        
        if (!token) {
            console.warn('❌ No token found, redirecting to login');
            window.location.href = '/login.html';
            return;
        }
        
        apiService.setToken(token);
        
        // Set nilai default tanggal
        dueDateInput.value = selectedDate;
        eventDate.value = toISO(today);
        
        // Set min date untuk input
        const todayStr = new Date().toISOString().split('T')[0];
        dueDateInput.min = todayStr;
        eventDate.min = todayStr;
        if (editDueDate) editDueDate.min = todayStr;

        try {
            console.log('📥 Loading tasks...');
            await loadTasks();
            console.log(`✅ Tasks loaded: ${todos.length} tasks`);
            
            await loadTaskStats();
            
            renderCalendar();
            renderTodos();
            
            updateReminders();

            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            
            console.log('🎉 App initialized successfully');
        } catch (error) {
            console.error('❌ Initialization error:', error);
            notificationManager.showMessage('Gagal memuat data: ' + error.message, 'error');
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        }
    }

    // Data Loading Functions - DIPERBAIKI
    async function loadTasks() {
        try {
            console.log('📥 Loading tasks from API...');
            const response = await apiService.getTasks();
            
            if (response && response.tasks) {
                console.log('📦 API response tasks:', response.tasks);
                
                todos = response.tasks.map(task => {
                    console.log(`   Task: ${task.title}`);
                    console.log(`     ID: ${task.id}`);
                    console.log(`     Status: ${task.status}`);
                    console.log(`     Due Date: ${task.due_date}`);
                    console.log(`     Due Date Formatted: ${task.due_date_formatted}`);
                    
                    // Gunakan due_date_formatted jika ada, jika tidak parse dari due_date
                    let dueDate = task.due_date_formatted;
                    if (!dueDate && task.due_date) {
                        if (typeof task.due_date === 'string' && task.due_date.includes('T')) {
                            dueDate = task.due_date.split('T')[0];
                        } else {
                            // Jika bukan string ISO, coba format langsung
                            const dateObj = new Date(task.due_date);
                            dueDate = dateObj.toISOString().split('T')[0];
                        }
                    }
                    
                    return {
                        ...task,
                        due_date: dueDate || task.due_date
                    };
                });
                console.log(`✅ Loaded ${todos.length} tasks`);
            } else if (Array.isArray(response)) {
                todos = response.map(task => {
                    let dueDate = task.due_date || task.dueDate;
                    if (dueDate && typeof dueDate === 'string' && dueDate.includes('T')) {
                        dueDate = dueDate.split('T')[0];
                    }
                    
                    return {
                        ...task,
                        due_date: dueDate
                    };
                });
                console.log(`✅ Loaded ${todos.length} tasks (array response)`);
            } else {
                console.warn('⚠️ No tasks in response:', response);
                todos = [];
            }
        } catch (error) {
            console.error('❌ Error loading tasks:', error);
            notificationManager.showMessage('Gagal memuat tugas: ' + error.message, 'error');
            throw error;
        }
    }

    async function loadTaskStats() {
        try {
            console.log('📊 Loading task stats...');
            const response = await apiService.getTaskStats();
            if (response && response.stats) {
                updateStatsDisplay(response.stats);
                console.log('✅ Stats loaded');
            }
        } catch (error) {
            console.error('❌ Error loading stats:', error);
        }
    }

    // Setup Event Listeners
    function setupEventListeners() {
        console.log('🔧 Setting up event listeners...');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                renderCalendar();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                renderCalendar();
            });
        }

        if (addForm) {
            addForm.addEventListener('submit', (e) => {
                console.log('➕ Add form submitted');
                addTodo(e);
            });
        }

        if (addEventBtn) {
            addEventBtn.addEventListener('click', (e) => {
                console.log('🎯 Add event button clicked');
                addQuickEvent(e);
            });
        }

        if (filterDate) {
            filterDate.addEventListener('change', applyFilters);
        }

        if (filterPriority) {
            filterPriority.addEventListener('change', applyFilters);
        }

        if (clearFilters) {
            clearFilters.addEventListener('click', resetFilters);
        }

        if (taskSearch) {
            taskSearch.addEventListener('input', debounce(() => {
                applyFilters();
            }, 300));
        }

        if (closeReward) {
            closeReward.addEventListener('click', hideReward);
        }

        if (viewAllTasksBtn) {
            viewAllTasksBtn.addEventListener('click', showTasksPopup);
        }

        if (tasksPopupClose) {
            tasksPopupClose.addEventListener('click', hideTasksPopup);
        }

        if (tasksPopupOverlay) {
            tasksPopupOverlay.addEventListener('click', hideTasksPopup);
        }

        if (tasksFilterMonth) {
            tasksFilterMonth.addEventListener('change', renderTasksPopup);
        }

        if (tasksFilterStatus) {
            tasksFilterStatus.addEventListener('change', renderTasksPopup);
        }

        if (tasksFilterPriority) {
            tasksFilterPriority.addEventListener('change', renderTasksPopup);
        }

        if (tasksFilterCategory) {
            tasksFilterCategory.addEventListener('change', renderTasksPopup);
        }

        if (editModalClose) {
            editModalClose.addEventListener('click', hideEditModal);
        }

        if (editCancel) {
            editCancel.addEventListener('click', hideEditModal);
        }

        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                console.log('✏️ Edit form submitted');
                saveEditedTodo(e);
            });
        }

        if (editModalOverlay) {
            editModalOverlay.addEventListener('click', hideEditModal);
        }

        if (reminderClose) {
            reminderClose.addEventListener('click', () => {
                notificationManager.hideReminder();
            });
        }

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (tasksPopup && tasksPopup.classList.contains('active')) {
                    hideTasksPopup();
                }
                if (editModal && editModal.classList.contains('active')) {
                    hideEditModal();
                }
                if (sidebar && sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
                if (rewardPopup && rewardPopup.classList.contains('show')) {
                    hideReward();
                }
                notificationManager.hideReminder();
            }
        });

        if (eventName) {
            eventName.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addQuickEvent();
                }
            });
        }

        if (taskInput) {
            taskInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    addTodo(e);
                }
            });
        }
        
        console.log('✅ Event listeners setup complete');
    }

    // Debounce helper
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Calendar Functions - DIPERBAIKI
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        if (monthYear) {
            monthYear.textContent = currentDate.toLocaleString('id-ID', { month: 'long' }) + ' ' + year;
        }

        const firstDay = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();

        if (calendarGrid) {
            calendarGrid.innerHTML = '';

            for (let i = 0; i < firstDay; i++) {
                const empty = document.createElement('div');
                empty.className = 'day';
                empty.style.visibility = 'hidden';
                calendarGrid.appendChild(empty);
            }

            for (let d = 1; d <= lastDay; d++) {
                const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
                const dayEl = document.createElement('div');
                dayEl.className = 'day';
                
                if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                    dayEl.classList.add('today');
                }
                
                // Filter tasks untuk tanggal ini - DIPERBAIKI
                const dayTodos = todos.filter(t => {
                    const taskDate = t.due_date;
                    return taskDate === dateStr;
                });
                
                if (dayTodos.length > 0) {
                    dayEl.classList.add('event');
                }

                dayEl.innerHTML = `<div class="date">${d}</div>`;
                
                if (dayTodos.length > 0) {
                    const badge = document.createElement('div');
                    badge.className = 'event-badge';
                    badge.title = `${dayTodos.length} tugas`;
                    badge.innerHTML = `<span>📚</span> <span>${dayTodos.length}</span>`;
                    dayEl.appendChild(badge);
                }
                
                const addIcon = document.createElement('div');
                addIcon.className = 'add-icon';
                addIcon.innerHTML = '+';
                addIcon.title = 'Tambah tugas untuk tanggal ini';
                addIcon.setAttribute('role', 'button');
                addIcon.setAttribute('tabindex', '0');
                addIcon.setAttribute('aria-label', `Tambah tugas untuk tanggal ${d}`);
                
                addIcon.addEventListener('click', function(ev) {
                    ev.preventDefault();
                    ev.stopPropagation();
                    selectDatePreserveFilters(dateStr);
                    
                    setTimeout(() => {
                        if (taskInput) {
                            taskInput.focus();
                        }
                    }, 150);
                });
                
                addIcon.addEventListener('keydown', function(ev) {
                    if (ev.key === 'Enter' || ev.key === ' ') {
                        ev.preventDefault();
                        ev.stopPropagation();
                        selectDatePreserveFilters(dateStr);
                        
                        setTimeout(() => {
                            if (taskInput) taskInput.focus();
                        }, 150);
                    }
                });
                
                dayEl.appendChild(addIcon);
                
                dayEl.addEventListener('click', () => {
                    selectDatePreserveFilters(dateStr);
                });

                calendarGrid.appendChild(dayEl);
            }
        }
    }

    function selectDatePreserveFilters(dateStr) {
        console.log('📅 Selecting date:', dateStr);
        
        const currentDateFilter = filterDate ? filterDate.value : '';
        const currentPriorityFilter = filterPriority ? filterPriority.value : '';
        const currentSearchTerm = taskSearch ? taskSearch.value : '';
        
        selectedDate = dateStr;
        if (dateLabel) {
            dateLabel.textContent = `Tugas untuk ${formatDateDisplay(dateStr)}`;
        }
        if (dueDateInput) {
            dueDateInput.value = dateStr;
        }
        
        setTimeout(() => {
            if (filterDate && currentDateFilter) filterDate.value = currentDateFilter;
            if (filterPriority && currentPriorityFilter) filterPriority.value = currentPriorityFilter;
            if (taskSearch && currentSearchTerm) taskSearch.value = currentSearchTerm;
            
            renderTodos();
        }, 10);
    }

    // Todo Functions - DIPERBAIKI
    function renderTodos() {
        console.log('🔄 Rendering todos for date:', selectedDate);
        
        let filtered = getFilteredTodos();
        console.log(`   Filtered ${filtered.length} tasks`);
        
        renderFilteredTodos(filtered);
    }

    function getFilteredTodos() {
        // Filter berdasarkan tanggal yang dipilih - DIPERBAIKI
        let filtered = todos.filter(t => {
            const taskDate = t.due_date;
            return taskDate === selectedDate;
        });
        
        console.log(`   Found ${filtered.length} tasks for date ${selectedDate}`);
        
        const dateFilter = filterDate ? filterDate.value : '';
        const priorityFilter = filterPriority ? filterPriority.value : '';
        const searchTerm = taskSearch ? taskSearch.value.toLowerCase().trim() : '';
        
        if (dateFilter) {
            filtered = filtered.filter(t => t.due_date === dateFilter);
        }
        
        if (priorityFilter) {
            filtered = filtered.filter(t => t.priority === priorityFilter);
        }
        
        if (searchTerm) {
            filtered = filtered.filter(t => 
                t.title.toLowerCase().includes(searchTerm) ||
                (t.description && t.description.toLowerCase().includes(searchTerm)) ||
                (categoryLabels[t.category] && categoryLabels[t.category].toLowerCase().includes(searchTerm)) ||
                (priorityLabels[t.priority] && priorityLabels[t.priority].toLowerCase().includes(searchTerm))
            );
        }
        
        return filtered;
    }

    function renderFilteredTodos(filtered) {
        if (!todoListEl) return;
        
        todoListEl.innerHTML = '';

        if (filtered.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'todo-item';
            empty.style.justifyContent = 'center';
            empty.style.background = 'transparent';
            empty.style.boxShadow = 'none';
            
            const searchTerm = taskSearch ? taskSearch.value : '';
            const dateFilter = filterDate ? filterDate.value : '';
            const priorityFilter = filterPriority ? filterPriority.value : '';
            
            if (searchTerm) {
                empty.innerHTML = `
                    <div style="text-align: center; color: #666; padding: 20px;">
                        <i class='bx bx-search' style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                        <div>Tidak ada tugas di tanggal ${formatDateDisplay(selectedDate)} yang sesuai dengan pencarian "${searchTerm}".</div>
                        <p class="helper-text">Coba kata kunci lain atau hapus pencarian</p>
                    </div>
                `;
            } else if (dateFilter || priorityFilter) {
                empty.innerHTML = `
                    <div style="text-align: center; color: #666; padding: 20px;">
                        <i class='bx bx-filter-alt' style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                        <div>Tidak ada tugas di tanggal ${formatDateDisplay(selectedDate)} yang sesuai dengan filter.</div>
                        <p class="helper-text">Coba ubah filter atau reset filter</p>
                    </div>
                `;
            } else {
                empty.innerHTML = `
                    <div style="text-align: center; color: #666; padding: 20px;">
                        <i class='bx bx-calendar-x' style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                        <div>Tidak ada tugas untuk tanggal ${formatDateDisplay(selectedDate)}.</div>
                        <p class="helper-text">Tambahkan tugas baru menggunakan form di atas</p>
                    </div>
                `;
            }
            todoListEl.appendChild(empty);
        } else {
            filtered.sort((a, b) => {
                const statusOrder = { 'todo': 1, 'in_progress': 2, 'completed': 3 };
                const statusA = statusOrder[a.status] || 4;
                const statusB = statusOrder[b.status] || 4;
                
                if (statusA !== statusB) {
                    return statusA - statusB;
                }
                
                // Urutkan berdasarkan due_date
                const dateA = new Date(a.due_date);
                const dateB = new Date(b.due_date);
                return dateA - dateB;
            });

            filtered.forEach(todo => {
                const todoEl = createTodoElement(todo);
                todoListEl.appendChild(todoEl);
            });
        }

        const allTasksForSelectedDate = todos.filter(t => t.due_date === selectedDate);
        updateProgress(allTasksForSelectedDate);
        attachTodoEvents();
    }

    // DIPERBAIKI: Fungsi createTodoElement dengan icon yang benar
    function createTodoElement(todo) {
        console.log('🎨 Creating todo element:', todo.id, todo.title);
        
        const el = document.createElement('div');
        el.className = 'todo-item';
        if (todo.status === 'completed') el.classList.add('completed');

        // Tentukan tanggal dengan benar untuk cek overdue - DIPERBAIKI
        const taskDate = new Date(todo.due_date + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const overdue = taskDate < today && todo.status !== 'completed';
        if (overdue) el.classList.add('overdue');

        // Tentukan icon berdasarkan status - DIPERBAIKI
        let statusIcon = '◯';
        let statusClass = '';
        let statusIconClass = '';
        
        switch(todo.status) {
            case 'completed':
                statusIcon = '✓';
                statusClass = 'checked';
                statusIconClass = 'bx bx-check';
                break;
            case 'in_progress':
                statusIcon = '▶';
                statusClass = 'in-progress';
                statusIconClass = 'bx bx-play';
                break;
            default:
                statusIcon = '◯';
                statusClass = 'todo';
                statusIconClass = 'bx bx-circle';
        }

        // Tentukan icon priority - DIPERBAIKI
        let priorityIcon = '';
        let priorityIconClass = '';
        switch(todo.priority) {
            case 'high':
                priorityIcon = '⬆';
                priorityIconClass = 'bx bx-up-arrow-alt';
                break;
            case 'low':
                priorityIcon = '⬇';
                priorityIconClass = 'bx bx-down-arrow-alt';
                break;
            default:
                priorityIcon = '●';
                priorityIconClass = 'bx bx-circle';
        }

        el.innerHTML = `
            <div class="todo-checkbox ${statusClass}" 
                 data-id="${todo.id}" 
                 data-status="${todo.status}"
                 title="${statusLabels[todo.status] || todo.status}">
                 <i class="${statusIconClass}"></i>
            </div>
            <div class="todo-content">
                <div class="todo-title">
                    ${escapeHtml(todo.title || 'No title')}
                    ${todo.priority === 'high' ? ' <span class="priority-badge">!</span>' : ''}
                </div>
                ${todo.description ? `<div class="todo-description">${escapeHtml(todo.description)}</div>` : ''}
                <div class="todo-meta">
                    <span class="todo-chip ${todo.status}">
                        <i class='${statusIconClass}'></i>
                        ${statusLabels[todo.status] || todo.status || 'todo'}
                    </span>
                    <span class="todo-chip">
                        <i class='bx bx-category'></i>
                        ${categoryLabels[todo.category] || todo.category || 'lainnya'}
                    </span>
                    <span class="todo-chip date-chip">
                        <i class='bx bx-calendar'></i>
                        ${formatDateDisplay(todo.due_date) || 'No date'}
                    </span>
                    ${todo.priority && todo.priority !== 'normal' ? `
                        <span class="todo-chip priority-${todo.priority}">
                            <i class='${priorityIconClass}'></i>
                            ${priorityLabels[todo.priority] || todo.priority}
                        </span>
                    ` : ''}
                    ${overdue ? `
                        <span class="todo-chip overdue-chip">
                            <i class='bx bx-time-five'></i>
                            Terlambat
                        </span>
                    ` : ''}
                </div>
            </div>
            <div class="todo-actions">
                ${todo.status !== 'completed' ? `
                    <button class="status-btn action-btn" data-id="${todo.id}" data-status="in_progress" title="Tandai sedang dikerjakan">
                        <i class='bx bx-play'></i>
                    </button>
                    <button class="status-btn complete-btn action-btn" data-id="${todo.id}" data-status="completed" title="Tandai selesai">
                        <i class='bx bx-check'></i>
                    </button>
                ` : `
                    <button class="status-btn action-btn" data-id="${todo.id}" data-status="todo" title="Tandai belum mulai">
                        <i class='bx bx-undo'></i>
                    </button>
                `}
                <button class="edit-btn action-btn" data-id="${todo.id}" title="Edit tugas">
                    <i class='bx bx-edit'></i>
                </button>
                <button class="delete-btn action-btn" data-id="${todo.id}" title="Hapus tugas">
                    <i class='bx bx-trash'></i>
                </button>
            </div>
        `;

        return el;
    }

    // FIXED: Event handling untuk checkbox dan tombol status
    function attachTodoEvents() {
        console.log('🔗 Attaching todo events...');
        
        // Event untuk checkbox
        document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', handleCheckboxClick);
        });

        // Event untuk tombol status (play, check, undo)
        document.querySelectorAll('.status-btn').forEach(btn => {
            btn.addEventListener('click', handleStatusButtonClick);
        });

        // Event untuk delete
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteClick);
        });
        
        // Event untuk edit
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEditClick);
        });
    }

    async function handleCheckboxClick(e) {
        e.stopPropagation();
        const id = this.dataset.id;
        const currentStatus = this.dataset.status;
        
        console.log('✓ Checkbox clicked, id:', id, 'current status:', currentStatus);
        
        const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
        
        await updateTaskStatus(id, newStatus);
    }

    async function handleStatusButtonClick(e) {
        e.stopPropagation();
        const id = this.dataset.id;
        const newStatus = this.dataset.status;
        
        console.log('🔄 Status button clicked, id:', id, 'new status:', newStatus);
        
        await updateTaskStatus(id, newStatus);
    }

    async function handleDeleteClick(e) {
        e.stopPropagation();
        const id = this.dataset.id;
        const todo = todos.find(t => t.id == id);
        
        if (id && todo && confirm(`Hapus tugas "${todo.title}"?`)) {
            try {
                const response = await apiService.deleteTask(id);
                if (response) {
                    notificationManager.showMessage('Tugas berhasil dihapus', 'success', 2000);
                    
                    todos = todos.filter(t => t.id != id);
                    
                    renderCalendar();
                    renderTodos();
                    await loadTaskStats();
                    updateReminders();
                }
            } catch (error) {
                notificationManager.showMessage('Gagal menghapus tugas: ' + error.message, 'error');
            }
        }
    }

    function handleEditClick(e) {
        e.stopPropagation();
        const id = this.dataset.id;
        showEditModal(id);
    }

    async function updateTaskStatus(id, status) {
        try {
            console.log(`🔄 Updating task ${id} to status ${status}`);
            const response = await apiService.updateTaskStatus(id, status);
            
            if (response && response.task) {
                console.log('✅ Status updated successfully:', response.task);
                notificationManager.showMessage('Status tugas berhasil diubah', 'success', 2000);
                
                const todoIndex = todos.findIndex(t => t.id == id);
                if (todoIndex !== -1) {
                    todos[todoIndex] = {
                        ...todos[todoIndex],
                        status: response.task.status,
                        updated_at: response.task.updated_at
                    };
                }
                
                renderCalendar();
                renderTodos();
                await loadTaskStats();
                updateReminders();
            } else {
                console.error('❌ No task in response:', response);
                notificationManager.showMessage('Gagal mengubah status: respons tidak valid', 'error');
            }
        } catch (error) {
            console.error('❌ Error updating task status:', error);
            notificationManager.showMessage('Gagal mengubah status: ' + error.message, 'error');
        }
    }

    // Edit Modal Functions
    function showEditModal(taskId) {
        const todo = todos.find(t => t.id == taskId);
        if (!todo) {
            notificationManager.showMessage('Tugas tidak ditemukan!', 'error');
            return;
        }
        
        editTaskId.value = todo.id;
        editTaskText.value = todo.title || '';
        editDescription.value = todo.description || '';
        editDueDate.value = todo.due_date || selectedDate;
        editPriority.value = todo.priority || 'normal';
        editCategory.value = todo.category || 'kuliah';
        editStatus.value = todo.status || 'todo';
        
        editDueDate.min = new Date().toISOString().split('T')[0];
        
        editModal.classList.add('active');
        editModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            editTaskText.focus();
            editTaskText.select();
        }, 100);
    }

    function hideEditModal() {
        editModal.classList.remove('active');
        editModalOverlay.classList.remove('active');
        document.body.style.overflow = '';
        editForm.reset();
    }

    async function saveEditedTodo(e) {
        e.preventDefault();
        
        const taskId = editTaskId.value;
        const todo = todos.find(t => t.id == taskId);
        
        if (!todo) {
            notificationManager.showMessage('Tugas tidak ditemukan!', 'error');
            return;
        }
        
        if (!editTaskText.value.trim()) {
            notificationManager.showMessage('Nama tugas tidak boleh kosong!', 'error');
            editTaskText.focus();
            return;
        }
        
        const selectedDateValue = new Date(editDueDate.value + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDateValue < today) {
            notificationManager.showMessage('Tidak bisa memilih tanggal masa lalu!', 'error');
            editDueDate.focus();
            return;
        }
        
        try {
            const taskData = {
                title: editTaskText.value.trim(),
                description: editDescription.value.trim(),
                dueDate: editDueDate.value,
                priority: editPriority.value,
                category: editCategory.value,
                status: editStatus.value
            };
            
            console.log('✏️ Updating task with data:', taskData);
            
            const response = await apiService.updateTask(taskId, taskData);
            if (response && response.task) {
                notificationManager.showMessage('Tugas berhasil diupdate! ✓', 'success', 2000);
                
                const todoIndex = todos.findIndex(t => t.id == taskId);
                if (todoIndex !== -1) {
                    todos[todoIndex] = {
                        ...response.task,
                        due_date: response.task.due_date_formatted || 
                                 (response.task.due_date ? 
                                  response.task.due_date.split('T')[0] : 
                                  editDueDate.value)
                    };
                }
                
                renderCalendar();
                renderTodos();
                hideEditModal();
            }
        } catch (error) {
            notificationManager.showMessage('Gagal mengupdate tugas: ' + error.message, 'error');
        }
    }

    // DIPERBAIKI: Fungsi addTodo dengan penanganan tanggal yang benar
    async function addTodo(e) {
        if (e) e.preventDefault();
        
        console.log('➕ addTodo called');
        
        if (!taskInput || !taskInput.value.trim()) {
            notificationManager.showMessage('Isi tugas terlebih dahulu!', 'error', 2000);
            if (taskInput) taskInput.focus();
            return;
        }

        if (!dueDateInput || !dueDateInput.value) {
            notificationManager.showMessage('Pilih tanggal jatuh tempo!', 'error', 2000);
            if (dueDateInput) dueDateInput.focus();
            return;
        }

        // Validasi format tanggal
        const selectedDateStr = dueDateInput.value;
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        
        if (!dateRegex.test(selectedDateStr)) {
            notificationManager.showMessage('Format tanggal tidak valid! Gunakan format YYYY-MM-DD', 'error', 3000);
            if (dueDateInput) dueDateInput.focus();
            return;
        }

        const selectedDateValue = new Date(selectedDateStr + 'T00:00:00');
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        console.log('📅 Selected Date (String):', selectedDateStr);
        console.log('📅 Selected Date (Date):', selectedDateValue);
        console.log('📅 Today:', today);
        
        if (selectedDateValue < today) {
            notificationManager.showMessage('Tidak bisa memilih tanggal masa lalu!', 'error', 3000);
            if (dueDateInput) dueDateInput.focus();
            return;
        }

        try {
            const taskData = {
                title: taskInput.value.trim(),
                description: '',
                dueDate: selectedDateStr, // Format: '2024-01-05' (JANGAN diubah!)
                priority: priorityInput ? priorityInput.value : 'normal',
                category: categoryInput ? categoryInput.value : 'kuliah',
                status: 'todo'
            };
            
            console.log('📤 Task data to send:', taskData);
            
            const response = await apiService.createTask(taskData);
            console.log('✅ Backend response:', response);
            
            if (response && response.task) {
                notificationManager.showMessage('Tugas berhasil ditambahkan! ✓', 'success', 2000);
                
                // Parse tanggal dari response dengan benar
                const newTask = {
                    ...response.task,
                    due_date: response.task.due_date_formatted || 
                             (response.task.due_date ? 
                              response.task.due_date.split('T')[0] : 
                              selectedDateStr)
                };
                
                console.log('📝 New task to add:', newTask);
                
                todos.push(newTask);
                
                if (taskInput) taskInput.value = '';
                
                // Refresh tampilan
                renderCalendar();
                renderTodos();
                await loadTaskStats();
                
                setTimeout(() => {
                    updateReminders();
                }, 1000);
            } else if (response && response.message) {
                notificationManager.showMessage(response.message, 'success', 2000);
                await loadTasks();
                renderCalendar();
                renderTodos();
                await loadTaskStats();
            } else {
                notificationManager.showMessage('Tugas dibuat tetapi respons tidak valid', 'warning');
            }
        } catch (error) {
            console.error('❌ Error adding todo:', error);
            notificationManager.showMessage('Gagal menambahkan tugas: ' + error.message, 'error');
        }
    }

    async function addQuickEvent(e) {
        if (e) e.preventDefault();
        
        if (!eventName || !eventName.value.trim() || !eventDate || !eventDate.value) {
            notificationManager.showMessage('Isi nama event dan tanggal dulu!', 'error', 2000);
            return;
        }

        try {
            const taskData = {
                title: eventName.value.trim(),
                description: '',
                dueDate: eventDate.value,
                priority: 'normal',
                category: 'lainnya',
                status: 'todo'
            };
            
            const response = await apiService.createTask(taskData);
            if (response && response.task) {
                notificationManager.showMessage('Event berhasil ditambahkan! ✓', 'success', 2000);
                
                const newTask = {
                    ...response.task,
                    due_date: response.task.due_date_formatted || 
                             (response.task.due_date ? 
                              response.task.due_date.split('T')[0] : 
                              eventDate.value)
                };
                
                todos.push(newTask);
                
                if (eventName) eventName.value = '';
                
                selectedDate = taskData.dueDate;
                if (dueDateInput) dueDateInput.value = selectedDate;
                
                renderCalendar();
                renderTodos();
                await loadTaskStats();
                
                setTimeout(() => {
                    updateReminders();
                }, 2500);
            }
        } catch (error) {
            notificationManager.showMessage('Gagal menambahkan event: ' + error.message, 'error');
        }
    }

    // Filter Functions
    function applyFilters() {
        renderTodos();
    }

    function resetFilters() {
        if (filterDate) filterDate.value = '';
        if (filterPriority) filterPriority.value = '';
        if (taskSearch) taskSearch.value = '';
        renderTodos();
        notificationManager.showMessage('Filter direset', 'info', 2000);
    }

    // Progress Functions
    function updateProgress(list) {
        const total = list.length;
        const done = list.filter(t => t.status === 'completed').length;
        
        if (progressText) {
            progressText.textContent = `${done}/${total} tugas selesai`;
        }
        
        const percent = total ? Math.round(done * 100 / total) : 0;
        
        if (percentText) {
            percentText.textContent = percent + '%';
        }
        
        if (progressFill) {
            progressFill.style.width = percent + '%';
        }

        if (total > 0 && done === total) {
            showReward();
        }
    }

    function updateStatsDisplay(stats) {
        if (totalTasks) totalTasks.textContent = stats.total || 0;
        if (completedTasks) completedTasks.textContent = stats.completed || 0;
        if (pendingTasks) pendingTasks.textContent = stats.pending || 0;
        if (overdueTasks) overdueTasks.textContent = stats.overdue || 0;
    }

    // Reward Functions
    function showReward() {
        const rewardContent = document.querySelector('.reward-content');
        if (rewardContent) {
            rewardContent.innerHTML = `
                <div class="reward-icon"></div>
                <h3>Selamat! Semua Tugas Selesai!</h3>
                <p>Kamu telah menyelesaikan <strong>semua tugas</strong> untuk tanggal ${formatDateDisplay(selectedDate)}. Luar biasa!</p>
                <p>Istirahat sebentar atau beri reward kecil untuk dirimu </p>
                <button id="closeReward" class="primary-btn" aria-label="Tutup popup reward">Tutup</button>
            `;
            
            const closeBtn = document.getElementById('closeReward');
            if (closeBtn) {
                closeBtn.addEventListener('click', hideReward);
            }
        }
        
        if (rewardPopup) {
            rewardPopup.classList.add('show');
            
            setTimeout(() => {
                if (rewardPopup.classList.contains('show')) {
                    hideReward();
                }
            }, 8000);
        }
    }

    function hideReward() {
        if (rewardPopup) {
            rewardPopup.classList.remove('show');
        }
    }

    // Tasks Popup Functions
    async function showTasksPopup() {
        if (!tasksPopup) return;
        
        tasksPopup.classList.add('active');
        tasksPopupOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        try {
            await loadTasks();
            renderTasksPopup();
        } catch (error) {
            notificationManager.showMessage('Gagal memuat data', 'error');
        }
    }

    function hideTasksPopup() {
        if (!tasksPopup) return;
        
        tasksPopup.classList.remove('active');
        tasksPopupOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    async function renderTasksPopup() {
        try {
            const monthFilter = tasksFilterMonth ? tasksFilterMonth.value : '';
            const statusFilter = tasksFilterStatus ? tasksFilterStatus.value : '';
            const priorityFilter = tasksFilterPriority ? tasksFilterPriority.value : '';
            const categoryFilter = tasksFilterCategory ? tasksFilterCategory.value : '';
            
            const filters = {};
            if (monthFilter !== '') {
                const monthNum = parseInt(monthFilter);
                const year = new Date().getFullYear();
                const firstDay = new Date(year, monthNum, 1);
                const lastDay = new Date(year, monthNum + 1, 0);
                filters.dueDate = toISO(firstDay);
            }
            if (statusFilter !== '') filters.status = statusFilter;
            if (priorityFilter !== '') filters.priority = priorityFilter;
            if (categoryFilter !== '') filters.category = categoryFilter;
            
            let filtered = todos;
            
            if (Object.keys(filters).length > 0) {
                filtered = filtered.filter(task => {
                    if (filters.dueDate) {
                        const taskDate = new Date(task.due_date);
                        const filterDate = new Date(filters.dueDate);
                        if (taskDate.getMonth() !== filterDate.getMonth()) return false;
                    }
                    if (filters.status && task.status !== filters.status) return false;
                    if (filters.priority && task.priority !== filters.priority) return false;
                    if (filters.category && task.category !== filters.category) return false;
                    return true;
                });
            }
            
            const total = todos.length;
            const completed = todos.filter(t => t.status === 'completed').length;
            const pending = total - completed;
            const overdue = todos.filter(t => t.status !== 'completed' && new Date(t.due_date + 'T00:00:00') < new Date()).length;
            
            if (totalTasks) totalTasks.textContent = total;
            if (completedTasks) completedTasks.textContent = completed;
            if (pendingTasks) pendingTasks.textContent = pending;
            if (overdueTasks) overdueTasks.textContent = overdue;
            
            renderFilteredTasksPopup(filtered);
        } catch (error) {
            console.error('Error rendering tasks popup:', error);
            if (tasksPopupList) {
                tasksPopupList.innerHTML = `
                    <div class="no-tasks">
                        <i class='bx bx-error' style="font-size: 3rem; margin-bottom: 15px; display: block; color: #ff6b6b;"></i>
                        <p>Gagal memuat data tugas.</p>
                        <p class="helper-text">Coba refresh halaman.</p>
                    </div>
                `;
            }
        }
    }

    function renderFilteredTasksPopup(filteredTasks) {
        if (!tasksPopupList) return;
        
        tasksPopupList.innerHTML = '';

        if (filteredTasks.length === 0) {
            tasksPopupList.innerHTML = `
                <div class="no-tasks">
                    <i class='bx bx-search-alt' style="font-size: 3rem; margin-bottom: 15px; display: block; color: #ccc;"></i>
                    <p>Tidak ada tugas yang sesuai dengan filter.</p>
                    <p class="helper-text">Coba ubah filter atau tambahkan tugas baru.</p>
                </div>
            `;
            return;
        }

        const tasksByDate = {};
        filteredTasks.forEach(task => {
            if (!tasksByDate[task.due_date]) {
                tasksByDate[task.due_date] = [];
            }
            tasksByDate[task.due_date].push(task);
        });

        const sortedDates = Object.keys(tasksByDate).sort((a, b) => new Date(a) - new Date(b));

        sortedDates.forEach(date => {
            const tasks = tasksByDate[date];
            const dateGroup = document.createElement('div');
            dateGroup.className = 'tasks-group';

            const dateHeader = document.createElement('div');
            dateHeader.className = 'tasks-group-header';
            dateHeader.textContent = formatDateDisplay(date);

            const tasksList = document.createElement('div');
            tasksList.className = 'tasks-list';

            tasks.forEach(task => {
                const taskEl = createTaskPopupElement(task);
                tasksList.appendChild(taskEl);
            });

            dateGroup.appendChild(dateHeader);
            dateGroup.appendChild(tasksList);
            tasksPopupList.appendChild(dateGroup);
        });

        attachTasksPopupEvents();
    }

    function createTaskPopupElement(task) {
        const isOverdue = task.status !== 'completed' && new Date(task.due_date + 'T00:00:00') < new Date();
        const updatedIndicator = task.updated_at ? '<span class="task-popup-chip">Diupdate</span>' : '';
        
        const el = document.createElement('div');
        el.className = `task-popup-item ${task.status === 'completed' ? 'completed' : ''}`;

        el.innerHTML = `
            <div class="task-popup-checkbox ${task.status === 'completed' ? 'checked' : ''}" 
                 data-id="${task.id}" 
                 data-status="${task.status}">
                 ${task.status === 'completed' ? '✓' : ''}
            </div>
            <div class="task-popup-content">
                <div class="task-popup-title">${escapeHtml(task.title || 'No title')}</div>
                ${task.description ? `<div class="task-popup-description">${escapeHtml(task.description)}</div>` : ''}
                <div class="task-popup-meta">
                    <span class="task-popup-chip ${task.status}">${statusLabels[task.status] || task.status || 'todo'}</span>
                    <span class="task-popup-chip">${categoryLabels[task.category] || task.category || 'lainnya'}</span>
                    <span class="task-popup-chip">${priorityLabels[task.priority] || task.priority || 'normal'}</span>
                    ${isOverdue ? '<span class="task-popup-chip" style="background:#ffcccc;">Terlambat</span>' : ''}
                    <span class="task-popup-chip">${formatDateDisplay(task.due_date) || 'No date'}</span>
                    ${updatedIndicator}
                </div>
            </div>
            <div class="todo-actions">
                ${task.status !== 'completed' ? `
                    <button class="status-btn" data-id="${task.id}" data-status="in_progress" title="Tandai sedang dikerjakan">
                        <i class='bx bx-play'></i>
                    </button>
                    <button class="status-btn complete-btn" data-id="${task.id}" data-status="completed" title="Tandai selesai">
                        <i class='bx bx-check'></i>
                    </button>
                ` : `
                    <button class="status-btn" data-id="${task.id}" data-status="todo" title="Tandai belum mulai">
                        <i class='bx bx-undo'></i>
                    </button>
                `}
                <button class="edit-btn" data-id="${task.id}" title="Edit tugas">
                    <i class='bx bx-edit'></i>
                </button>
                <button class="delete-btn" data-id="${task.id}" title="Hapus tugas">
                    <i class='bx bx-trash'></i>
                </button>
            </div>
        `;

        return el;
    }

    function attachTasksPopupEvents() {
        document.querySelectorAll('.task-popup-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', handleCheckboxClick);
        });

        document.querySelectorAll('.task-popup-item .status-btn').forEach(btn => {
            btn.addEventListener('click', handleStatusButtonClick);
        });

        document.querySelectorAll('.task-popup-item .delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDeleteClick);
        });
        
        document.querySelectorAll('.task-popup-item .edit-btn').forEach(btn => {
            btn.addEventListener('click', handleEditClick);
        });
    }

    // Reminder Functions - DIPERBAIKI
    function checkUpcomingDeadlines() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = toISO(tomorrow);
        
        const urgent = todos.filter(task => {
            if (task.status === 'completed') return false;
            return task.due_date === tomorrowStr;
        }).map(task => ({
            ...task,
            daysLeft: 1
        }));

        return { urgent };
    }

    function updateReminders() {
        const { urgent } = checkUpcomingDeadlines();
        notificationManager.showReminder(urgent);
    }

    // Utility Functions
    function escapeHtml(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatDateDisplay(dateStr) {
        if (!dateStr) return 'No date';
        try {
            const date = new Date(dateStr + 'T00:00:00');
            return date.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            console.error('Error formatting date:', e);
            return dateStr;
        }
    }

    // Initialize the application
    initializeApp();

    // Check reminders periodically
    setInterval(updateReminders, 5 * 60 * 1000);
    
    // Debug functions
    window.debug = {
        apiService,
        todos: () => todos,
        loadTasks,
        addTodo: (title, date) => {
            if (taskInput) taskInput.value = title || 'Test Task';
            if (dueDateInput) dueDateInput.value = date || new Date().toISOString().split('T')[0];
            addTodo();
        },
        updateTaskStatus,
        renderTodos,
        selectedDate: () => selectedDate,
        testDate: function(dateStr) {
            console.log('🧪 Testing date:', dateStr);
            selectedDate = dateStr;
            if (dueDateInput) dueDateInput.value = dateStr;
            renderTodos();
        }
    };
    
    console.log('✅ App loaded successfully');
});
