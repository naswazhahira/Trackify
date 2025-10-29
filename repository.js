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


const grid = document.querySelector(".grid");
const addBtn = document.getElementById("addBtn");


// Inisialisasi folder yang sudah ada
function initializeExistingFolders() {
    document.querySelectorAll('.card-wrapper:not(:last-child)').forEach(wrapper => {
        const folderName = wrapper.querySelector('.folder-name').textContent;
        const card = wrapper.querySelector('.card');
       
        // Event listener untuk delete folder yang sudah ada
        const deleteBtn = wrapper.querySelector('.delete-folder');
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteFolder(wrapper, folderName);
        });


        // Event listener untuk klik folder
        card.addEventListener('click', () => {
            openFolder(folderName);
        });
    });
}


// Fungsi untuk membuat folder baru
addBtn.addEventListener("click", () => {
    const name = prompt("Masukkan nama folder:");
    if (name && name.trim() !== "") {
        createFolder(name.trim());
    } else if (name !== null) {
        alert("Nama folder tidak boleh kosong!");
    }
});


// Fungsi untuk membuat folder
function createFolder(name) {
    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper";


    const numFolders = grid.querySelectorAll(".card-wrapper:not(:last-child)").length;
    const colorClass = `color-${(numFolders % 5) + 1}`;


    wrapper.innerHTML = `
        <div class="card ${colorClass}">
            <p class="folder-name">${name}</p>
            <button class="delete-folder">×</button>
        </div>
    `;


    const addWrapper = addBtn.closest(".card-wrapper");
    grid.insertBefore(wrapper, addWrapper);


    // Tambahkan event listener untuk delete
    const deleteBtn = wrapper.querySelector(".delete-folder");
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteFolder(wrapper, name);
    });


    // Tambahkan event listener untuk klik folder
    const card = wrapper.querySelector(".card");
    card.addEventListener("click", () => {
        openFolder(name);
    });


    // Simpan ke localStorage
    saveToLocalStorage();
}


// Fungsi untuk menghapus folder
function deleteFolder(wrapper, name) {
    if (confirm(`Apakah Anda yakin ingin menghapus folder "${name}"?`)) {
        wrapper.style.transform = "scale(0)";
        wrapper.style.opacity = "0";
       
        setTimeout(() => {
            wrapper.remove();
            saveToLocalStorage();
        }, 300);
    }
}


// Fungsi untuk membuka folder
function openFolder(name) {
    // Tambahkan fungsi yang diinginkan ketika folder diklik
    console.log(`Membuka folder: "${name}"`);
   
    // Contoh: Bisa redirect ke halaman folder, buka modal, dll.
    // window.location.href = `folder.html?name=${encodeURIComponent(name)}`;
   
    // Untuk sementara, tampilkan alert
    alert(`Membuka folder: ${name}\n\nFitur ini bisa dikembangkan lebih lanjut untuk:\n- Menampilkan file dalam folder\n- Upload file\n- Management konten, dll.`);
}


// Fungsi untuk menyimpan data ke localStorage
function saveToLocalStorage() {
    const folders = [];
    document.querySelectorAll('.card-wrapper:not(:last-child)').forEach(wrapper => {
        const name = wrapper.querySelector('.folder-name').textContent;
        const colorClass = Array.from(wrapper.querySelector('.card').classList)
            .find(cls => cls.startsWith('color-'));
       
        folders.push({
            name: name,
            color: colorClass
        });
    });
   
    localStorage.setItem('repositoryFolders', JSON.stringify(folders));
}


// Fungsi untuk load data dari localStorage
function loadFromLocalStorage() {
    const savedFolders = localStorage.getItem('repositoryFolders');
    if (savedFolders) {
        const folders = JSON.parse(savedFolders);
       
        // Hapus folder default yang sudah ada (kecuali tombol add)
        document.querySelectorAll('.card-wrapper:not(:last-child)').forEach(wrapper => {
            wrapper.remove();
        });
       
        // Buat folder dari data yang disimpan
        folders.forEach(folder => {
            createFolderFromData(folder.name, folder.color);
        });
    }
}


// Fungsi untuk membuat folder dari data yang disimpan
function createFolderFromData(name, colorClass) {
    const wrapper = document.createElement("div");
    wrapper.className = "card-wrapper";


    wrapper.innerHTML = `
        <div class="card ${colorClass}">
            <p class="folder-name">${name}</p>
            <button class="delete-folder">×</button>
        </div>
    `;


    const addWrapper = addBtn.closest(".card-wrapper");
    grid.insertBefore(wrapper, addWrapper);


    // Tambahkan event listener
    const deleteBtn = wrapper.querySelector(".delete-folder");
    deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteFolder(wrapper, name);
    });


    const card = wrapper.querySelector(".card");
    card.addEventListener("click", () => {
        openFolder(name);
    });
}


// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    initializeExistingFolders();
    loadFromLocalStorage();
});


// Event listener untuk tombol add card
addBtn.addEventListener('click', function(e) {
    e.stopPropagation();
});


// Tambahkan animasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.card-wrapper').forEach((wrapper, index) => {
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'translateY(20px)';
       
        setTimeout(() => {
            wrapper.style.transition = 'all 0.5s ease';
            wrapper.style.opacity = '1';
            wrapper.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

