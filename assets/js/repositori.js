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

addBtn.addEventListener("click", () => {
    document.getElementById("addFolderModal").style.display = "flex";
});

const modalAddFolder = document.getElementById("addFolderModal");
const createFolderBtn = document.getElementById("confirmAddFolder"); 
const cancelFolderBtn = document.getElementById("cancelAddFolder");
const newFolderName = document.getElementById("folderInput"); 


cancelFolderBtn.addEventListener("click", () => {
    modalAddFolder.style.display = "none";
    newFolderName.value = "";
});

createFolderBtn.addEventListener("click", () => {
    const name = newFolderName.value.trim();

    if (name === "") {
        alert("Nama folder tidak boleh kosong!");
        return;
    }

    createFolder(name);
    modalAddFolder.style.display = "none";
    newFolderName.value = "";
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

let currentOpenedFolder = null;

function openFolder(name) {
    currentOpenedFolder = name;
    document.getElementById("uploadModal").style.display = "flex";
}

const uploadModal = document.getElementById("uploadModal");
const fileInput = document.getElementById("fileInput");
const cancelUpload = document.getElementById("cancelUpload");
const confirmUpload = document.getElementById("confirmUpload");

cancelUpload.addEventListener("click", () => {
    uploadModal.style.display = "none";
    fileInput.value = "";
});

confirmUpload.addEventListener("click", () => {
    if (!currentOpenedFolder) return;

    const files = Array.from(fileInput.files);
    if (files.length === 0) {
        alert("Pilih minimal 1 file!");
        return;
    }

    saveFilesToFolder(currentOpenedFolder, files);

    uploadModal.style.display = "none";
    fileInput.value = "";

    alert("File berhasil diunggah ke folder: " + currentOpenedFolder);
    showFilesInFolder(currentOpenedFolder);
});



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

//tambahan 
function saveFilesToFolder(folderName, files) {
    let repoData = JSON.parse(localStorage.getItem("repoFiles")) || {};

    if (!repoData[folderName]) {
        repoData[folderName] = [];
    }

    files.forEach(file => {
        repoData[folderName].push({
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toLocaleString()
        });
    });

    localStorage.setItem("repoFiles", JSON.stringify(repoData));
}


// saat halaman dimuat
document.addEventListener('DOMContentLoaded', function() {
    initializeExistingFolders();
    loadFromLocalStorage();
});

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

//tambahan 
window.addEventListener("click", (e) => {
    if (e.target === uploadModal) {
        uploadModal.style.display = "none";
    }
});


