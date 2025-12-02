document.addEventListener('DOMContentLoaded', function() {
    // Konstanta API
    const API_BASE = 'http://localhost:5000/api';
    const API_GOALS = `${API_BASE}/goals`;
    const API_STUDY_SESSIONS = `${API_BASE}/study-sessions`;
    const API_DAILY_SUMMARIES = `${API_BASE}/daily-summaries`; // ✅ TAMBAH INI

    // Sidebar elements
    const hamburgerIcon = document.getElementById('hamburgerIcon');
    const closeSidebar = document.getElementById('closeSidebar');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    console.log('🔍 Sidebar Elements:', {
        hamburgerIcon: !!hamburgerIcon,
        closeSidebar: !!closeSidebar,
        sidebar: !!sidebar,
        sidebarOverlay: !!sidebarOverlay
    });

    // Buka sidebar
    if (hamburgerIcon) {
        hamburgerIcon.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('🍔 Hamburger icon diklik');
            sidebar.classList.add('active');
            if (sidebarOverlay) {
                sidebarOverlay.classList.add('active');
            }
            document.body.style.overflow = 'hidden';
        });
    } else {
        console.error('❌ Hamburger icon tidak ditemukan');
    }

    // Tutup sidebar
    if (closeSidebar) {
        closeSidebar.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('❌ Close sidebar diklik');
            sidebar.classList.remove('active');
            if (sidebarOverlay) {
                sidebarOverlay.classList.remove('active');
            }
            document.body.style.overflow = '';
        });
    }

    // Tutup sidebar ketika overlay diklik
    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', function() {
            console.log('🎯 Overlay sidebar diklik');
            sidebar.classList.remove('active');
            sidebarOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Tutup sidebar ketika ESC ditekan
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && sidebar.classList.contains('active')) {
            console.log('ESC ditekan - tutup sidebar');
            sidebar.classList.remove('active');
            if (sidebarOverlay) {
                sidebarOverlay.classList.remove('active');
            }
            document.body.style.overflow = '';
        }
    });

    // Elements
    const addGoalBtn = document.querySelector('.add-goal');
    const overlay = document.getElementById('overlay');
    const modal = document.getElementById('addGoalModal');
    const closeModal = document.getElementById('closeModal');
    const saveGoal = document.getElementById('saveGoal');
    const goalsContainer = document.getElementById('goalsContainer');
    const timerModal = document.getElementById('timerModal');
    const activeTimer = document.getElementById('activeTimer');
    const activeGoalName = document.getElementById('activeGoalName');
    const activeGoalTime = document.getElementById('activeGoalTime');
    const startTimer = document.getElementById('startTimer');
    const stopTimer = document.getElementById('stopTimer');
    const currentDateEl = document.getElementById('currentDate');
    const prevDate = document.getElementById('prevDate');
    const nextDate = document.getElementById('nextDate');
    const totalTimer = document.querySelector('.total-timer');
    const closeTimerModal = document.getElementById('closeTimerModal');
    const confirmModal = document.getElementById('confirmModal');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');
    const confirmMessage = document.getElementById('confirmMessage');

    // State
    let currentDate = new Date();
    let activeGoal = null;
    let timerInterval = null;
    let timerSeconds = 0;
    let isTimerRunning = false;
    let goals = [];
    let goalProgress = JSON.parse(localStorage.getItem('goalProgress')) || {};
    let dailyTotalTime = JSON.parse(localStorage.getItem('dailyTotalTime')) || {};
    let goalToDelete = null;
    let currentStudySession = null; // Untuk track session aktif

    // Inisialisasi
    init();

    async function init() {
        await loadGoalsFromAPI();
        await checkActiveStudySession(); // Cek session aktif
        updateDateDisplay();
        renderGoals();
        updateTotalTimer();
        setDefaultDateInput();
        generateWeeklyChart();
    }

    // ==================== FUNGSI API ====================

    // Helper function untuk headers dengan auth
    function getAuthHeaders() {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    // Load goals dari backend
    async function loadGoalsFromAPI() {
        try {
            const response = await fetch(`${API_GOALS}/get-goals`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Gagal mengambil goals dari server');
            }

            const data = await response.json();
            goals = data.goals || [];
            console.log('Goals loaded from API:', goals);
        } catch (error) {
            console.error('Error loading goals:', error);
            showError('Gagal memuat goals dari server');
            goals = [];
        }
    }

    // Create goal baru ke backend
    async function createGoalAPI(goalData) {
        try {
            const response = await fetch(`${API_GOALS}/create-goal`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(goalData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal membuat goal');
            }

            const data = await response.json();
            return data.goal;
        } catch (error) {
            console.error('Error creating goal:', error);
            throw error;
        }
    }

    // Delete goal dari backend
    async function deleteGoalAPI(goalId) {
        try {
            const response = await fetch(`${API_GOALS}/delete-goal/${goalId}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Gagal menghapus goal');
            }

            const data = await response.json();
            return data.goal;
        } catch (error) {
            console.error('Error deleting goal:', error);
            throw error;
        }
    }

    // Update status goal
    async function updateGoalStatusAPI(goalId, status) {
        try {
            const response = await fetch(`${API_GOALS}/update-goal-status/${goalId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({ status })
            });

            if (!response.ok) {
                throw new Error('Gagal mengupdate status goal');
            }

            const data = await response.json();
            return data.goal;
        } catch (error) {
            console.error('Error updating goal status:', error);
            throw error;
        }
    }

    // ==================== STUDY SESSIONS API ====================

    // Buat study session baru
    async function createStudySessionAPI(goalId) {
        try {
            const startTime = new Date().toISOString();
            const response = await fetch(`${API_STUDY_SESSIONS}/create-session`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    goalId: goalId,
                    startTime: startTime
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal membuat study session');
            }

            const data = await response.json();
            console.log('Study session created:', data.session);
            return data.session;
        } catch (error) {
            console.error('Error creating study session:', error);
            throw error;
        }
    }

    // Complete study session
    async function completeStudySessionAPI(sessionId) {
        try {
            const endTime = new Date().toISOString();
            const response = await fetch(`${API_STUDY_SESSIONS}/complete-session/${sessionId}`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    endTime: endTime
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Gagal menyelesaikan study session');
            }

            const data = await response.json();
            console.log('Study session completed:', data.session);
            return data.session;
        } catch (error) {
            console.error('Error completing study session:', error);
            throw error;
        }
    }

    // Cek active study session
    async function checkActiveStudySession() {
        try {
            const response = await fetch(`${API_STUDY_SESSIONS}/get-active-session`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (response.status === 404) {
                // Tidak ada session aktif
                currentStudySession = null;
                return null;
            }

            if (!response.ok) {
                throw new Error('Gagal memeriksa session aktif');
            }

            const data = await response.json();
            currentStudySession = data.session;
            console.log('Active session found:', currentStudySession);
            
            // Jika ada session aktif, tampilkan warning
            if (currentStudySession) {
                showSessionWarning();
            }
            
            return currentStudySession;
        } catch (error) {
            console.error('Error checking active session:', error);
            return null;
        }
    }

    // Dapatkan today's study time
    async function getTodayStudyTimeAPI() {
        try {
            const response = await fetch(`${API_STUDY_SESSIONS}/get-today-time`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (!response.ok) {
                throw new Error('Gagal mengambil today study time');
            }

            const data = await response.json();
            return data.total_seconds || 0;
        } catch (error) {
            console.error('Error getting today study time:', error);
            return 0;
        }
    }

    // ==================== DAILY SUMMARIES API ====================

    // ✅ FUNGSI BARU: Update daily summary dengan total study time
    async function updateDailySummaryStudyTime() {
        try {
            const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
            const totalSeconds = await calculateTodaysTotalTime(); // Hitung total waktu hari ini
            
            const response = await fetch(`${API_DAILY_SUMMARIES}/update-study-time`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    summary_date: today,
                    total_study_time_seconds: totalSeconds
                })
            });
            
            if (!response.ok) throw new Error('Gagal update daily summary study time');
            console.log('✅ Daily summary study time updated:', totalSeconds);
        } catch (error) {
            console.error('Error updating daily summary study time:', error);
        }
    }

    // ✅ FUNGSI BARU: Update daily summary dengan goals completed
    async function updateDailySummaryGoalsCompleted() {
        try {
            const today = new Date().toISOString().split('T')[0];
            const completedGoals = goals.filter(goal => {
                const goalDate = formatDateForCompare(new Date(goal.target_date));
                return goalDate === today && goal.status === 'completed';
            }).length;
            
            const response = await fetch(`${API_DAILY_SUMMARIES}/update-goals-completed`, {
                method: 'PUT',
                headers: getAuthHeaders(),
                body: JSON.stringify({
                    summary_date: today,
                    goals_completed: completedGoals
                })
            });
            
            if (!response.ok) throw new Error('Gagal update daily summary goals completed');
            console.log('✅ Daily summary goals completed updated:', completedGoals);
        } catch (error) {
            console.error('Error updating daily summary goals completed:', error);
        }
    }

    // ✅ FUNGSI BARU: Dapatkan weekly data dari daily summaries
    async function getWeeklyDataFromSummaries() {
        try {
            const response = await fetch(`${API_DAILY_SUMMARIES}/get-weekly`, {
                method: 'GET',
                headers: getAuthHeaders()
            });
            
            if (response.ok) {
                const data = await response.json();
                return transformWeeklyData(data.summaries);
            } else {
                throw new Error('Gagal mengambil weekly data');
            }
        } catch (error) {
            console.error('Error loading weekly data from summaries:', error);
            return null;
        }
    }

    // ==================== FUNGSI HELPER ====================

    // Show error message
    function showError(message) {
        alert(`Error: ${message}`);
    }

    // Show session warning
    function showSessionWarning() {
        if (currentStudySession) {
            const confirmed = confirm(
                `⚠️ Ada study session yang masih aktif!\n\n` +
                `Goal: ${currentStudySession.goal_title || 'Tidak ada goal'}\n` +
                `Mulai: ${new Date(currentStudySession.start_time).toLocaleTimeString()}\n\n` +
                `Lanjutkan session ini? Klik OK untuk lanjutkan, Cancel untuk mulai baru.`
            );
            
            if (confirmed) {
                // Lanjutkan session yang ada
                const goal = goals.find(g => g.id === currentStudySession.goal_id);
                if (goal) {
                    openTimerModal(goal, true);
                }
            } else {
                // User memilih mulai baru, complete session yang lama
                completeStudySessionAPI(currentStudySession.id)
                    .then(() => {
                        currentStudySession = null;
                        console.log('Old session completed');
                    })
                    .catch(err => console.error('Error completing old session:', err));
            }
        }
    }

    // Set default date input ke hari ini
    function setDefaultDateInput() {
        const today = new Date();
        const formattedDate = formatDateForInput(today);
        document.getElementById('selectPeriod').value = formattedDate;
    }

    // Format tanggal untuk input (YYYY-MM-DD)
    function formatDateForInput(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Format tanggal untuk komparasi (YYYY-MM-DD)
    function formatDateForCompare(date) {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Navigasi tanggal
    function updateDateDisplay() {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        currentDateEl.textContent = currentDate.toLocaleDateString('id-ID', options);
        renderGoals();
        updateTotalTimer();
        generateWeeklyChart();
    }

    prevDate.addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() - 1);
        updateDateDisplay();
    });

    nextDate.addEventListener('click', function() {
        currentDate.setDate(currentDate.getDate() + 1);
        updateDateDisplay();
    });

    // Format functions
    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    }

    function timeToSeconds(timeString) {
        const parts = timeString.split(':');
        let hours = 0, minutes = 0, seconds = 0;
        
        if (parts.length >= 1) hours = parseInt(parts[0]) || 0;
        if (parts.length >= 2) minutes = parseInt(parts[1]) || 0;
        if (parts.length >= 3) seconds = parseInt(parts[2]) || 0;
        
        return hours * 3600 + minutes * 60 + seconds;
    }

    function getDateKey(date = new Date()) {
        return formatDateForCompare(date);
    }

    // Hitung total waktu untuk tanggal saat ini - DIPERBAIKI: Hitung berdasarkan waktu aktual
    function calculateDailyTotalTime() {
        const dateKey = getDateKey(currentDate);
        let total = 0;
        
        // Jumlahkan progress aktual dari semua goals
        goals.forEach(goal => {
            const goalDate = formatDateForCompare(new Date(goal.target_date));
            if (goalDate === dateKey) {
                const goalKey = `${goal.id}_${dateKey}`;
                total += goalProgress[goalKey] || 0;
            }
        });
        
        dailyTotalTime[dateKey] = total;
        localStorage.setItem('dailyTotalTime', JSON.stringify(dailyTotalTime));
        return total;
    }

    // ✅ FUNGSI BARU: Hitung total waktu hari ini untuk daily summary
    async function calculateTodaysTotalTime() {
        const today = new Date();
        const dateKey = getDateKey(today);
        let totalSeconds = 0;
        
        goals.forEach(goal => {
            const goalDate = formatDateForCompare(new Date(goal.target_date));
            if (goalDate === dateKey) {
                const goalKey = `${goal.id}_${dateKey}`;
                totalSeconds += goalProgress[goalKey] || 0;
            }
        });
        
        return totalSeconds;
    }

    // ==================== RENDER GOALS ====================

    function renderGoals() {
        const dateKey = getDateKey(currentDate);
        goalsContainer.innerHTML = '';
        
        // Filter goals untuk tanggal yang dipilih
        const todayGoals = goals.filter(goal => {
            const goalDate = formatDateForCompare(new Date(goal.target_date));
            return goalDate === dateKey && goal.status !== 'deleted';
        });

        if (todayGoals.length === 0) {
            goalsContainer.innerHTML = '<div class="no-goals">Tidak ada target untuk tanggal ini</div>';
            return;
        }

        todayGoals.forEach((goal, index) => {
            const goalItem = document.createElement('div');
            goalItem.className = 'goal-item';
            
            const goalKey = `${goal.id}_${dateKey}`;
            const progress = goalProgress[goalKey] || 0;
            const targetSeconds = timeToSeconds(goal.daily_target_time);
            const progressPercent = Math.min((progress / targetSeconds) * 100, 100);
            const isTargetAchieved = progress >= targetSeconds && targetSeconds > 0;
            
            if (isTargetAchieved) {
                goalItem.classList.add('target-achieved');
            }
            
            goalItem.innerHTML = `
                <div class="goal-content">
                    <div class="goal-info">
                        <div class="goal-name">${goal.title}</div>
                        <div class="goal-status">Status: ${goal.status}</div>
                        <div class="goal-progress-container">
                            <div class="goal-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                                </div>
                                <div class="progress-text">
                                    <span class="progress-current">${formatTime(progress)}</span>
                                    <span class="progress-target">Target: ${goal.daily_target_time}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="delete-goal" data-goal-id="${goal.id}">
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
            `;
            
            goalItem.addEventListener('click', (e) => {
                if (!e.target.closest('.delete-goal')) {
                    openTimerModal(goal);
                }
            });
            
            const deleteBtn = goalItem.querySelector('.delete-goal');
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showDeleteConfirmation(goal);
            });
            
            goalsContainer.appendChild(goalItem);
        });
    }

    // ==================== GOAL OPERATIONS ====================

    // Function hapus target
    async function showDeleteConfirmation(goal) {
        goalToDelete = goal;
        confirmMessage.textContent = `Apakah Anda yakin ingin menghapus target "${goal.title}"?`;
        confirmModal.style.display = 'block';
        overlay.style.display = 'block';
    }

    async function deleteGoal() {
        if (goalToDelete) {
            try {
                await deleteGoalAPI(goalToDelete.id);
                
                // Update local state
                goals = goals.filter(goal => goal.id !== goalToDelete.id);
                
                // Hapus progress dari localStorage
                const dateKey = getDateKey(currentDate);
                const goalKey = `${goalToDelete.id}_${dateKey}`;
                delete goalProgress[goalKey];
                localStorage.setItem('goalProgress', JSON.stringify(goalProgress));
                
                renderGoals();
                updateTotalTimer();
                generateWeeklyChart();
                
                // ✅ UPDATE DAILY SUMMARY SETELAH HAPUS GOAL
                await updateDailySummaryStudyTime();
                await updateDailySummaryGoalsCompleted();
                
                closeConfirmModal();
            } catch (error) {
                showError(error.message);
                closeConfirmModal();
            }
        }
    }

    function closeConfirmModal() {
        confirmModal.style.display = 'none';
        overlay.style.display = 'none';
        goalToDelete = null;
    }

    confirmYes.addEventListener('click', deleteGoal);
    confirmNo.addEventListener('click', closeConfirmModal);

    // ==================== TIMER FUNCTIONS DENGAN STUDY SESSIONS ====================

    async function openTimerModal(goal, continueSession = false) {
        activeGoal = goal;
        activeGoalName.textContent = goal.title;
        activeGoalTime.textContent = goal.daily_target_time;
        
        const dateKey = getDateKey(currentDate);
        const goalKey = `${goal.id}_${dateKey}`;
        timerSeconds = goalProgress[goalKey] || 0;
        activeTimer.textContent = formatTime(timerSeconds);
        
        startTimer.disabled = false;
        stopTimer.disabled = true;
        isTimerRunning = false;
        
        // Jika continue session, langsung start timer
        if (continueSession && currentStudySession) {
            startTimer.click(); // Auto start timer
        }
        
        timerModal.style.display = 'block';
        overlay.style.display = 'block';
        updateTimerStatus();
        checkTargetReached();
    }

    // Function waktu - DIPERBARUI dengan study sessions
    startTimer.addEventListener('click', async function() {
        if (!isTimerRunning) {
            try {
                // Buat study session baru
                if (!currentStudySession) {
                    currentStudySession = await createStudySessionAPI(activeGoal.id);
                    console.log('New study session started:', currentStudySession);
                }
                
                isTimerRunning = true;
                startTimer.disabled = true;
                stopTimer.disabled = false;
                
                timerInterval = setInterval(function() {
                    timerSeconds++;
                    activeTimer.textContent = formatTime(timerSeconds);
                    checkTargetReached();
                }, 1000);
                
                updateTimerStatus();
                
            } catch (error) {
                console.error('Error starting study session:', error);
                showError('Gagal memulai study session: ' + error.message);
            }
        }
    });

    stopTimer.addEventListener('click', async function() {
        if (isTimerRunning) {
            try {
                console.log('🛑 Stopping timer...');
                console.log('Current study session:', currentStudySession);
                
                isTimerRunning = false;
                startTimer.disabled = false;
                stopTimer.disabled = true;
                
                clearInterval(timerInterval);
                
                // Complete study session
                if (currentStudySession) {
                    console.log('Completing study session with ID:', currentStudySession.id);
                    await completeStudySessionAPI(currentStudySession.id);
                    console.log('Study session completed successfully');
                    currentStudySession = null;
                } else {
                    console.log('❌ No active study session found!');
                }
                
                saveGoalProgress();
                updateTimerStatus();
                
                // ✅ UPDATE DAILY SUMMARY SETELAH TIMER BERHENTI
                await updateDailySummaryStudyTime();
                
            } catch (error) {
                console.error('❌ Error stopping timer:', error);
                console.error('Error details:', error.message);
                showError('Gagal menyelesaikan study session: ' + error.message);
            }
        }
    });

    // Simpan progress target
    function saveGoalProgress() {
        if (activeGoal) {
            const dateKey = getDateKey(currentDate);
            const goalKey = `${activeGoal.id}_${dateKey}`;
            goalProgress[goalKey] = timerSeconds;
            localStorage.setItem('goalProgress', JSON.stringify(goalProgress));
            renderGoals();
            updateTotalTimer();
            generateWeeklyChart();

            // Auto update status ke completed jika target tercapai
            const targetSeconds = timeToSeconds(activeGoal.daily_target_time);
            if (timerSeconds >= targetSeconds && activeGoal.status === 'active') {
                updateGoalStatusAPI(activeGoal.id, 'completed')
                    .then(updatedGoal => {
                        // Update local state
                        const index = goals.findIndex(g => g.id === activeGoal.id);
                        if (index !== -1) {
                            goals[index] = updatedGoal;
                        }
                        
                        // ✅ UPDATE DAILY SUMMARY SETELAH GOAL COMPLETED
                        updateDailySummaryGoalsCompleted();
                    })
                    .catch(error => console.error('Error updating status:', error));
            }
        }
    }

    // Mengecek jika target tercapai
    function checkTargetReached() {
        if (activeGoal) {
            const targetSeconds = timeToSeconds(activeGoal.daily_target_time);
            if (timerSeconds >= targetSeconds) {
                if (timerSeconds === targetSeconds) {
                    showTargetReachedNotification();
                }
                activeTimer.style.color = '#4CAF50';
                activeTimer.style.fontWeight = 'bold';
            } else {
                activeTimer.style.color = '#333';
                activeTimer.style.fontWeight = 'normal';
            }
        }
    }

    function showTargetReachedNotification() {
        const overlay = document.createElement('div');
        overlay.className = 'notification-overlay active';
        
        const notification = document.createElement('div');
        notification.className = 'target-notification';
        notification.innerHTML = `
            <button class="close-notification">&times;</button>
            <div class="notification-content">
                <span class="notification-icon">🎉</span>
                <div class="notification-text">
                    <strong>Target Tercapai!</strong>
                    <p>Selamat! Anda telah mencapai target waktu belajar untuk "${activeGoal.title}"</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(notification);
        
        function closeNotification() {
            notification.style.animation = 'slideInDown 0.5s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300);
        }
        
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', closeNotification);
        
        overlay.addEventListener('click', closeNotification);
    }

    // Function status waktu
    function updateTimerStatus() {
        const timerStatus = document.getElementById('timerStatus');
        if (isTimerRunning) {
            timerStatus.innerHTML = `Timer sedang berjalan - Study session aktif`;
            timerStatus.style.color = "#ff6b6b";
        } else {
            timerStatus.innerHTML = `Timer dihentikan - Study session selesai`;
            timerStatus.style.color = "#4CAF50";
        }
    }

    // Manajemen total waktu - DIPERBAIKI: Hitung berdasarkan waktu aktual yang dihabiskan
    async function updateTotalTimer() {
        try {
            // HITUNG BERDASARKAN WAKTU AKTUAL YANG DIHABISKAN
            const dateKey = getDateKey(currentDate);
            let totalSeconds = 0;
            
            // Jumlahkan progress aktual dari semua goals untuk tanggal ini
            goals.forEach(goal => {
                const goalDate = formatDateForCompare(new Date(goal.target_date));
                if (goalDate === dateKey) {
                    const goalKey = `${goal.id}_${dateKey}`;
                    totalSeconds += goalProgress[goalKey] || 0;
                }
            });
            
            totalTimer.textContent = formatTime(totalSeconds);
            
        } catch (error) {
            console.error('Error updating total timer:', error);
            // Fallback ke localStorage data
            const totalSeconds = calculateDailyTotalTime();
            totalTimer.textContent = formatTime(totalSeconds);
        }
    }

    // ==================== MODAL MANAGEMENT ====================

    addGoalBtn.addEventListener('click', function() {
        overlay.style.display = 'block';
        modal.style.display = 'block';
        setDefaultDateInput();
    });

    closeModal.addEventListener('click', closeModals);
    
    overlay.addEventListener('click', function() {
        if (!isTimerRunning) {
            closeModals();
            closeConfirmModal();
        }
    });

    closeTimerModal.addEventListener('click', async function() {
        if (isTimerRunning) {
            if (confirm('Timer masih berjalan! Yakin ingin keluar? Progress akan disimpan dan study session diselesaikan.')) {
                clearInterval(timerInterval);
                isTimerRunning = false;
                
                // Complete study session sebelum close
                if (currentStudySession) {
                    try {
                        await completeStudySessionAPI(currentStudySession.id);
                        currentStudySession = null;
                    } catch (error) {
                        console.error('Error completing session on close:', error);
                    }
                }
                
                saveGoalProgress();
                closeModals();
            }
        } else {
            saveGoalProgress();
            closeModals();
        }
    });

    function closeModals() {
        if (isTimerRunning) {
            clearInterval(timerInterval);
            isTimerRunning = false;
            
            // Complete study session
            if (currentStudySession) {
                completeStudySessionAPI(currentStudySession.id)
                    .then(() => {
                        currentStudySession = null;
                        console.log('Session completed on modal close');
                    })
                    .catch(err => console.error('Error completing session:', err));
            }
            
            saveGoalProgress();
        } else {
            saveGoalProgress();
        }
        
        overlay.style.display = 'none';
        modal.style.display = 'none';
        timerModal.style.display = 'none';
        confirmModal.style.display = 'none';
        
        activeTimer.style.color = '#333';
        activeTimer.style.fontWeight = 'normal';
        
        document.getElementById('goalTitle').value = '';
        document.getElementById('dailyGoalTime').value = '';
        setDefaultDateInput();
    }

    // ==================== CREATE GOAL ====================

    saveGoal.addEventListener('click', async function() {
        const goalTitle = document.getElementById('goalTitle').value.trim();
        const dailyGoalTime = document.getElementById('dailyGoalTime').value;
        const selectPeriod = document.getElementById('selectPeriod').value;

        if (goalTitle && dailyGoalTime && selectPeriod) {
            const timeWithSeconds = dailyGoalTime + ':00';

            try {
                const newGoal = await createGoalAPI({
                    title: goalTitle,
                    dailyTargetTime: timeWithSeconds,
                    targetDate: selectPeriod,
                    status: 'active'
                });

                // Tambahkan ke local state
                goals.push(newGoal);
                
                closeModals();
                renderGoals();
                generateWeeklyChart();

            } catch (error) {
                showError(error.message);
            }

        } else {
            alert('Harap isi semua field!');
        }
    });

    // ==================== WEEKLY CHART ====================

    // Function grafik mingguan - DIPERBAIKI: Pakai daily summaries
    async function generateWeeklyChart() {
        try {
            // ✅ COBA PAKAI DATA DARI DAILY SUMMARIES DULU
            const weeklyData = await getWeeklyDataFromSummaries();
            if (weeklyData) {
                renderWeeklyChart(weeklyData);
                return;
            }
        } catch (error) {
            console.log('Fallback ke perhitungan manual');
        }
        
        // FALLBACK: Pakai perhitungan manual
        const weeklyData = getWeeklyDataFallback();
        renderWeeklyChart(weeklyData);
    }

    // ✅ FUNGSI BARU: Transform data dari daily summaries untuk chart
    function transformWeeklyData(summaries) {
        const weeklyData = {};
        const today = new Date();
        
        // Buat data untuk 7 hari terakhir
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateKey = getDateKey(date);
            
            // Cari summary untuk tanggal ini
            const summary = summaries.find(s => s.summary_date === dateKey);
            
            weeklyData[dateKey] = {
                date: date,
                totalSeconds: summary ? summary.total_study_time_seconds : 0,
                displayDate: formatChartDate(date),
                goalsCompleted: summary ? summary.goals_completed : 0
            };
        }
        
        return weeklyData;
    }

    // Data selama 7 hari terakhir termasuk hari ini - FALLBACK
    function getWeeklyDataFallback() {
        const weeklyData = {};
        const today = new Date();
        
        // Hasil data dari 7 hari terakhir
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateKey = getDateKey(date);
            
            // Menghitung total waktu berdasarkan progress aktual
            let totalSeconds = 0;
            goals.forEach(goal => {
                const goalDate = formatDateForCompare(new Date(goal.target_date));
                if (goalDate === dateKey) {
                    const goalKey = `${goal.id}_${dateKey}`;
                    totalSeconds += goalProgress[goalKey] || 0;
                }
            });
            
            weeklyData[dateKey] = {
                date: date,
                totalSeconds: totalSeconds,
                displayDate: formatChartDate(date)
            };
        }
        
        return weeklyData;
    }

    // Format tanggal untuk grafik
    function formatChartDate(date) {
        const days = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const dayName = days[date.getDay()];
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        return `${dayName}<br>${day}/${month}`;
    }

    // Render grafik mingguan
    function renderWeeklyChart(weeklyData) {
        const chartContainer = document.getElementById('weeklyChart');
        const tooltip = document.getElementById('chartTooltip');
        
        chartContainer.innerHTML = '';
        
        const dates = Object.keys(weeklyData);
        
        if (dates.length === 0) {
            chartContainer.innerHTML = '<div class="no-data">Tidak ada data untuk ditampilkan</div>';
            return;
        }
        
        // Menemukan nilai maksimum untuk penskalaan
        const maxSeconds = Math.max(...dates.map(date => weeklyData[date].totalSeconds), 3600);
        
        dates.forEach(dateKey => {
            const data = weeklyData[dateKey];
            const barHeight = maxSeconds > 0 ? (data.totalSeconds / maxSeconds) * 100 : 0;
            
            const chartBar = document.createElement('div');
            chartBar.className = 'chart-bar';
            
            // Highlight tanggal saat ini
            const currentDateKey = getDateKey(currentDate);
            if (dateKey === currentDateKey) {
                chartBar.classList.add('current-day');
            }
            
            chartBar.innerHTML = `
                <div class="bar-container">
                    <div class="bar-fill" style="height: ${barHeight}%"></div>
                </div>
                <div class="bar-label">${data.displayDate}</div>
                <div class="bar-value">${formatTime(data.totalSeconds)}</div>
            `;
            
            // Klik grafik
            chartBar.addEventListener('click', function() {
                currentDate = new Date(data.date);
                updateDateDisplay();
                
                document.querySelector('.box.right').scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            });
            
            // Hover - ✅ DITAMBAH INFO GOALS COMPLETED
            chartBar.addEventListener('mousemove', function(e) {
                const goalsText = data.goalsCompleted !== undefined ? `<br>Goals Completed: ${data.goalsCompleted}` : '';
                const tooltipContent = `
                    <strong>${data.date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                    <br>Total Belajar: ${formatTime(data.totalSeconds)}${goalsText}
                    ${data.totalSeconds > 0 ? '<br><small>Klik untuk lihat detail</small>' : ''}
                `;
                tooltip.innerHTML = tooltipContent;
                tooltip.style.opacity = '1';
                tooltip.style.left = (e.pageX + 10) + 'px';
                tooltip.style.top = (e.pageY - 60) + 'px';
            });
            
            chartBar.addEventListener('mouseleave', function() {
                tooltip.style.opacity = '0';
            });
            
            chartContainer.appendChild(chartBar);
        });
    }
});
