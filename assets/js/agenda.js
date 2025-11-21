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
    // State & Konfigurasi
    const STORAGE_KEY = 'trackify_todos_v8';
    let todos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
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
    let selectedDate = urlParams.get('date') || toISO(today);
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

    // Notification Manager
    class NotificationManager {
        constructor() {
            this.notifications = [];
            this.isShowingReminder = false;
            this.messageQueue = [];
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
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class='bx ${this.getIcon(type)}'></i>
                    <span>${message}</span>
                </div>
            `;

            document.body.appendChild(notification);

            // Auto remove
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

            this.isShowingReminder = true;
            reminderBadge.textContent = totalReminders;

            if (urgentTasks.length > 0) {
                const urgentTask = urgentTasks[0];
                reminderTitle.textContent = '⏰ Pengingat Deadline!';
                reminderMessage.textContent = `"${urgentTask.text}" deadline besok!`;
            }

            reminderNotification.classList.add('show');

            // Auto hide setelah 10 detik
            setTimeout(() => {
                this.hideReminder();
            }, 10000);
        }

        hideReminder() {
            this.isShowingReminder = false;
            reminderNotification.classList.remove('show');
        }
    }

    const notificationManager = new NotificationManager();

    // Initialize App
    function initializeApp() {
        // Show loading
        if (loadingElement) {
            loadingElement.style.display = 'flex';
        }

        setupEventListeners();
        
        // Set default dates
        dueDateInput.value = selectedDate;
        eventDate.value = toISO(today);
        dueDateInput.min = new Date().toISOString().split('T')[0];
        eventDate.min = new Date().toISOString().split('T')[0];

        // Initial render with slight delay for better UX
        setTimeout(() => {
            renderCalendar();
            setSelectedDate(selectedDate);
            renderTodos();
            
            // Initial reminder check
            setTimeout(() => {
                updateReminders();
            }, 1000);

            // Hide loading
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
        }, 800);
    }

    // Setup Event Listeners
    function setupEventListeners() {
        // Calendar Navigation
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });

        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });

        // Forms
        addForm.addEventListener('submit', addTodo);
        addEventBtn.addEventListener('click', addQuickEvent);

        // Filters
        filterDate.addEventListener('change', applyFilters);
        filterPriority.addEventListener('change', applyFilters);
        clearFilters.addEventListener('click', resetFilters);

        // Search
        taskSearch.addEventListener('input', function() {
            applyFilters();
        });

        // Popups
        closeReward.addEventListener('click', hideReward);
        viewAllTasksBtn.addEventListener('click', showTasksPopup);
        tasksPopupClose.addEventListener('click', hideTasksPopup);
        tasksPopupOverlay.addEventListener('click', hideTasksPopup);

        // Task Popup Filters
        tasksFilterMonth.addEventListener('change', renderTasksPopup);
        tasksFilterStatus.addEventListener('change', renderTasksPopup);
        tasksFilterPriority.addEventListener('change', renderTasksPopup);
        tasksFilterCategory.addEventListener('change', renderTasksPopup);

        // Edit Modal Events
        editModalClose.addEventListener('click', hideEditModal);
        editCancel.addEventListener('click', hideEditModal);
        editForm.addEventListener('submit', saveEditedTodo);
        editModalOverlay.addEventListener('click', hideEditModal);

        // Reminder
        reminderClose.addEventListener('click', () => {
            notificationManager.hideReminder();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                if (tasksPopup.classList.contains('active')) {
                    hideTasksPopup();
                }
                if (editModal.classList.contains('active')) {
                    hideEditModal();
                }
                if (sidebar.classList.contains('active')) {
                    sidebar.classList.remove('active');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
                if (rewardPopup.classList.contains('show')) {
                    hideReward();
                }
                notificationManager.hideReminder();
            }
            
            // Ctrl+E untuk edit task pertama
            if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
                e.preventDefault();
                const firstTodo = document.querySelector('.todo-item:not(.completed)');
                if (firstTodo) {
                    const id = firstTodo.querySelector('.todo-checkbox').dataset.id;
                    showEditModal(id);
                }
            }
        });

        // Enter key untuk quick add
        eventName.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addQuickEvent();
            }
        });

        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                addTodo(e);
            }
        });
    }

    // Calendar Functions
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        monthYear.textContent = currentDate.toLocaleString('id-ID', { month: 'long' }) + ' ' + year;

        const firstDay = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();

        calendarGrid.innerHTML = '';

        // Empty slots
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'day';
            empty.style.visibility = 'hidden';
            calendarGrid.appendChild(empty);
        }

        // Days
        for (let d = 1; d <= lastDay; d++) {
            const dateStr = `${year}-${pad(month + 1)}-${pad(d)}`;
            const dayEl = document.createElement('div');
            dayEl.className = 'day';
            
            // Check if today
            if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayEl.classList.add('today');
            }
            
            // Check for events
            const dayTodos = todos.filter(t => t.date === dateStr);
            if (dayTodos.length > 0) {
                dayEl.classList.add('event');
            }

            dayEl.innerHTML = `<div class="date">${d}</div>`;
            
            // Event badge
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
            
            // Event listener yang diperbaiki
            addIcon.addEventListener('click', function(ev) {
                ev.preventDefault();
                ev.stopPropagation();
                ev.stopImmediatePropagation();
                
                selectDatePreserveFilters(dateStr);
                
                // Focus ke task input dengan delay
                setTimeout(() => {
                    if (taskInput) {
                        taskInput.focus();
                    }
                }, 150);
            });
            
            // Support untuk keyboard accessibility
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
            
            // Day click - untuk memilih tanggal (tanpa reset filter)
            dayEl.addEventListener('click', () => {
                selectDatePreserveFilters(dateStr);
            });

            calendarGrid.appendChild(dayEl);
        }
    }

    function selectDatePreserveFilters(dateStr) {
        // Simpan state filter sebelum mengganti date
        const currentDateFilter = filterDate.value;
        const currentPriorityFilter = filterPriority.value;
        const currentSearchTerm = taskSearch.value;
        
        // Update selected date
        selectedDate = dateStr;
        dateLabel.textContent = `Semua Tugas`;
        dueDateInput.value = dateStr;
        updateQueryParam(dateStr);
        
        // Render todos dengan filter yang sama
        setTimeout(() => {
            // Restore filters
            if (currentDateFilter) filterDate.value = currentDateFilter;
            if (currentPriorityFilter) filterPriority.value = currentPriorityFilter;
            if (currentSearchTerm) taskSearch.value = currentSearchTerm;
            
            // Re-render dengan filter yang dipulihkan
            renderTodos();
        }, 10);
    }

    function setSelectedDate(dateStr) {
        selectedDate = dateStr;
        dateLabel.textContent = `Semua Tugas`;
        dueDateInput.value = dateStr;
        renderTodos();
        updateQueryParam(dateStr);
    }

    function updateQueryParam(dateStr) {
        const url = new URL(window.location.href);
        url.searchParams.set('date', dateStr);
        window.history.replaceState({}, '', url);
    }

    // Todo Functions
    function renderTodos() {
        let filtered = getFilteredTodos();
        renderFilteredTodos(filtered);
    }

    function getFilteredTodos() {
        // Hanya ambil tugas dari tanggal yang dipilih
        let filtered = todos.filter(t => t.date === selectedDate);
        
        const dateFilter = filterDate.value;
        const priorityFilter = filterPriority.value;
        const searchTerm = taskSearch.value.toLowerCase().trim();
        
        // Filter tambahan berdasarkan tanggal jika ada filter tanggal
        if (dateFilter) {
            filtered = filtered.filter(t => t.date === dateFilter);
        }
        
        if (priorityFilter) {
            filtered = filtered.filter(t => t.priority === priorityFilter);
        }
        
        if (searchTerm) {
            filtered = filtered.filter(t => 
                t.text.toLowerCase().includes(searchTerm) ||
                categoryLabels[t.category].toLowerCase().includes(searchTerm) ||
                priorityLabels[t.priority].toLowerCase().includes(searchTerm)
            );
        }
        
        return filtered;
    }

    function renderFilteredTodos(filtered) {
        todoListEl.innerHTML = '';

        if (filtered.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'todo-item';
            empty.style.justifyContent = 'center';
            empty.style.background = 'transparent';
            empty.style.boxShadow = 'none';
            
            const searchTerm = taskSearch.value;
            const dateFilter = filterDate.value;
            const priorityFilter = filterPriority.value;
            
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
            // Urutkan tugas: yang belum selesai dulu, lalu berdasarkan tanggal
            filtered.sort((a, b) => {
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1;
                }
                return new Date(a.date) - new Date(b.date);
            });

            filtered.forEach(todo => {
                const todoEl = createTodoElement(todo);
                todoListEl.appendChild(todoEl);
            });
        }

        // Update progress dengan semua tugas di tanggal yang dipilih
        const allTasksForSelectedDate = todos.filter(t => t.date === selectedDate);
        updateProgress(allTasksForSelectedDate);
        attachTodoEvents();
    }

    function createTodoElement(todo) {
        const el = document.createElement('div');
        el.className = 'todo-item';
        if (todo.completed) el.classList.add('completed');

        const overdue = new Date(todo.date) < new Date() && !todo.completed;
        if (overdue) el.classList.add('overdue');

        const updatedIndicator = todo.updatedAt ? '<span class="todo-chip">Diupdate</span>' : '';

        el.innerHTML = `
            <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" data-id="${todo.id}"></div>
            <div class="todo-content">
                <div class="todo-title">${escapeHtml(todo.text)}</div>
                <div class="todo-meta">
                    <span class="todo-chip">${categoryLabels[todo.category]}</span>
                    <span class="todo-chip">${formatDateDisplay(todo.date)}</span>
                    ${todo.priority !== 'normal' ? `<span class="todo-chip">${priorityLabels[todo.priority]}</span>` : ''}
                    ${updatedIndicator}
                    ${overdue ? '<span class="todo-chip" style="background:#ffcccc;">Terlambat</span>' : ''}
                </div>
            </div>
            <div class="todo-actions">
                <button class="edit-btn" data-id="${todo.id}" title="Edit tugas">
                    <i class='bx bx-edit'></i>
                </button>
                <button class="delete-btn" data-id="${todo.id}" title="Hapus tugas">
                    <i class='bx bx-trash'></i>
                </button>
            </div>
        `;

        return el;
    }

    function attachTodoEvents() {
        // Checkbox events
        document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = checkbox.dataset.id;
                const todo = todos.find(t => t.id === id);
                if (todo) {
                    const wasCompleted = todo.completed;
                    todo.completed = !todo.completed;
                    saveTodos();
                    renderTodos();
                    renderCalendar();
                    updateReminders();
                    
                    // Tampilkan pesan untuk tugas individual
                    notificationManager.showMessage(
                        todo.completed ? 'Tugas diselesaikan! ✓' : 'Tugas ditandai belum selesai', 
                        'success',
                        2000
                    );
                }
            });
        });

        // Delete events
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const todo = todos.find(t => t.id === id);
                if (id && confirm(`Hapus tugas "${todo.text}"?`)) {
                    todos = todos.filter(t => t.id !== id);
                    saveTodos();
                    renderCalendar();
                    renderTodos();
                    updateReminders();
                    notificationManager.showMessage('Tugas berhasil dihapus', 'success', 2000);
                }
            });
        });
        
        // Edit events
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                showEditModal(id);
            });
        });
        
        // Double click to edit
        document.querySelectorAll('.todo-item').forEach(item => {
            let clickCount = 0;
            let clickTimer = null;
            
            item.addEventListener('click', (e) => {
                // Skip jika klik pada elemen yang tidak boleh trigger double click
                if (e.target.closest('.todo-checkbox') || 
                    e.target.closest('.todo-actions') || 
                    e.target.closest('.edit-input')) {
                    return;
                }
                
                clickCount++;
                
                if (clickCount === 1) {
                    clickTimer = setTimeout(() => {
                        clickCount = 0;
                    }, 300);
                } else if (clickCount === 2) {
                    clearTimeout(clickTimer);
                    clickCount = 0;
                    
                    const id = item.querySelector('.todo-checkbox').dataset.id;
                    const todo = todos.find(t => t.id === id);
                    if (todo && !todo.completed) {
                        enableInlineEdit(id);
                    }
                }
            });
        });
    }

    // Edit Modal Functions
    function showEditModal(todoId) {
        const todo = todos.find(t => t.id === todoId);
        if (!todo) {
            notificationManager.showMessage('Tugas tidak ditemukan!', 'error');
            return;
        }
        
        // Isi formulir dengan data saat ini
        editTaskId.value = todo.id;
        editTaskText.value = todo.text;
        editDueDate.value = todo.date;
        editPriority.value = todo.priority;
        editCategory.value = todo.category;
        
        // Set min date untuk edit
        editDueDate.min = new Date().toISOString().split('T')[0];
        
        editModal.classList.add('active');
        editModalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus dan select text
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

    function saveEditedTodo(e) {
        e.preventDefault();
        
        const todoId = editTaskId.value;
        const todo = todos.find(t => t.id === todoId);
        
        if (!todo) {
            notificationManager.showMessage('Tugas tidak ditemukan!', 'error');
            return;
        }
        
        if (!editTaskText.value.trim()) {
            notificationManager.showMessage('Nama tugas tidak boleh kosong!', 'error');
            editTaskText.focus();
            return;
        }
        
        // Validasi tanggal
        const selectedDate = new Date(editDueDate.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            notificationManager.showMessage('Tidak bisa memilih tanggal masa lalu!', 'error');
            editDueDate.focus();
            return;
        }
        
        // Update todo data
        todo.text = editTaskText.value.trim();
        todo.date = editDueDate.value;
        todo.priority = editPriority.value;
        todo.category = editCategory.value;
        todo.updatedAt = Date.now();
        
        saveTodos();
        renderCalendar();
        renderTodos();
        hideEditModal();
        
        notificationManager.showMessage('Tugas berhasil diupdate! ✓', 'success', 2000);
    }

    // Inline Edit Functions
    function enableInlineEdit(todoId) {
        const todo = todos.find(t => t.id === todoId);
        const todoElement = document.querySelector(`.todo-checkbox[data-id="${todoId}"]`).closest('.todo-item');
        
        if (!todo || !todoElement) {
            console.error('Todo tidak ditemukan untuk edit inline:', todoId);
            return;
        }
        
        // Set editing mode
        todoElement.classList.add('editing');
        
        const currentContent = todoElement.querySelector('.todo-content');
        if (!currentContent) {
            console.error('Elemen todo-content tidak ditemukan');
            return;
        }
        
        // Simpan konten asli untuk fallback
        const originalContent = currentContent.innerHTML;
        
        currentContent.innerHTML = `
            <input type="text" class="edit-input" value="${escapeHtml(todo.text)}" placeholder="Nama tugas...">
            <div class="edit-actions">
                <button type="button" class="edit-save" data-id="${todoId}">
                    <i class='bx bx-check'></i> Simpan
                </button>
                <button type="button" class="edit-cancel" data-id="${todoId}">
                    <i class='bx bx-x'></i> Batal
                </button>
            </div>
        `;
        
        const input = currentContent.querySelector('.edit-input');
        if (!input) {
            console.error('Input edit tidak ditemukan');
            currentContent.innerHTML = originalContent;
            return;
        }
        
        // Focus dan select semua text
        input.focus();
        input.select();
        
        // Event listeners untuk tombol inline
        const saveBtn = currentContent.querySelector('.edit-save');
        const cancelBtn = currentContent.querySelector('.edit-cancel');
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => saveInlineEdit(todoId));
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => cancelInlineEdit(todoId));
        }
        
        // Enter to save, Escape to cancel
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveInlineEdit(todoId);
            } else if (e.key === 'Escape') {
                cancelInlineEdit(todoId);
            }
        });
        
        // Click outside to save
        const outsideClickHandler = (e) => {
            if (!todoElement.contains(e.target)) {
                saveInlineEdit(todoId);
                document.removeEventListener('click', outsideClickHandler);
            }
        };
        
        // Delay sedikit untuk menghindari trigger langsung
        setTimeout(() => {
            document.addEventListener('click', outsideClickHandler);
        }, 100);
    }

    function saveInlineEdit(todoId) {
        const todo = todos.find(t => t.id === todoId);
        const todoElement = document.querySelector(`.todo-checkbox[data-id="${todoId}"]`).closest('.todo-item');
        
        if (!todo || !todoElement) {
            console.error('Todo tidak ditemukan untuk disimpan:', todoId);
            return;
        }
        
        const input = todoElement.querySelector('.edit-input');
        if (!input) {
            console.error('Input edit tidak ditemukan untuk disimpan');
            return;
        }
        
        const newText = input.value.trim();
        
        if (!newText) {
            notificationManager.showMessage('Nama tugas tidak boleh kosong!', 'error');
            input.focus();
            return;
        }
        
        if (newText === todo.text) {
            // Tidak ada perubahan, cukup batalkan
            cancelInlineEdit(todoId);
            return;
        }
        
        // Update todo data
        todo.text = newText;
        todo.updatedAt = Date.now();
        
        saveTodos();
        renderTodos(); // Render ulang untuk menampilkan perubahan
        
        notificationManager.showMessage('Tugas berhasil diupdate! ✓', 'success', 2000);
    }

    function cancelInlineEdit(todoId) {
        const todoElement = document.querySelector(`.todo-checkbox[data-id="${todoId}"]`)?.closest('.todo-item');
        if (todoElement) {
            todoElement.classList.remove('editing');
        }
        renderTodos(); // Render ulang untuk kembali ke tampilan normal
    }

    function addTodo(e) {
        e.preventDefault();
        
        if (!taskInput.value.trim()) {
            notificationManager.showMessage('Isi tugas terlebih dahulu!', 'error', 2000);
            taskInput.focus();
            return;
        }

        if (!dueDateInput.value) {
            notificationManager.showMessage('Pilih tanggal jatuh tempo!', 'error', 2000);
            dueDateInput.focus();
            return;
        }

        // Validasi tanggal tidak boleh masa lalu
        const selectedDate = new Date(dueDateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
            notificationManager.showMessage('Tidak bisa memilih tanggal masa lalu!', 'error', 3000);
            dueDateInput.focus();
            return;
        }

        const newTodo = {
            id: Date.now().toString(),
            text: taskInput.value.trim(),
            date: dueDateInput.value,
            priority: priorityInput.value,
            category: categoryInput.value,
            completed: false,
            createdAt: Date.now()
        };

        todos.push(newTodo);
        saveTodos();
        taskInput.value = '';
        renderCalendar();
        renderTodos();
        
        notificationManager.showMessage('Tugas berhasil ditambahkan! ✓', 'success', 2000);
        
        setTimeout(() => {
            updateReminders();
        }, 2500);
    }

    function addQuickEvent() {
        if (!eventName.value.trim() || !eventDate.value) {
            notificationManager.showMessage('Isi nama event dan tanggal dulu!', 'error', 2000);
            return;
        }

        const newTodo = {
            id: Date.now().toString(),
            text: eventName.value.trim(),
            date: eventDate.value,
            priority: 'normal',
            category: 'lainnya',
            completed: false,
            createdAt: Date.now()
        };

        todos.push(newTodo);
        saveTodos();
        eventName.value = '';
        renderCalendar();
        setSelectedDate(newTodo.date);
        
        notificationManager.showMessage('Event berhasil ditambahkan! ✓', 'success', 2000);
        
        setTimeout(() => {
            updateReminders();
        }, 2500);
    }

    // Filter Functions
    function applyFilters() {
        renderTodos();
    }

    function resetFilters() {
        filterDate.value = '';
        filterPriority.value = '';
        taskSearch.value = '';
        renderTodos();
        notificationManager.showMessage('Filter direset', 'info', 2000);
    }

    // Progress Functions
    function updateProgress(list) {
        const total = list.length;
        const done = list.filter(t => t.completed).length;
        progressText.textContent = `${done}/${total} tugas selesai`;
        const percent = total ? Math.round(done * 100 / total) : 0;
        percentText.textContent = percent + '%';
        progressFill.style.width = percent + '%';

        if (total > 0 && done === total) {
            const allTasksForSelectedDate = todos.filter(t => t.date === selectedDate);
            const allCompleted = allTasksForSelectedDate.every(t => t.completed);
            
            if (allCompleted && allTasksForSelectedDate.length > 0) {
                showReward();
            }
        }
    }

    // Reward Functions - PERBAIKAN UTAMA: Motivasi untuk menyelesaikan semua tugas
    function showReward() {
        // Update konten reward popup untuk semua tugas
        const rewardContent = document.querySelector('.reward-content');
        if (rewardContent) {
            rewardContent.innerHTML = `
                <div class="reward-icon">🎉</div>
                <h3>Selamat! Semua Tugas Selesai!</h3>
                <p>Kamu telah menyelesaikan <strong>semua tugas</strong> untuk tanggal ${formatDateDisplay(selectedDate)}. Luar biasa!</p>
                <p>Istirahat sebentar atau beri reward kecil untuk dirimu</p>
                <button id="closeReward" class="primary-btn" aria-label="Tutup popup reward">Tutup</button>
            `;
            
            // Re-attach event listener untuk tombol close
            const closeBtn = document.getElementById('closeReward');
            if (closeBtn) {
                closeBtn.addEventListener('click', hideReward);
            }
        }
        
        rewardPopup.classList.add('show');
        
        // Auto hide setelah 8 detik
        setTimeout(() => {
            if (rewardPopup.classList.contains('show')) {
                hideReward();
            }
        }, 8000);
    }

    function hideReward() {
        rewardPopup.classList.remove('show');
    }

    // PERBAIKAN: Fungsi untuk mengecek apakah semua tugas di tanggal tertentu sudah selesai
    function checkAllTasksCompleted(date) {
        const tasksForDate = todos.filter(t => t.date === date);
        return tasksForDate.length > 0 && tasksForDate.every(t => t.completed);
    }

    // Tasks Popup Functions
    function showTasksPopup() {
        tasksPopup.classList.add('active');
        tasksPopupOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        renderTasksPopup();
    }

    function hideTasksPopup() {
        tasksPopup.classList.remove('active');
        tasksPopupOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    function renderTasksPopup() {
        // Calculate statistics
        const total = todos.length;
        const completed = todos.filter(t => t.completed).length;
        const pending = total - completed;
        const overdue = todos.filter(t => !t.completed && new Date(t.date) < new Date()).length;

        // Update statistics
        totalTasks.textContent = total;
        completedTasks.textContent = completed;
        pendingTasks.textContent = pending;
        overdueTasks.textContent = overdue;

        // Apply filters
        const filteredTasks = getFilteredTasksPopup();
        renderFilteredTasksPopup(filteredTasks);
    }

    function getFilteredTasksPopup() {
        const monthFilter = tasksFilterMonth.value;
        const statusFilter = tasksFilterStatus.value;
        const priorityFilter = tasksFilterPriority.value;
        const categoryFilter = tasksFilterCategory.value;

        let filtered = [...todos];

        if (monthFilter !== '') {
            filtered = filtered.filter(task => {
                const taskMonth = new Date(task.date).getMonth().toString();
                return taskMonth === monthFilter;
            });
        }

        if (statusFilter === 'completed') {
            filtered = filtered.filter(task => task.completed);
        } else if (statusFilter === 'pending') {
            filtered = filtered.filter(task => !task.completed);
        }

        if (priorityFilter !== '') {
            filtered = filtered.filter(task => task.priority === priorityFilter);
        }

        if (categoryFilter !== '') {
            filtered = filtered.filter(task => task.category === categoryFilter);
        }

        return filtered;
    }

    function renderFilteredTasksPopup(filteredTasks) {
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

        // Group by date
        const tasksByDate = {};
        filteredTasks.forEach(task => {
            if (!tasksByDate[task.date]) {
                tasksByDate[task.date] = [];
            }
            tasksByDate[task.date].push(task);
        });

        // Sort dates
        const sortedDates = Object.keys(tasksByDate).sort((a, b) => new Date(b) - new Date(a));

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
        const isOverdue = !task.completed && new Date(task.date) < new Date();
        const updatedIndicator = task.updatedAt ? '<span class="task-popup-chip">Diupdate</span>' : '';
        
        const el = document.createElement('div');
        el.className = `task-popup-item ${task.completed ? 'completed' : ''}`;

        el.innerHTML = `
            <div class="task-popup-checkbox ${task.completed ? 'checked' : ''}" data-id="${task.id}"></div>
            <div class="task-popup-content">
                <div class="task-popup-title">${escapeHtml(task.text)}</div>
                <div class="task-popup-meta">
                    <span class="task-popup-chip">${categoryLabels[task.category]}</span>
                    <span class="task-popup-chip">${priorityLabels[task.priority]}</span>
                    ${isOverdue ? '<span class="task-popup-chip" style="background:#ffcccc;">Terlambat</span>' : ''}
                    <span class="task-popup-chip">${formatDateDisplay(task.date)}</span>
                    ${updatedIndicator}
                </div>
            </div>
            <div class="todo-actions">
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
            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = checkbox.dataset.id;
                const task = todos.find(t => t.id === id);
                if (task) {
                    task.completed = !task.completed;
                    saveTodos();
                    renderTasksPopup();
                    renderCalendar();
                    renderTodos();
                }
            });
        });

        document.querySelectorAll('.task-popup-item .delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                const task = todos.find(t => t.id === id);
                if (confirm(`Hapus tugas "${task.text}"?`)) {
                    todos = todos.filter(t => t.id !== id);
                    saveTodos();
                    renderTasksPopup();
                    renderCalendar();
                    renderTodos();
                }
            });
        });
        
        // Edit in tasks popup
        document.querySelectorAll('.task-popup-item .edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                showEditModal(id);
            });
        });
    }

    // Reminder Functions
    function checkUpcomingDeadlines() {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = toISO(tomorrow);
        
        const urgent = todos.filter(task => {
            if (task.completed) return false;
            return task.date === tomorrowStr;
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
    function saveTodos() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
        } catch (error) {
            console.error('Gagal menyimpan data:', error);
            notificationManager.showMessage('Gagal menyimpan data', 'error', 3000);
        }
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function formatDateDisplay(dateStr) {
        try {
            const date = new Date(dateStr + 'T00:00:00');
            return date.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (e) {
            return dateStr;
        }
    }

    // Initialize the application
    initializeApp();

    // Check reminders periodically
    setInterval(updateReminders, 5 * 60 * 1000);

    // Sync across tabs
    window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_KEY) {
            const newTodos = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            if (JSON.stringify(newTodos) !== JSON.stringify(todos)) {
                todos = newTodos;
                renderCalendar();
                renderTodos();
                updateReminders();
                notificationManager.showMessage('Data diperbarui', 'info', 2000);
            }
        }
    });
});