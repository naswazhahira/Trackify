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
});

// fungsi kalender mini -- DIPERBAIKI
function initializeCalendar() {
    const calendarDays = document.querySelector('.calendar-days');
    const monthYear = document.querySelector('.month-year');
    const prevBtn = document.querySelector('.calendar-header .nav-btn:first-child');
    const nextBtn = document.querySelector('.calendar-header .nav-btn:last-child');
    const weekdaysElement = document.querySelector('.calendar-weekdays');

    console.log(' Inisialisasi kalender:', {
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
        console.log(' Nama hari diperbarui:', newWeekdays);
    }

    if (!calendarDays || !monthYear || !prevBtn || !nextBtn) {
        console.error(' Element kalender tidak ditemukan');
        return;
    }

    let currentDate = new Date();

    // Fungsi untuk mendapatkan event dari localStorage
    function getEventsForDate(year, month, day) {
        const events = JSON.parse(localStorage.getItem('calendarEvents')) || {};
        const dateKey = `${year}-${month + 1}-${day}`;
        return events[dateKey] || [];
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
       
        console.log(' Info Kalender:', {
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
           
            // hari dengan jadwal berwarna hijau
            const events = getEventsForDate(year, month, day);
            if (events.length > 0) {
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
   
    // Initial render
    renderCalendar();
    console.log(' Kalender berhasil diinisialisasi');
}


// fungsi To-Do
function initializeTodo() {
    const todoCheckboxes = document.querySelectorAll('.todo-item input[type="checkbox"]');
    const noTasks = document.querySelector('.no-tasks');

    console.log(' Inisialisasi To-Do:', {
        checkboxes: todoCheckboxes.length,
        noTasks: !!noTasks
    });

    if (!todoCheckboxes.length || !noTasks) {
        console.error(' Element To-Do tidak ditemukan');
        return;
    }

    todoCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                // Efek ketika tugas sudah selesai
                this.parentElement.style.opacity = '0.6';
               
                // Memeriksa apakah tugas sudah selesai
                const allCompleted = Array.from(todoCheckboxes).every(cb => cb.checked);
                if (allCompleted) {
                    // Tampilkan pesan "tidak ada tugas" 
                    setTimeout(() => {
                        document.querySelectorAll('.todo-item').forEach(item => {
                            item.style.display = 'none';
                        });
                        noTasks.style.display = 'block';
                    }, 1000);
                }
            } else {
                // Reset opacity jika unchecked
                this.parentElement.style.opacity = '1';
                noTasks.style.display = 'none';
                document.querySelectorAll('.todo-item').forEach(item => {
                    item.style.display = 'flex';
                });
            }
        });
    });

    console.log('To-Do berhasil diinisialisasi');
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
