document.addEventListener('DOMContentLoaded', function() {
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
    let goals = JSON.parse(localStorage.getItem('goals')) || [];
    let goalProgress = JSON.parse(localStorage.getItem('goalProgress')) || {};
    let dailyTotalTime = JSON.parse(localStorage.getItem('dailyTotalTime')) || {};
    let goalToDelete = null;

    // Inisialisasi
    init();

    function init() {
        updateDateDisplay();
        renderGoals();
        updateTotalTimer();
        setDefaultDateInput();
        generateWeeklyChart();
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

    // Hitung total waktu untuk tanggal saat ini
    function calculateDailyTotalTime() {
        const dateKey = getDateKey(currentDate);
        let total = 0;
        
        Object.keys(goalProgress).forEach(key => {
            if (key.endsWith(dateKey)) {
                total += goalProgress[key];
            }
        });
        
        dailyTotalTime[dateKey] = total;
        localStorage.setItem('dailyTotalTime', JSON.stringify(dailyTotalTime));
        return total;
    }

    // Manajemen target
    function renderGoals() {
        const dateKey = getDateKey(currentDate);
        goalsContainer.innerHTML = '';
        
        const todayGoals = goals.filter(goal => goal.date === dateKey);

        if (todayGoals.length === 0) {
            goalsContainer.innerHTML = '<div class="no-goals">Tidak ada target untuk tanggal ini</div>';
            return;
        }

        todayGoals.forEach((goal, index) => {
            const goalItem = document.createElement('div');
            goalItem.className = 'goal-item';
            
            const goalKey = `${goal.id}_${goal.date}`;
            const progress = goalProgress[goalKey] || 0;
            const targetSeconds = timeToSeconds(goal.time);
            const progressPercent = Math.min((progress / targetSeconds) * 100, 100);
            const isTargetAchieved = progress >= targetSeconds && targetSeconds > 0;
            
            if (isTargetAchieved) {
                goalItem.classList.add('target-achieved');
            }
            
            goalItem.innerHTML = `
                <div class="goal-content">
                    <div class="goal-info">
                        <div class="goal-name">${goal.title}</div>
                        <div class="goal-progress-container">
                            <div class="goal-progress">
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${progressPercent}%"></div>
                                </div>
                                <div class="progress-text">
                                    <span class="progress-current">${formatTime(progress)}</span>
                                    <span class="progress-target">Target: ${goal.time}</span>
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

    // Function hapus target
    function showDeleteConfirmation(goal) {
        goalToDelete = goal;
        confirmMessage.textContent = `Apakah Anda yakin ingin menghapus target "${goal.title}"?`;
        confirmModal.style.display = 'block';
        overlay.style.display = 'block';
    }

    function deleteGoal() {
        if (goalToDelete) {
            goals = goals.filter(goal => goal.id !== goalToDelete.id);
            localStorage.setItem('goals', JSON.stringify(goals));
            
            const goalKey = `${goalToDelete.id}_${goalToDelete.date}`;
            delete goalProgress[goalKey];
            localStorage.setItem('goalProgress', JSON.stringify(goalProgress));
            
            renderGoals();
            updateTotalTimer();
            generateWeeklyChart();
            
            closeConfirmModal();
        }
    }

    function closeConfirmModal() {
        confirmModal.style.display = 'none';
        overlay.style.display = 'none';
        goalToDelete = null;
    }

    confirmYes.addEventListener('click', deleteGoal);
    confirmNo.addEventListener('click', closeConfirmModal);

    function openTimerModal(goal) {
        activeGoal = goal;
        activeGoalName.textContent = goal.title;
        activeGoalTime.textContent = goal.time;
        
        const goalKey = `${goal.id}_${goal.date}`;
        timerSeconds = goalProgress[goalKey] || 0;
        activeTimer.textContent = formatTime(timerSeconds);
        
        startTimer.disabled = false;
        stopTimer.disabled = true;
        isTimerRunning = false;
        
        timerModal.style.display = 'block';
        overlay.style.display = 'block';
        updateTimerStatus();
        checkTargetReached();
    }

    // Function waktu
    startTimer.addEventListener('click', function() {
        if (!isTimerRunning) {
            isTimerRunning = true;
            startTimer.disabled = true;
            stopTimer.disabled = false;
            
            timerInterval = setInterval(function() {
                timerSeconds++;
                activeTimer.textContent = formatTime(timerSeconds);
                checkTargetReached();
            }, 1000);
            
            updateTimerStatus();
        }
    });

    stopTimer.addEventListener('click', function() {
        if (isTimerRunning) {
            isTimerRunning = false;
            startTimer.disabled = false;
            stopTimer.disabled = true;
            
            clearInterval(timerInterval);
            saveGoalProgress();
            updateTimerStatus();
        }
    });

    // Simpan progress target
    function saveGoalProgress() {
        if (activeGoal) {
            const goalKey = `${activeGoal.id}_${activeGoal.date}`;
            goalProgress[goalKey] = timerSeconds;
            localStorage.setItem('goalProgress', JSON.stringify(goalProgress));
            renderGoals();
            updateTotalTimer();
            generateWeeklyChart();
        }
    }

    // Mengecek jika target tercapai
    function checkTargetReached() {
        if (activeGoal) {
            const targetSeconds = timeToSeconds(activeGoal.time);
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
    // Buat overlay
    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay active';
    
    // Buat notifikasi
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
    
    // Tambahkan ke body
    document.body.appendChild(overlay);
    document.body.appendChild(notification);
    
    // Fungsi untuk menutup notifikasi
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
    
    // Event listener untuk tombol close
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', closeNotification);
    
    // Event listener untuk overlay (klik di luar notifikasi)
    overlay.addEventListener('click', closeNotification);
    
    // Hapus timeout auto close - notifikasi hanya akan hilang jika diclose manual
}
    // Function status waktu
    function updateTimerStatus() {
        const timerStatus = document.getElementById('timerStatus');
        if (isTimerRunning) {
            timerStatus.innerHTML = `Timer sedang berjalan - Klik tombol X di atas untuk keluar kapan saja`;
            timerStatus.style.color = "#ff6b6b";
        } else {
            timerStatus.innerHTML = `Timer dihentikan - Anda dapat menutup jendela ini menggunakan tombol X di atas`;
            timerStatus.style.color = "#4CAF50";
        }
    }

    // Manajemen total waktu
    function updateTotalTimer() {
        const totalSeconds = calculateDailyTotalTime();
        totalTimer.textContent = formatTime(totalSeconds);
    }

    // Modal Manajemen
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

    closeTimerModal.addEventListener('click', function() {
        if (isTimerRunning) {
            if (confirm('Timer masih berjalan! Yakin ingin keluar? Progress Anda akan disimpan.')) {
                clearInterval(timerInterval);
                isTimerRunning = false;
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

    // Menyimpan target
    saveGoal.addEventListener('click', function() {
        const goalTitle = document.getElementById('goalTitle').value.trim();
        const dailyGoalTime = document.getElementById('dailyGoalTime').value;
        const selectPeriod = document.getElementById('selectPeriod').value;

        if (goalTitle && dailyGoalTime && selectPeriod) {
            const timeWithSeconds = dailyGoalTime + ':00';

            const newGoal = {
                id: Date.now(),
                title: goalTitle,
                time: timeWithSeconds,
                date: selectPeriod,
                completed: false
            };

            goals.push(newGoal);
            localStorage.setItem('goals', JSON.stringify(goals));
            
            closeModals();
            renderGoals();
            generateWeeklyChart();

        } else {
            alert('Harap isi semua field!');
        }
    });

    // Function grafik mingguan
    function generateWeeklyChart() {
        const weeklyData = getWeeklyData();
        renderWeeklyChart(weeklyData);
    }

    // Data selama 7 hari terakhir termasuk hari ini
    function getWeeklyData() {
        const weeklyData = {};
        const today = new Date();
        
        // Hasil data dari 7 hari terakhir
        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateKey = getDateKey(date);
            
            // Menjumlahkan waktu belajar hari ini
            let totalSeconds = 0;
            Object.keys(goalProgress).forEach(key => {
                if (key.endsWith(dateKey)) {
                    totalSeconds += goalProgress[key];
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
            
            // Hover
            chartBar.addEventListener('mousemove', function(e) {
                const tooltipContent = `
                    <strong>${data.date.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                    Total Belajar: ${formatTime(data.totalSeconds)}
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
