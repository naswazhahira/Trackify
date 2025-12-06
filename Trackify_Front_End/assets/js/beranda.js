document.addEventListener('DOMContentLoaded', function() {
    console.log('Beranda.js dimuat');
   
    // sidebar functionality
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');

    console.log(' Element check:');
    console.log('- Hamburger Button:', hamburgerBtn);
    console.log('- Close Sidebar:', closeSidebar);
    console.log('- Sidebar:', sidebar);
    console.log('- Overlay:', overlay);

    // Buka sidebar
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(' Hamburger diklik');
            sidebar.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    } else {
        console.error(' Hamburger button tidak ditemukan');
    }

    // Tutup sidebar
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log(' Close sidebar diklik');
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Tutup sidebar ketika overlay diklik
    if (overlay) {
        overlay.addEventListener('click', function() {
            console.log(' Overlay diklik');
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Tutup sidebar ketika ESC ditekan
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && sidebar.classList.contains('active')) {
            console.log('ESC ditekan');
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Inisialisasi komponen dashboard
    initializeCalendar();
    initializeTodo();
    initializeProgressChart();

    // Wire backend data
    loadDashboardData();
});

// fungsi kalender mini -- DIPERBAIKI: Load tasks dari backend
function initializeCalendar() {
    const calendarDays = document.querySelector('.calendar-days');
    const monthYear = document.querySelector('.month-year');
    const prevBtn = document.querySelector('.calendar-header .nav-btn:first-child');
    const nextBtn = document.querySelector('.calendar-header .nav-btn:last-child');
    const weekdaysElement = document.querySelector('.calendar-weekdays');

    console.log('📅 Inisialisasi kalender:', {
        calendarDays: !!calendarDays,
        monthYear: !!monthYear,
        prevBtn: !!prevBtn,
        nextBtn: !!nextBtn,
        weekdaysElement: !!weekdaysElement
    });

    // Update nama hari jika element weekdays ditemukan
    if (weekdaysElement) {
        const newWeekdays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const weekdayDivs = weekdaysElement.querySelectorAll('div');
        
        weekdayDivs.forEach((div, index) => {
            if (index < newWeekdays.length) {
                div.textContent = newWeekdays[index];
            }
        });
        console.log('✅ Nama hari diperbarui:', newWeekdays);
    }

    if (!calendarDays || !monthYear || !prevBtn || !nextBtn) {
        console.error('❌ Element kalender tidak ditemukan');
        return;
    }

    let currentDate = new Date();
    let allTasks = []; // Store all tasks for calendar

    // Load tasks dari backend untuk kalender
    async function loadTasksForCalendar() {
        try {
            const response = await fetch(`${API_BASE}/task/get-all-tasks`, {
                headers: authHeaders()
            });
            
            if (response.ok) {
                const data = await response.json();
                allTasks = data.tasks || [];
                console.log(`📋 Loaded ${allTasks.length} tasks for calendar`);
                renderCalendar();
            } else {
                console.error('❌ Gagal load tasks untuk kalender');
                renderCalendar();
            }
        } catch (error) {
            console.error('❌ Error loading tasks:', error);
            renderCalendar();
        }
    }

    // Fungsi untuk cek apakah ada task di tanggal tertentu
    function hasTasksOnDate(year, month, day) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return allTasks.some(task => {
            if (!task.due_date) return false;
            const taskDate = typeof task.due_date === 'string' 
                ? task.due_date.split('T')[0] 
                : new Date(task.due_date).toISOString().split('T')[0];
            return taskDate === dateKey;
        });
    }

    // Merender tampilan kalender
    function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
       
        // Nama-nama bulan dalam setahun
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        monthYear.textContent = `${monthNames[month]} ${year}`;
       
        // Menghitung hari pertama dan jumlah hari dalam bulan
        const firstDay = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
       
        // Dapatkan hari pertama bulan 
        const firstDayOfWeek = firstDay.getDay();
       
        console.log('📅 Info Kalender:', {
            year: year,
            month: month,
            monthName: monthNames[month],
            firstDayOfWeek: firstDayOfWeek,
            daysInMonth: daysInMonth,
            firstDay: firstDay.toString()
        });
       
        // Menghapus isi kalender sebelumnya
        calendarDays.innerHTML = '';
       
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day empty';
            calendarDays.appendChild(emptyDay);
        }
       
        // Menambahkan setiap tanggal ke kalender
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.innerHTML = `<span class="date">${day}</span>`;
           
            // hari ini berwarna ungu
            if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
                dayElement.classList.add('today');
            }
           
            // hari dengan task berwarna hijau
            if (hasTasksOnDate(year, month, day)) {
                dayElement.classList.add('event');
                
                // Tambahkan event badge
                const eventBadge = document.createElement('div');
                eventBadge.className = 'event-badge';
                eventBadge.innerHTML = '📚';
                dayElement.appendChild(eventBadge);
            }
           
            calendarDays.appendChild(dayElement);
        }
    }

    // Tombol navigasi bulan sebelumnya
    prevBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    // Tombol navigasi bulan berikutnya
    nextBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
   
    // Initial load
    loadTasksForCalendar();
    console.log('✅ Kalender berhasil diinisialisasi');
}


// fungsi To-Do - DIPERBAIKI: Load dari backend
async function initializeTodo() {
    console.log('🔄 Inisialisasi To-Do dari backend...');
    // Todo akan di-populate dari loadDashboardData
}

async function renderTodayTasks(tasks) {
    console.log('🎨 renderTodayTasks called with:', tasks);
    
    const todoList = document.getElementById('todoList');
    const noTasks = todoList.querySelector('.no-tasks');
    
    if (!todoList) {
        console.error('❌ Element todoList tidak ditemukan');
        return;
    }

    console.log('📋 Todo list element found');
    console.log('📋 Current children count:', todoList.children.length);

    // Clear existing tasks (kecuali no-tasks message)
    Array.from(todoList.children).forEach(child => {
        if (!child.classList.contains('no-tasks')) {
            console.log('🗑️ Removing child:', child);
            child.remove();
        }
    });

    console.log('📋 After clear, children count:', todoList.children.length);

    if (!tasks || tasks.length === 0) {
        noTasks.style.display = 'block';
        console.log('📝 Tidak ada tugas hari ini - showing no-tasks message');
        return;
    }

    console.log(`📝 Rendering ${tasks.length} tasks...`);
    noTasks.style.display = 'none';

    tasks.forEach((task, index) => {
        console.log(`   Creating task item ${index + 1}:`, task.title);
        
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `todo${index}`;
        checkbox.checked = task.status === 'completed';
        
        const label = document.createElement('label');
        label.setAttribute('for', `todo${index}`);
        label.textContent = task.title;
        
        const timeSpan = document.createElement('span');
        timeSpan.className = 'todo-time';
        timeSpan.textContent = getTimeLabel(task.due_date);
        
        if (checkbox.checked) {
            todoItem.style.opacity = '0.6';
        }
        
        // Event listener untuk update status
        checkbox.addEventListener('change', async function() {
            const newStatus = this.checked ? 'completed' : 'pending';
            console.log(`🔄 Updating task ${task.id} to status: ${newStatus}`);
            
            try {
                const response = await fetch(`${API_BASE}/task/${task.id}`, {
                    method: 'PUT',
                    headers: authHeaders(),
                    body: JSON.stringify({ 
                        title: task.title,
                        description: task.description || '',
                        dueDate: task.due_date ? task.due_date.split('T')[0] : '',
                        priority: task.priority || 'normal',
                        category: task.category || 'kuliah',
                        status: newStatus 
                    })
                });
                
                if (response.ok) {
                    todoItem.style.opacity = this.checked ? '0.6' : '1';
                    console.log(`✅ Task ${task.id} updated to ${newStatus}`);
                    // Reload dashboard data untuk update stats
                    loadDashboardData();
                } else {
                    const errorText = await response.text();
                    console.error('❌ Gagal update task:', response.status, errorText);
                    this.checked = !this.checked; // Revert checkbox
                }
            } catch (error) {
                console.error('❌ Error updating task:', error);
                this.checked = !this.checked; // Revert checkbox
            }
        });
        
        todoItem.appendChild(checkbox);
        todoItem.appendChild(label);
        todoItem.appendChild(timeSpan);
        todoList.insertBefore(todoItem, noTasks);
        
        console.log(`   ✅ Task item ${index + 1} added to DOM`);
    });

    console.log(`✅ Rendered ${tasks.length} tasks successfully`);
    console.log('📋 Final children count:', todoList.children.length);
}

function getTimeLabel(dueDate) {
    if (!dueDate) return '';
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hari ini';
    if (diffDays === 1) return 'Besok';
    if (diffDays > 1) return `${diffDays} hari`;
    if (diffDays === -1) return 'Kemarin';
    if (diffDays < -1) return `${Math.abs(diffDays)} hari lalu`;
    return '';
}

// Render jadwal yang akan datang dari tasks
async function renderUpcomingSchedule(allTasks) {
    console.log('📅 renderUpcomingSchedule called with:', allTasks);
    
    const scheduleList = document.getElementById('scheduleList');
    const noSchedule = scheduleList?.querySelector('.no-schedule');
    
    if (!scheduleList) {
        console.error('❌ Element scheduleList tidak ditemukan');
        return;
    }

    console.log('📅 Schedule list element found');

    // Clear existing schedule items (kecuali no-schedule message)
    Array.from(scheduleList.children).forEach(child => {
        if (!child.classList.contains('no-schedule')) {
            child.remove();
        }
    });

    if (!allTasks || allTasks.length === 0) {
        if (noSchedule) noSchedule.style.display = 'block';
        console.log('📅 Tidak ada jadwal');
        return;
    }

    // Filter tasks: today and upcoming (not completed, not past due)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const upcomingTasks = allTasks.filter(task => {
        if (!task.due_date) return false;
        
        const dueDate = new Date(task.due_date);
        dueDate.setHours(0, 0, 0, 0);
        
        // Include today and future tasks that are not completed
        return dueDate >= today && task.status !== 'completed';
    });

    console.log(`📅 Found ${upcomingTasks.length} upcoming tasks (from ${allTasks.length} total)`);

    if (upcomingTasks.length === 0) {
        if (noSchedule) noSchedule.style.display = 'block';
        console.log('📅 Tidak ada jadwal yang akan datang');
        return;
    }

    if (noSchedule) noSchedule.style.display = 'none';

    // Sort by date (nearest first), then by priority
    const sortedTasks = [...upcomingTasks].sort((a, b) => {
        // First sort by date
        const dateA = new Date(a.due_date);
        const dateB = new Date(b.due_date);
        const dateDiff = dateA - dateB;
        if (dateDiff !== 0) return dateDiff;
        
        // Then by priority
        const priorityOrder = { high: 0, normal: 1, low: 2 };
        return (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
    });

    // Limit to 5 upcoming tasks
    const displayTasks = sortedTasks.slice(0, 5);
    
    console.log(`📅 Displaying ${displayTasks.length} upcoming tasks...`);

    displayTasks.forEach((task, index) => {
        console.log(`   Creating schedule item ${index + 1}:`, task.title, task.due_date);
        
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        
        // Get date display
        const dateDisplay = getScheduleDateDisplay(task.due_date);
        
        // Get priority badge color
        const priorityColor = getPriorityColor(task.priority);
        
        scheduleItem.innerHTML = `
            <div class="schedule-time">
                <span class="time">${dateDisplay.day}</span>
                <span class="duration">${dateDisplay.date}</span>
            </div>
            <div class="schedule-content">
                <h4 class="schedule-title">${task.title}</h4>
                <p class="schedule-category">
                    <span class="category-badge" style="background-color: ${priorityColor}">
                        ${task.category || 'Kuliah'}
                    </span>
                    ${task.priority === 'high' ? '<span class="priority-high">⚠️ Prioritas Tinggi</span>' : ''}
                    ${dateDisplay.urgent ? '<span class="priority-high">🔥 Mendesak</span>' : ''}
                </p>
            </div>
            <div class="schedule-status">
                ${getStatusIcon(task.status)}
            </div>
        `;
        
        scheduleList.insertBefore(scheduleItem, noSchedule);
        
        console.log(`   ✅ Schedule item ${index + 1} added to DOM`);
    });

    console.log(`✅ Rendered ${displayTasks.length} schedule items successfully`);
}

// Helper function to get schedule date display
function getScheduleDateDisplay(dueDate) {
    if (!dueDate) return { day: '—', date: '—', urgent: false };
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Day names in Indonesian
    const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const dayName = dayNames[due.getDay()];
    
    // Format date
    const day = String(due.getDate()).padStart(2, '0');
    const month = String(due.getMonth() + 1).padStart(2, '0');
    const dateStr = `${day}/${month}`;
    
    let dayDisplay = '';
    let urgent = false;
    
    if (diffDays === 0) {
        dayDisplay = 'Hari ini';
        urgent = true;
    } else if (diffDays === 1) {
        dayDisplay = 'Besok';
        urgent = true;
    } else if (diffDays <= 3) {
        dayDisplay = dayName;
        urgent = true;
    } else if (diffDays <= 7) {
        dayDisplay = dayName;
    } else {
        dayDisplay = dateStr;
    }
    
    return { 
        day: dayDisplay, 
        date: dateStr,
        urgent: urgent 
    };
}

// Helper function to get status icon
function getStatusIcon(status) {
    switch(status) {
        case 'completed':
            return '<i class="fas fa-check-circle" style="color: #10b981;"></i>';
        case 'in-progress':
            return '<i class="fas fa-spinner" style="color: #3b82f6;"></i>';
        case 'pending':
        case 'todo':
        default:
            return '<i class="fas fa-circle" style="color: #f59e0b;"></i>';
    }
}

// Helper function to get schedule time based on index and priority (deprecated - kept for compatibility)
function getScheduleTime(index, priority) {
    // Generate time slots throughout the day
    const baseHour = 8; // Start at 8 AM
    const interval = 2; // 2 hours apart
    
    let hour = baseHour + (index * interval);
    let minute = 0;
    
    // Adjust for priority
    if (priority === 'high') {
        // High priority gets earlier slots
        hour = Math.max(8, hour - 1);
    } else if (priority === 'low') {
        // Low priority gets later slots
        hour = hour + 1;
    }
    
    // Keep within reasonable hours (8 AM - 8 PM)
    hour = Math.min(20, Math.max(8, hour));
    
    // Format time
    const hourStr = String(hour).padStart(2, '0');
    const minuteStr = String(minute).padStart(2, '0');
    
    return `${hourStr}:${minuteStr}`;
}

// Helper function to get priority color
function getPriorityColor(priority) {
    switch(priority) {
        case 'high': return '#ef4444';
        case 'normal': return '#3b82f6';
        case 'low': return '#10b981';
        default: return '#6b7280';
    }
}

// Animasi efek grafik
function initializeProgressChart() {
    const chartBars = document.querySelectorAll('.chart-bar .bar-fill');
   
    console.log(' Inisialisasi progress chart:', {
        chartBars: chartBars.length
    });

    if (!chartBars.length) {
        console.error(' Element chart tidak ditemukan');
        return;
    }

    // Reset height untuk animasi
    chartBars.forEach(bar => {
        const originalHeight = bar.style.height;
        bar.style.height = '0%';
       
        // Animasikan setelah delay
        setTimeout(() => {
            bar.style.height = originalHeight;
        }, 500);
    });

    // Tambahkan event listener untuk hover effect
    const bars = document.querySelectorAll('.chart-bar');
    bars.forEach(bar => {
        bar.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
       
        bar.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    console.log(' Progress chart berhasil diinisialisasi');
}

// smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// fitur tambahan
// Auto-update waktu real-time untuk todo items
function updateTodoTimes() {
    const todoTimes = document.querySelectorAll('.todo-time');
    const now = new Date();
   
    todoTimes.forEach(timeElement => {
        const text = timeElement.textContent.toLowerCase();
        if (text === 'hari ini') {
            // Tetap "Hari ini"
        } else if (text === 'besok') {
            // Tetap "Besok"
        } else if (text.includes('hari')) {
            // Update countdown
            const days = parseInt(text);
            if (!isNaN(days)) {
                if (days === 1) {
                    timeElement.textContent = 'Besok';
                } else if (days === 0) {
                    timeElement.textContent = 'Hari ini';
                } else {
                    timeElement.textContent = `${days} hari`;
                }
            }
        }
    });
}

// Panggil setiap jam
setInterval(updateTodoTimes, 3600000);

// ================= Backend Wiring =================
const API_BASE = 'http://localhost:3000/api';

function authHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };
}

async function loadDashboardData() {
    try {
        console.log('🔄 Loading dashboard data from backend...');
        console.log('📍 API Base:', API_BASE);
        console.log('🔑 Token:', localStorage.getItem('token') ? 'Ada' : 'Tidak ada');
        
        // Load study sessions
        let todaySeconds = { total_seconds: 0 };
        try {
            const studyResponse = await fetch(`${API_BASE}/study-sessions/get-today-time`, { headers: authHeaders() });
            console.log('📡 Study sessions response:', studyResponse.status);
            if (studyResponse.ok) {
                todaySeconds = await studyResponse.json();
            }
        } catch (e) {
            console.warn('⚠️ Failed to load study sessions:', e.message);
        }

        // Load weekly summaries
        let weeklySummaries = { summaries: [] };
        try {
            const summaryResponse = await fetch(`${API_BASE}/daily-summaries/get-weekly`, { headers: authHeaders() });
            console.log('📡 Weekly summaries response:', summaryResponse.status);
            if (summaryResponse.ok) {
                weeklySummaries = await summaryResponse.json();
            }
        } catch (e) {
            console.warn('⚠️ Failed to load weekly summaries:', e.message);
        }

        // Load today's tasks - CRITICAL
        let todayTasks = { tasks: [] };
        try {
            const taskResponse = await fetch(`${API_BASE}/task/get-tasks-today`, { headers: authHeaders() });
            console.log('📡 Tasks response status:', taskResponse.status);
            
            if (taskResponse.ok) {
                todayTasks = await taskResponse.json();
                console.log('✅ Tasks response data:', todayTasks);
                console.log('📋 Tasks array:', todayTasks.tasks);
                console.log('📊 Number of tasks:', todayTasks.tasks?.length || 0);
                
                // Log each task
                if (todayTasks.tasks && todayTasks.tasks.length > 0) {
                    todayTasks.tasks.forEach((task, i) => {
                        console.log(`   Task ${i + 1}:`, {
                            id: task.id,
                            title: task.title,
                            due_date: task.due_date,
                            status: task.status,
                            priority: task.priority
                        });
                    });
                } else {
                    console.warn('⚠️ No tasks found for today');
                }
            } else {
                const errorText = await taskResponse.text();
                console.error('❌ Failed to load tasks:', taskResponse.status, errorText);
            }
        } catch (e) {
            console.error('❌ Error loading tasks:', e);
        }

        // Load ALL tasks for schedule (upcoming tasks)
        let allTasks = { tasks: [] };
        try {
            const allTasksResponse = await fetch(`${API_BASE}/task/get-all-tasks`, { headers: authHeaders() });
            console.log('📡 All tasks response status:', allTasksResponse.status);
            
            if (allTasksResponse.ok) {
                allTasks = await allTasksResponse.json();
                console.log('✅ All tasks loaded:', allTasks.tasks?.length || 0);
            }
        } catch (e) {
            console.error('❌ Error loading all tasks:', e);
        }

        console.log('📊 Final data loaded:', {
            todaySeconds: todaySeconds.total_seconds || 0,
            weeklySummaries: weeklySummaries.summaries?.length || 0,
            todayTasks: todayTasks.tasks?.length || 0,
            allTasks: allTasks.tasks?.length || 0
        });

        renderTodayStudyTime(todaySeconds.total_seconds || 0);
        renderWeeklyProgress(weeklySummaries.summaries || []);
        await renderTodayTasks(todayTasks.tasks || []);
        await renderUpcomingSchedule(allTasks.tasks || []); // Show upcoming tasks
        updateTaskStats(todayTasks.tasks || []);
        
        console.log('✅ Dashboard data loaded successfully');
    } catch (e) {
        console.error('❌ Gagal memuat data beranda:', e);
    }
}

function renderTodayStudyTime(totalSeconds) {
    const el = document.querySelector('#todayStudyTime');
    if (!el) return;
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    el.textContent = `${hrs}j ${mins}m`;
}

function renderWeeklyProgress(summaries) {
    // Expect summaries: [{summary_date: 'YYYY-MM-DD', total_study_time_seconds, goals_completed}]
    const chartContainer = document.getElementById('weeklyProgressChart');
    if (!chartContainer) {
        console.error('❌ Element weeklyProgressChart tidak ditemukan');
        return;
    }

    // Map last 7 days
    const today = new Date();
    const dayLabels = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const weeklyData = [];
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateKey = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
        const dayIndex = d.getDay();
        
        weeklyData.push({
            dateKey,
            label: dayLabels[dayIndex],
            seconds: 0,
            date: d
        });
    }
    
    // Map summaries ke weeklyData
    summaries.forEach(summary => {
        let summaryDate = summary.summary_date;
        if (typeof summaryDate === 'string') {
            summaryDate = summaryDate.split('T')[0];
        } else if (summaryDate instanceof Date) {
            summaryDate = summaryDate.toISOString().split('T')[0];
        }
        
        const dataPoint = weeklyData.find(d => d.dateKey === summaryDate);
        if (dataPoint) {
            dataPoint.seconds = summary.total_study_time_seconds || 0;
        }
    });
    
    const maxSeconds = Math.max(...weeklyData.map(d => d.seconds), 3600); // Min 1 hour for scaling
    
    // Clear chart
    chartContainer.innerHTML = '';
    
    // Create bars
    weeklyData.forEach((data, idx) => {
        const pct = Math.min(100, Math.round((data.seconds / maxSeconds) * 100));
        const hours = Math.floor(data.seconds / 3600);
        const mins = Math.floor((data.seconds % 3600) / 60);
        const timeLabel = hours > 0 ? `${hours}j ${mins}m` : `${mins}m`;
        
        const chartBar = document.createElement('div');
        chartBar.className = 'chart-bar';
        
        chartBar.innerHTML = `
            <div class="bar-container">
                <div class="bar-fill" style="height: ${pct}%;"></div>
            </div>
            <span class="bar-label">${data.label}</span>
            <span class="bar-value">${timeLabel}</span>
        `;
        
        chartContainer.appendChild(chartBar);
    });
    
    console.log(`✅ Rendered weekly progress chart with ${weeklyData.length} days`);
}

function updateTaskStats(tasks) {
    const completedEl = document.getElementById('completedTasks');
    const pendingEl = document.getElementById('pendingTasks');
    
    if (!completedEl || !pendingEl) {
        console.error('❌ Element task stats tidak ditemukan');
        return;
    }
    
    const completed = tasks.filter(t => t.status === 'completed').length;
    const pending = tasks.filter(t => t.status === 'pending' || t.status === 'in-progress').length;
    
    completedEl.textContent = completed;
    pendingEl.textContent = pending;
    
    console.log(`📊 Task stats updated: ${completed} completed, ${pending} pending`);
}
