const hamburgerIcon = document.getElementById('hamburgerIcon');
const closeSidebar = document.getElementById('closeSidebar');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');


console.log('🔍 Sidebar Elements:', {
    hamburgerIcon: !!hamburgerIcon,const hamburgerIcon = document.getElementById('hamburgerIcon');
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


console.log("repository-final.js loaded");
const demoFileUrl = "/mnt/data/ad2af446-efbf-4ff0-91c8-df4e3d487831.jpg";
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));


// API Configuration
const API_BASE_URL = 'http://localhost:3000/api'; // Backend port 5000


// Helper functions for API calls
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const token = localStorage.getItem('token');
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token ? `Bearer ${token}` : ''
            }
        };


        if (data && (method === 'POST' || method === 'PUT')) {
            config.body = JSON.stringify(data);
        }


        console.log(`API ${method} ${endpoint}`, data);
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
       
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }


        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}


// Fungsi untuk mendapatkan user_id (contoh - sesuaikan dengan implementasi autentikasi Anda)
function getCurrentUserId() {
    // Ganti dengan cara Anda mendapatkan user ID
    // Contoh dari localStorage atau session
    const userId = localStorage.getItem('userId') || '1'; // Default untuk testing
    console.log('Current User ID:', userId);
    return userId;
}


(function createUIHelpers() {
   // Confirm modal
    const confirmModal = document.createElement('div');
    confirmModal.id = 'confirmModal';
    confirmModal.className = 'modal';
    confirmModal.innerHTML = `
    <div class="modal-content" style="width:360px;max-width:92%">
        <h3 id="confirmModalText" style="text-align:center;margin-bottom:20px;font-size:18px;color:#333;"></h3>
        <div style="display:flex;gap:12px;justify-content:center;margin-top:20px;">
        <button id="confirmCancelBtn" style="
            background:#ddd;
            color:#333;
            padding:10px 24px;
            border-radius:8px;
            border:none;
            cursor:pointer;
            font-weight:600;
            font-size:14px;
            transition:all 0.3s ease;
            min-width:80px;
        ">Batal</button>
        <button id="confirmOkBtn" style="
            background:#ff6b6b;
            color:#fff;
            padding:10px 24px;
            border-radius:8px;
            border:none;
            cursor:pointer;
            font-weight:600;
            font-size:14px;
            transition:all 0.3s ease;
            min-width:80px;
        ">Hapus</button>
        </div>
    </div>
    `;


    // Tambahkan event listeners untuk hover effects
    document.addEventListener('DOMContentLoaded', function() {
    const cancelBtn = document.getElementById('confirmCancelBtn');
    const okBtn = document.getElementById('confirmOkBtn');
   
    if (cancelBtn) {
        cancelBtn.addEventListener('mouseenter', function() {
        this.style.background = '#bbb';
        this.style.transform = 'translateY(-1px)';
        });
        cancelBtn.addEventListener('mouseleave', function() {
        this.style.background = '#ddd';
        this.style.transform = 'translateY(0)';
        });
    }
   
    if (okBtn) {
        okBtn.addEventListener('mouseenter', function() {
        this.style.background = '#ff5252';
        this.style.transform = 'translateY(-1px)';
        });
        okBtn.addEventListener('mouseleave', function() {
        this.style.background = '#ff6b6b';
        this.style.transform = 'translateY(0)';
        });
    }
    });
   
    document.body.appendChild(confirmModal);


    // Toast
    const toast = document.createElement('div');
    toast.id = 'repoToast';
    toast.style.position = 'fixed';
    toast.style.right = '20px';
    toast.style.bottom = '20px';
    toast.style.padding = '10px 14px';
    toast.style.background = 'rgba(0,0,0,0.75)';
    toast.style.color = '#fff';
    toast.style.borderRadius = '8px';
    toast.style.fontSize = '14px';
    toast.style.display = 'none';
    document.body.appendChild(toast);


    // Small preview modal (in-modal preview optional)
    const previewModal = document.createElement('div');
    previewModal.id = 'previewModal';
    previewModal.className = 'modal';
    previewModal.innerHTML = `
      <div class="modal-content" style="width:80%; max-width:900px;">
        <h3 id="previewModalTitle"></h3>
        <div id="previewModalBody" style="min-height:200px;max-height:70vh;overflow:auto;margin-top:8px;"></div>
        <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:12px;">
          <a id="previewDownload" href="#" download style="text-decoration:none;"><button style="background:var(--primary-color);color:#fff;padding:8px 12px;border-radius:8px;">Download</button></a>
          <button id="previewClose" style="background:#ddd;padding:8px 12px;border-radius:8px;">Tutup</button>
        </div>
      </div>
    `;
    document.body.appendChild(previewModal);


    // Rename Modal
    const renameModal = document.createElement('div');
    renameModal.id = 'renameModal';
    renameModal.className = 'modal';
    renameModal.innerHTML = `
      <div class="modal-content" style="width:400px;max-width:92%">
        <h3>Rename Folder</h3>
        <input type="text" id="renameInput" placeholder="Nama folder baru... (maks. 15 karakter)">
        <div class="char-count" id="renameCharCount">0/15 karakter</div>
        <div class="modal-buttons">
          <button id="cancelRename" style="background:#ddd;padding:8px 12px;border-radius:8px;">Batal</button>
          <button id="confirmRename" style="background:var(--primary-color);color:#fff;padding:8px 12px;border-radius:8px;">Simpan</button>
        </div>
      </div>
    `;
    document.body.appendChild(renameModal);


    // basic modal styles (minimal, so it behaves like your other modals)
    const style = document.createElement('style');
    style.textContent = `
      .modal { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.45); backdrop-filter: blur(3px); justify-content:center; align-items:center; z-index:4000; }
      .modal .modal-content { background:#fff; border-radius:12px; padding:18px; box-shadow:0 10px 30px rgba(0,0,0,0.12); }
    `;
    document.head.appendChild(style);


    // wiring
    confirmModal.addEventListener('click', (e) => { if (e.target === confirmModal) confirmModal.style.display='none'; });
    $('#confirmCancelBtn').addEventListener('click', () => confirmModal.style.display='none');


    previewModal.addEventListener('click', (e) => { if (e.target === previewModal) previewModal.style.display='none'; });
    $('#previewClose').addEventListener('click', () => previewModal.style.display='none');


    renameModal.addEventListener('click', (e) => { if (e.target === renameModal) renameModal.style.display='none'; });
    $('#cancelRename').addEventListener('click', () => renameModal.style.display='none');


    // expose functions
    window.repoUI = {
        openConfirm(text, onOk) {
            $('#confirmModal').style.display = 'flex';
            $('#confirmModalText').textContent = text;
            const okBtn = $('#confirmOkBtn');
            function handler() {
                $('#confirmModal').style.display = 'none';
                okBtn.removeEventListener('click', handler);
                onOk && onOk();
            }
            okBtn.addEventListener('click', handler);
        },
        showToast(text, ms = 1800) {
            const t = $('#repoToast');
            t.textContent = text;
            t.style.display = 'block';
            clearTimeout(t._timer);
            t._timer = setTimeout(()=> t.style.display = 'none', ms);
        },
        openPreview({name, mime, dataUrl, url}) {
            const title = $('#previewModalTitle');
            const body = $('#previewModalBody');
            const dl = $('#previewDownload');
            title.textContent = name;
            body.innerHTML = '';


            if (url) {
                // server URL
                if ((mime && mime.startsWith('image/')) || /\.(png|jpg|jpeg|gif|bmp)$/i.test(name)) {
                    const img = document.createElement('img');
                    img.src = url;
                    img.style.maxWidth = '100%';
                    body.appendChild(img);
                } else if (mime === 'application/pdf' || name.toLowerCase().endsWith('.pdf')) {
                    const iframe = document.createElement('iframe');
                    iframe.src = url;
                    iframe.style.width = '100%';
                    iframe.style.height = '70vh';
                    iframe.frameBorder = 0;
                    body.appendChild(iframe);
                } else {
                    body.innerHTML = `<p>Preview tidak tersedia. Gunakan tombol download.</p>`;
                }
                dl.href = url;
                dl.setAttribute('download', name);
            } else if (dataUrl) {
                // use blob URL for dataUrl
                try {
                    const blob = dataURLToBlob(dataUrl);
                    const objUrl = URL.createObjectURL(blob);
                    if (mime && mime.startsWith('image/')) {
                        const img = document.createElement('img');
                        img.src = objUrl;
                        img.style.maxWidth = '100%';
                        body.appendChild(img);
                    } else if (mime === 'application/pdf' || name.toLowerCase().endsWith('.pdf')) {
                        const iframe = document.createElement('iframe');
                        iframe.src = objUrl;
                        iframe.style.width = '100%';
                        iframe.style.height = '70vh';
                        iframe.frameBorder = 0;
                        body.appendChild(iframe);
                    } else if (mime && mime.startsWith('text/')) {
                        blob.text().then(txt => {
                            const pre = document.createElement('pre');
                            pre.textContent = txt;
                            pre.style.whiteSpace = 'pre-wrap';
                            body.appendChild(pre);
                        });
                    } else {
                        body.innerHTML = `<p>Preview tidak tersedia. Gunakan tombol download.</p>`;
                    }
                    dl.href = objUrl;
                    dl.setAttribute('download', name);
                    // revoke when modal closed
                    $('#previewClose').onclick = () => { URL.revokeObjectURL(objUrl); previewModal.style.display='none'; };
                } catch (e) {
                    body.innerHTML = `<p>Preview gagal.</p>`;
                    dl.href = dataUrl;
                    dl.setAttribute('download', name);
                }
            } else {
                body.innerHTML = `<p>Tidak ada data untuk preview.</p>`;
                dl.removeAttribute('href');
            }


            previewModal.style.display = 'flex';
        },
        openRenameModal(oldName, onRename) {
            $('#renameModal').style.display = 'flex';
            $('#renameInput').value = oldName;
            $('#renameCharCount').textContent = `${oldName.length}/15 karakter`;
            $('#renameCharCount').className = 'char-count';
            $('#renameInput').classList.remove('limit-reached');
           
            if (oldName.length >= 10 && oldName.length < 15) {
                $('#renameCharCount').classList.add('warning');
            } else if (oldName.length >= 15) {
                $('#renameCharCount').classList.add('limit-reached');
                $('#renameInput').classList.add('limit-reached');
            }
           
            $('#renameInput').focus();
            $('#renameInput').select();
           
            const confirmBtn = $('#confirmRename');
            const cancelBtn = $('#cancelRename');
           
            function confirmHandler() {
                const newName = $('#renameInput').value.trim();
                $('#renameModal').style.display = 'none';
                confirmBtn.removeEventListener('click', confirmHandler);
                cancelBtn.removeEventListener('click', cancelHandler);
                onRename && onRename(newName);
            }
           
            function cancelHandler() {
                $('#renameModal').style.display = 'none';
                confirmBtn.removeEventListener('click', confirmHandler);
                cancelBtn.removeEventListener('click', cancelHandler);
            }
           
            confirmBtn.addEventListener('click', confirmHandler);
            cancelBtn.addEventListener('click', cancelHandler);
           
            // Enter key support
            $('#renameInput').onkeypress = function(e) {
                if (e.key === 'Enter') {
                    confirmHandler();
                }
            };
        }
    };
})();


// utilities
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = reject;
        r.readAsDataURL(file);
    });
}


function dataURLToBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8 = new Uint8Array(n);
    while (n--) u8[n] = bstr.charCodeAt(n);
    return new Blob([u8], {type: mime});
}


// Tetap pertahankan localStorage untuk file (sementara)
// Nanti bisa diganti dengan API backend untuk file
function getRepoFiles() {
    try { return JSON.parse(localStorage.getItem('repoFiles')||'{}'); } catch { return {}; }
}
function saveRepoFiles(obj) {
    localStorage.setItem('repoFiles', JSON.stringify(obj));
}


// Fungsi untuk menyimpan folder ke localStorage (cache)
function saveFolderList(folders) {
    localStorage.setItem('repositoryFolders', JSON.stringify(folders));
}


// Fungsi untuk mengambil folder dari cache
function getFolderList() {
    try { return JSON.parse(localStorage.getItem('repositoryFolders')||'[]'); } catch { return []; }
}


// DOM elements
const grid = document.querySelector('.grid');
const addBtn = document.getElementById('addBtn');


const addFolderModal = document.getElementById('addFolderModal');
const createFolderBtn = document.getElementById('confirmAddFolder');
const cancelFolderBtn = document.getElementById('cancelAddFolder');
const newFolderName = document.getElementById('folderInput');


const uploadModal = document.getElementById('uploadModal');
const fileInput = document.getElementById('fileInput');
const cancelUpload = document.getElementById('cancelUpload');
const confirmUpload = document.getElementById('confirmUpload');


const filesModal = document.getElementById('filesModal');
const fileList = document.getElementById('fileList');
const folderTitle = document.getElementById('folderTitle');
const closeFilesModal = document.getElementById('closeFilesModal');


// ensure essential elements exist
if (!grid) console.warn("Grid not found");
if (!filesModal) console.warn("filesModal not found");


// Character counter untuk folder name
function initializeCharacterCounter() {
    const folderInput = document.getElementById('folderInput');
    if (!folderInput) return;
   
    const charCount = document.createElement('div');
    charCount.className = 'char-count';
    charCount.textContent = '0/15 karakter';
    folderInput.parentNode.insertBefore(charCount, folderInput.nextSibling);


    // Event listener untuk membatasi input
    folderInput.addEventListener('input', function() {
        const maxLength = 15;
        const currentLength = this.value.length;
       
        // Update karakter count
        charCount.textContent = `${currentLength}/${maxLength} karakter`;
       
        // Hapus class sebelumnya
        charCount.classList.remove('warning', 'limit-reached');
        this.classList.remove('limit-reached');
       
        // Jika mendekati batas (10-14 karakter)
        if (currentLength >= 10 && currentLength < maxLength) {
            charCount.classList.add('warning');
        }
        // Jika mencapai atau melebihi batas
        else if (currentLength >= maxLength) {
            charCount.classList.add('limit-reached');
            this.classList.add('limit-reached');
           
            // Potong teks jika melebihi batas
            if (currentLength > maxLength) {
                this.value = this.value.substring(0, maxLength);
                charCount.textContent = `${maxLength}/${maxLength} karakter (maksimal)`;
                window.repoUI.showToast('Maksimal 15 karakter');
            }
        }
    });


    return charCount;
}


// Character counter untuk rename modal
function initializeRenameCharacterCounter() {
    const renameInput = document.getElementById('renameInput');
    if (!renameInput) return;
   
    const charCount = document.getElementById('renameCharCount');
   
    renameInput.addEventListener('input', function() {
        const maxLength = 15;
        const currentLength = this.value.length;
       
        // Update karakter count
        charCount.textContent = `${currentLength}/${maxLength} karakter`;
       
        // Hapus class sebelumnya
        charCount.classList.remove('warning', 'limit-reached');
        this.classList.remove('limit-reached');
       
        // Jika mendekati batas (10-14 karakter)
        if (currentLength >= 10 && currentLength < maxLength) {
            charCount.classList.add('warning');
        }
        // Jika mencapai atau melebihi batas
        else if (currentLength >= maxLength) {
            charCount.classList.add('limit-reached');
            this.classList.add('limit-reached');
           
            // Potong teks jika melebihi batas
            if (currentLength > maxLength) {
                this.value = this.value.substring(0, maxLength);
                charCount.textContent = `${maxLength}/${maxLength} karakter (maksimal)`;
                window.repoUI.showToast('Maksimal 15 karakter');
            }
        }
    });
}


// folder functions - DIUBAH untuk menggunakan API
async function createFolder(name) {
    // Validasi panjang nama
    if (name.length > 15) {
        window.repoUI.showToast('Nama folder maksimal 15 karakter');
        return;
    }


    try {
        console.log('Creating folder:', { name });
       
        const response = await apiCall('/repository_folders', 'POST', {
            folder_name: name,
            color: null
        });


        console.log('Folder creation response:', response);
       
        if (response.data) {
            const folder = response.data;
            displayFolder(folder);
           
            // Update cache lokal
            const cachedFolders = getFolderList();
            cachedFolders.push({
                id: folder.id,
                name: folder.folder_name,
                color: folder.color || `color-${(grid.querySelectorAll('.card-wrapper:not(:last-child)').length % 5) + 1}`
            });
            saveFolderList(cachedFolders);
           
            window.repoUI.showToast('Folder dibuat');
            return folder;
        }
    } catch (error) {
        console.error('Error creating folder:', error);
       
        // Fallback ke localStorage jika API gagal
        console.log('Using localStorage fallback for folder creation');
       
        // Check for duplicates in cache
        const folders = getFolderList();
        if (folders.find(f => f.name === name)) {
            window.repoUI.showToast('Folder sudah ada');
            return;
        }


        const wrapper = document.createElement('div');
        wrapper.className = 'card-wrapper';


        const numFolders = grid.querySelectorAll('.card-wrapper:not(:last-child)').length;
        const colorClass = `color-${(numFolders % 5) + 1}`;


        wrapper.innerHTML = `
            <div class="card ${colorClass}">
                <p class="folder-name">${escapeHtml(name)}</p>
                <div class="folder-actions">
                    <button class="rename-folder" title="Rename Folder">
                        <i class='bx bx-edit-alt'></i>
                    </button>
                    <button class="delete-folder">×</button>
                </div>
            </div>
        `;


        const addWrapper = addBtn.closest('.card-wrapper');
        grid.insertBefore(wrapper, addWrapper);


        // attach handlers
        attachFolderEventHandlers(wrapper, {
            id: 'local_' + Date.now(),
            folder_name: name
        });


        // persist to cache
        folders.push({
            id: 'local_' + Date.now(),
            name,
            color: colorClass
        });
        saveFolderList(folders);
       
        window.repoUI.showToast('Folder dibuat (offline)');
    }
}


function displayFolder(folder) {
    const wrapper = document.createElement('div');
    wrapper.className = 'card-wrapper';
    wrapper.dataset.folderId = folder.id;


    const colorClass = folder.color || `color-${(grid.querySelectorAll('.card-wrapper:not(:last-child)').length % 5) + 1}`;


    wrapper.innerHTML = `
        <div class="card ${colorClass}">
            <p class="folder-name">${escapeHtml(folder.folder_name)}</p>
            <div class="folder-actions">
                <button class="rename-folder" title="Rename Folder">
                    <i class='bx bx-edit-alt'></i>
                </button>
                <button class="delete-folder">×</button>
            </div>
        </div>
    `;


    const addWrapper = addBtn.closest('.card-wrapper');
    grid.insertBefore(wrapper, addWrapper);


    // attach handlers
    attachFolderEventHandlers(wrapper, folder);
}


function createFolderFromData(folder) {
    const wrapper = document.createElement('div');
    wrapper.className = 'card-wrapper';
    wrapper.dataset.folderId = folder.id || folder.local_id;
   
    const colorClass = folder.color || `color-${(grid.querySelectorAll('.card-wrapper:not(:last-child)').length % 5) + 1}`;


    wrapper.innerHTML = `
        <div class="card ${colorClass}">
            <p class="folder-name">${escapeHtml(folder.folder_name || folder.name)}</p>
            <div class="folder-actions">
                <button class="rename-folder" title="Rename Folder">
                    <i class='bx bx-edit-alt'></i>
                </button>
                <button class="delete-folder">×</button>
            </div>
        </div>
    `;
   
    const addWrapper = addBtn.closest('.card-wrapper');
    grid.insertBefore(wrapper, addWrapper);


    attachFolderEventHandlers(wrapper, folder);
}


// Function untuk attach event handlers ke folder - DIUBAH
function attachFolderEventHandlers(wrapper, folder) {
    const delBtn = wrapper.querySelector('.delete-folder');
    const renameBtn = wrapper.querySelector('.rename-folder');
    const card = wrapper.querySelector('.card');


    delBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        window.repoUI.openConfirm(`Hapus folder "${folder.folder_name || folder.name}"?`, async () => {
            try {
                // Jika folder punya ID yang bukan local_, coba hapus dari API
                if (!String(folder.id).startsWith('local_')) {
                    await apiCall(`/repository_folders/${folder.id}`, 'DELETE');
                }
               
                // Hapus dari UI
                wrapper.style.transform = 'scale(0)';
                wrapper.style.opacity = '0';
                setTimeout(() => {
                    wrapper.remove();
                   
                    // Hapus dari cache
                    const cachedFolders = getFolderList();
                    const updatedFolders = cachedFolders.filter(f =>
                        f.id !== folder.id && f.id !== folder.local_id
                    );
                    saveFolderList(updatedFolders);
                   
                    // Hapus file yang terkait (jika ada di localStorage)
                    const repoFiles = getRepoFiles();
                    const folderName = folder.folder_name || folder.name;
                    if (repoFiles[folderName]) {
                        delete repoFiles[folderName];
                        saveRepoFiles(repoFiles);
                    }
                   
                    window.repoUI.showToast('Folder dihapus');
                }, 300);
            } catch (error) {
                console.error('Error deleting folder:', error);
               
                // Fallback: hapus dari cache saja
                wrapper.style.transform = 'scale(0)';
                wrapper.style.opacity = '0';
                setTimeout(() => {
                    wrapper.remove();
                   
                    const cachedFolders = getFolderList();
                    const updatedFolders = cachedFolders.filter(f =>
                        f.id !== folder.id && f.id !== folder.local_id
                    );
                    saveFolderList(updatedFolders);
                   
                    const repoFiles = getRepoFiles();
                    const folderName = folder.folder_name || folder.name;
                    if (repoFiles[folderName]) {
                        delete repoFiles[folderName];
                        saveRepoFiles(repoFiles);
                    }
                   
                    window.repoUI.showToast('Folder dihapus (offline)');
                }, 300);
            }
        });
    });


    renameBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        renameFolder(wrapper, folder);
    });


    card.addEventListener('click', () => openFolder(folder));
}


// Function rename folder - DIUBAH
async function renameFolder(wrapper, folder) {
    const oldName = folder.folder_name || folder.name;
   
    window.repoUI.openRenameModal(oldName, async (newName) => {
        if (!newName || newName.trim() === '') {
            window.repoUI.showToast('Nama folder tidak boleh kosong');
            return;
        }
       
        if (newName.length > 15) {
            window.repoUI.showToast('Nama folder maksimal 15 karakter');
            return;
        }
       
        if (newName === oldName) {
            window.repoUI.showToast('Nama folder tidak berubah');
            return;
        }


        try {
            // Jika folder punya ID yang bukan local_, coba update via API
            if (!String(folder.id).startsWith('local_')) {
                const response = await apiCall(`/repository_folders/${folder.id}`, 'PUT', {
                    folder_name: newName,
                    color: folder.color
                });


                if (response.data) {
                    folder = response.data;
                }
            }
           
            // Update folder name in DOM
            const folderNameElement = wrapper.querySelector('.folder-name');
            folderNameElement.textContent = newName;
           
            // Update wrapper dataset
            wrapper.dataset.folderId = folder.id;
           
            // Update folder object
            folder.folder_name = newName;
            folder.name = newName;
           
            // Update cache
            const cachedFolders = getFolderList();
            const folderIndex = cachedFolders.findIndex(f =>
                f.id === folder.id || f.id === folder.local_id
            );
            if (folderIndex !== -1) {
                cachedFolders[folderIndex].name = newName;
                cachedFolders[folderIndex].folder_name = newName;
                saveFolderList(cachedFolders);
            }


            // Update files in localStorage if any
            const repoFiles = getRepoFiles();
            if (repoFiles[oldName]) {
                repoFiles[newName] = repoFiles[oldName];
                delete repoFiles[oldName];
                saveRepoFiles(repoFiles);
            }

            // Re-attach event handlers dengan data folder yang diperbarui
            attachFolderEventHandlers(wrapper, folder);


            window.repoUI.showToast(`Folder diubah menjadi "${newName}"`);
        } catch (error) {
            console.error('Error renaming folder:', error);
           
            // Fallback: update cache saja
            const folderNameElement = wrapper.querySelector('.folder-name');
            folderNameElement.textContent = newName;
           
            folder.folder_name = newName;
            folder.name = newName;
           
            const cachedFolders = getFolderList();
            const folderIndex = cachedFolders.findIndex(f =>
                f.id === folder.id || f.id === folder.local_id
            );
            if (folderIndex !== -1) {
                cachedFolders[folderIndex].name = newName;
                saveFolderList(cachedFolders);
            }


            const repoFiles = getRepoFiles();
            if (repoFiles[oldName]) {
                repoFiles[newName] = repoFiles[oldName];
                delete repoFiles[oldName];
                saveRepoFiles(repoFiles);
            }

            attachFolderEventHandlers(wrapper, folder);

            window.repoUI.showToast(`Folder diubah menjadi "${newName}" (offline)`);
        }
    });
}


function initializeExistingFolders() {
    $$('.card-wrapper:not(:last-child)').forEach(wrapper => {
        const folderName = wrapper.querySelector('.folder-name').textContent;
        const folderId = wrapper.dataset.folderId || 'local_' + Date.now();
       
        // Tambahkan tombol rename jika belum ada
        if (!wrapper.querySelector('.rename-folder')) {
            const deleteBtn = wrapper.querySelector('.delete-folder');
            if (deleteBtn) {
                // Buat container untuk actions
                const folderActions = document.createElement('div');
                folderActions.className = 'folder-actions';
               
                // Buat tombol rename
                const renameBtn = document.createElement('button');
                renameBtn.className = 'rename-folder';
                renameBtn.title = 'Rename Folder';
                renameBtn.innerHTML = `<i class='bx bx-edit-alt'></i>`;
               
                // Pindahkan delete button ke container
                deleteBtn.remove();
               
                // Tambahkan kedua tombol ke container
                folderActions.appendChild(renameBtn);
                folderActions.appendChild(deleteBtn);
               
                // Tambahkan container ke card
                wrapper.querySelector('.card').appendChild(folderActions);
            }
        }
       
        attachFolderEventHandlers(wrapper, {
            id: folderId,
            name: folderName,
            folder_name: folderName
        });
    });
}


// saving files - DIUBAH untuk menggunakan API backend
async function saveFilesToFolder(folderName, files) {
    console.log('🗂️ saveFilesToFolder called:', { folderName, filesCount: files.length, currentOpenedFolder });
    
    if (!folderName || !currentOpenedFolder) {
        console.error('❌ Missing folderName or currentOpenedFolder');
        return;
    }
    
    const folderId = currentOpenedFolder.id;
    console.log('📁 Folder ID:', folderId, 'Type:', typeof folderId);
    
    // Cek apakah folder valid (konversi ke string untuk pengecekan)
    if (!folderId || String(folderId).startsWith('local_')) {
        // Jika folder hanya ada di localStorage, gunakan localStorage fallback
        console.warn('⚠️ Folder belum tersimpan di server, menggunakan localStorage');
        return saveFilesToFolderLocal(folderName, files);
    }
    
    console.log('✅ Folder valid, uploading to backend...');

    // user_id tidak perlu dikirim, sudah dari JWT token di backend
    
    for (const file of files) {
        // size check: skip extremely big files and show toast
        if (file.size > 6 * 1024 * 1024) { // 6MB
            window.repoUI.showToast('File terlalu besar (max 6MB) — pilih file lebih kecil');
            continue;
        }
        
        try {
            // Convert file to base64
            const dataUrl = await fileToBase64(file);
            
            // Kirim ke backend API
            const response = await apiCall('/repository_files', 'POST', {
                folder_id: folderId,
                file_name: file.name,
                file_url: dataUrl, // Simpan sebagai data URL untuk sekarang
                file_type: file.type || 'application/octet-stream',
                file_size: file.size
            });

            console.log('File uploaded to server:', response);
            window.repoUI.showToast(`File "${file.name}" berhasil diupload`);
            
        } catch (e) {
            console.error('Upload error:', e);
            window.repoUI.showToast('Gagal mengupload file: ' + file.name);
            
            // Fallback ke localStorage jika API gagal
            console.warn('Fallback to localStorage for file:', file.name);
            await saveFilesToFolderLocal(folderName, [file]);
        }
    }
}

// Fallback function untuk localStorage (tetap pertahankan untuk backward compatibility)
async function saveFilesToFolderLocal(folderName, files) {
    if (!folderName) return;
    const repo = getRepoFiles();
    if (!repo[folderName]) repo[folderName] = [];


    for (const file of files) {
        // size check: skip extremely big files and show toast
        if (file.size > 6 * 1024 * 1024) { // 6MB
            window.repoUI.showToast('File terlalu besar (max 6MB) — pilih file lebih kecil');
            continue;
        }
        try {
            const dataUrl = await fileToBase64(file);
            const entry = {
                id: Date.now().toString(36) + Math.random().toString(36).slice(2,6),
                name: file.name,
                type: file.type || '',
                uploadedAt: new Date().toLocaleString(),
                dataUrl
            };
            repo[folderName].push(entry);
        } catch (e) {
            console.error('convert error', e);
            window.repoUI.showToast('Gagal memproses file: ' + file.name);
        }
    }
    saveRepoFiles(repo);
}


// Open folder - DIUBAH
let currentOpenedFolder = null;


function openFolder(folder) {
    currentOpenedFolder = folder;


    // Hapus konten modal yang lama
    const modalContent = filesModal.querySelector('.modal-content');
    modalContent.innerHTML = '';


    // Buat header yang simple di tengah
    const headerDiv = document.createElement('div');
    headerDiv.style.textAlign = 'center';
    headerDiv.style.marginBottom = '25px';
    headerDiv.style.paddingBottom = '15px';
    headerDiv.style.borderBottom = '2px solid #f0f0f0';


    const title = document.createElement('h3');
    title.textContent = folder.folder_name || folder.name;
    title.style.fontSize = '24px';
    title.style.fontWeight = '700';
    title.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    title.style.webkitBackgroundClip = 'text';
    title.style.webkitTextFillColor = 'transparent';
    title.style.marginBottom = '8px';


    // Container untuk tombol tambah file
    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginTop = '15px';


    const addButton = document.createElement('button');
    addButton.innerHTML = '<i class="fas fa-plus"></i> Tambah File';
    addButton.style.padding = '10px 20px';
    addButton.style.background = 'var(--primary-color)';
    addButton.style.color = '#fff';
    addButton.style.border = 'none';
    addButton.style.borderRadius = '8px';
    addButton.style.cursor = 'pointer';
    addButton.style.fontSize = '14px';
    addButton.style.fontWeight = '600';
    addButton.style.transition = 'all 0.3s ease';


    addButton.addEventListener('mouseenter', () => {
        addButton.style.background = '#5a6fd8';
        addButton.style.transform = 'translateY(-2px)';
    });


    addButton.addEventListener('mouseleave', () => {
        addButton.style.background = 'var(--primary-color)';
        addButton.style.transform = 'translateY(0)';
    });


    addButton.addEventListener('click', () => {
        fileInput.value = '';
        fileInput.click();
    });


    // Buat ul untuk file list
    const fileListEl = document.createElement('ul');
    fileListEl.id = 'fileList';
    fileListEl.style.textAlign = 'left';
    fileListEl.style.maxHeight = '400px';
    fileListEl.style.overflowY = 'auto';
    fileListEl.style.marginTop = '20px';


    // Tombol tutup
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Tutup';
    closeButton.style.padding = '10px 20px';
    closeButton.style.background = '#ddd';
    closeButton.style.color = '#333';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '8px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '14px';
    closeButton.style.fontWeight = '600';
    closeButton.style.marginTop = '20px';
    closeButton.style.transition = 'all 0.3s ease';


    closeButton.addEventListener('mouseenter', () => {
        closeButton.style.background = '#bbb';
    });


    closeButton.addEventListener('mouseleave', () => {
        closeButton.style.background = '#ddd';
    });


    closeButton.addEventListener('click', () => {
        filesModal.style.display = 'none';
    });


    // Susun elemen-elemen
    headerDiv.appendChild(title); // HANYA title saja, subtitle dihapus
    buttonContainer.appendChild(addButton);
   
    modalContent.appendChild(headerDiv);
    modalContent.appendChild(buttonContainer);
    modalContent.appendChild(fileListEl);
    modalContent.appendChild(closeButton);


    renderFilesInModal(folder);
    filesModal.style.display = 'flex';
}


//render files - DIUBAH untuk load dari backend
async function renderFilesInModal(folder) {
    const folderName = folder.folder_name || folder.name;
    const folderId = folder.id;
    const fileListEl = document.getElementById('fileList');
    fileListEl.innerHTML = '<li style="text-align:center;padding:20px;list-style:none;color:#666;">Loading files...</li>';
    
    let files = [];
    
    // Coba load dari backend API dulu (hindari startsWith pada number)
    const isLocalId = typeof folderId === 'string' && folderId.startsWith('local_');
    if (folderId && !isLocalId) {
        try {
            const response = await apiCall(`/repository_files/${folderId}`, 'GET');
            console.log('Files from server:', response);
            
            if (response && Array.isArray(response)) {
                files = response.map(f => ({
                    id: f.id,
                    name: f.file_name,
                    type: f.file_type,
                    uploadedAt: new Date(f.created_at).toLocaleString(),
                    dataUrl: f.file_url // Asumsi file_url berisi data URL atau URL file
                }));
            }
        } catch (error) {
            console.error('Error loading files from server:', error);
            // Fallback ke localStorage
            console.warn('Using localStorage fallback for files');
            const repo = getRepoFiles();
            files = repo[folderName] || [];
        }
    } else {
        // Jika folder lokal, pakai localStorage
        const repo = getRepoFiles();
        files = repo[folderName] || [];
    }
    
    fileListEl.innerHTML = '';


    if (!files.length) {
        fileListEl.innerHTML = `
            <li style='
                color: #666;
                padding: 20px;
                text-align: center;
                font-style: italic;
                list-style: none;
            '>
                Belum ada file dalam folder ini
            </li>`;
        return;
    }


    files.forEach(file => {
        const li = document.createElement('li');
        li.style.padding = '12px 8px';
        li.style.listStyle = 'none';
        li.style.borderBottom = '1px solid #f0f0f0';


        const cont = document.createElement('div');
        cont.style.display = 'flex';
        cont.style.justifyContent = 'space-between';
        cont.style.alignItems = 'center';
        cont.style.gap = '15px';


        const left = document.createElement('div');
        left.style.flex = '1';
        left.innerHTML = `
            <div style="font-weight:700; font-size:15px;">📄 ${escapeHtml(file.name)}</div>
            <div style="font-size:12px;color:#666; margin-top:4px;">${file.uploadedAt}</div>
        `;


        const right = document.createElement('div');
        right.style.display = 'flex';
        right.style.gap = '8px';


        const viewBtn = document.createElement('button');
        viewBtn.textContent = 'Lihat';
        viewBtn.style.padding = '8px 12px';
        viewBtn.style.borderRadius = '6px';
        viewBtn.style.background = 'var(--primary-color)';
        viewBtn.style.color = '#fff';
        viewBtn.style.border = 'none';
        viewBtn.style.cursor = 'pointer';
        viewBtn.style.fontSize = '12px';
        viewBtn.style.fontWeight = '600';
        viewBtn.style.transition = 'all 0.3s ease';


        viewBtn.addEventListener('mouseenter', () => {
            viewBtn.style.background = '#5a6fd8';
            viewBtn.style.transform = 'translateY(-1px)';
        });


        viewBtn.addEventListener('mouseleave', () => {
            viewBtn.style.background = 'var(--primary-color)';
            viewBtn.style.transform = 'translateY(0)';
        });


        viewBtn.addEventListener('click', () => {
            window.repoUI.openPreview({name: file.name, mime: file.type, dataUrl: file.dataUrl});
        });


        const delBtn = document.createElement('button');
        delBtn.textContent = 'Hapus';
        delBtn.style.padding = '8px 12px';
        delBtn.style.borderRadius = '6px';
        delBtn.style.background = '#ff6b6b';
        delBtn.style.color = '#fff';
        delBtn.style.border = 'none';
        delBtn.style.cursor = 'pointer';
        delBtn.style.fontSize = '12px';
        delBtn.style.fontWeight = '600';
        delBtn.style.transition = 'all 0.3s ease';


        delBtn.addEventListener('mouseenter', () => {
            delBtn.style.background = '#ff5252';
            delBtn.style.transform = 'translateY(-1px)';
        });


        delBtn.addEventListener('mouseleave', () => {
            delBtn.style.background = '#ff6b6b';
            delBtn.style.transform = 'translateY(0)';
        });


        delBtn.addEventListener('click', () => {
            window.repoUI.openConfirm(`Hapus file "${file.name}"?`, () => {
                deleteFileFromFolder(folderName, file.id);
            });
        });


        right.appendChild(viewBtn);
        right.appendChild(delBtn);
        cont.appendChild(left);
        cont.appendChild(right);
        li.appendChild(cont);
        fileListEl.appendChild(li);
    });
}


// delete file - DIUBAH untuk menghapus dari backend
async function deleteFileFromFolder(folderName, fileId) {
    // Cek apakah fileId adalah ID dari server (numerik) atau localStorage (string)
    const isServerFile = !isNaN(fileId) && Number.isInteger(Number(fileId));
    
    if (isServerFile) {
        // Hapus dari backend
        try {
            await apiCall(`/repository_files/${fileId}`, 'DELETE');
            console.log('File deleted from server:', fileId);
            window.repoUI.showToast('File dihapus dari server');
        } catch (error) {
            console.error('Error deleting file from server:', error);
            window.repoUI.showToast('Gagal menghapus file dari server');
            // Tetap hapus dari localStorage sebagai fallback
        }
    }
    
    // Hapus dari localStorage (untuk backward compatibility)
    const repo = getRepoFiles();
    if (repo[folderName]) {
        repo[folderName] = repo[folderName].filter(f => f.id !== fileId);
        saveRepoFiles(repo);
    }
    
    // Refresh tampilan
    await renderFilesInModal(currentOpenedFolder);
    window.repoUI.showToast('File dihapus');
}


// hook file input
if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
        console.log('📎 File input changed!', e.target.files);
        const files = Array.from(e.target.files || []);
        console.log('📎 Files array:', files.length, 'files');
        if (!files.length) {
            console.log('❌ No files selected');
            return;
        }
        console.log('📁 Current opened folder:', currentOpenedFolder);
        if (!currentOpenedFolder) {
            window.repoUI.showToast('Klik folder dulu untuk memilih tujuan file.');
            fileInput.value = '';
            return;
        }
        console.log('🚀 Calling saveFilesToFolder...');
        await saveFilesToFolder(currentOpenedFolder.folder_name || currentOpenedFolder.name, files);
        console.log('✅ saveFilesToFolder completed');
        renderFilesInModal(currentOpenedFolder);
        if (uploadModal) uploadModal.style.display = 'none';
        fileInput.value = '';
        window.repoUI.showToast('File ditambahkan');
    });
} else {
    console.error('❌ fileInput element not found!');
}


// add-folder button wiring
if (addBtn) {
    addBtn.addEventListener('click', () => {
        if (addFolderModal) {
            addFolderModal.style.display = 'flex';
            newFolderName.value = '';
            newFolderName.focus();
           
            // Reset counter
            const charCount = document.querySelector('.char-count');
            if (charCount) {
                charCount.textContent = '0/15 karakter';
                charCount.classList.remove('warning', 'limit-reached');
                newFolderName.classList.remove('limit-reached');
            }
        } else {
            // fallback: prompt like UI (but we avoid native prompt)
            const name = prompt('Nama folder baru (maks. 15 karakter):');
            if (name) {
                const trimmedName = name.trim();
                if (trimmedName.length > 15) {
                    window.repoUI.showToast('Nama folder maksimal 15 karakter');
                } else {
                    createFolder(trimmedName);
                }
            }
        }
    });
}


// Initialize character counters
let charCountElement = null;
document.addEventListener('DOMContentLoaded', function() {
    charCountElement = initializeCharacterCounter();
    initializeRenameCharacterCounter();
});


// modal add folder buttons
if (cancelFolderBtn) {
    cancelFolderBtn.addEventListener('click', () => {
        if (addFolderModal) {
            addFolderModal.style.display='none';
           
            // Reset counter
            if (charCountElement) {
                charCountElement.textContent = '0/15 karakter';
                charCountElement.classList.remove('warning', 'limit-reached');
                newFolderName.classList.remove('limit-reached');
            }
        }
    });
}


if (createFolderBtn) {
    createFolderBtn.addEventListener('click', async () => {
        const name = (newFolderName.value||'').trim();
       
        if (!name) {
            window.repoUI.showToast('Nama folder tidak boleh kosong');
            return;
        }
       
        if (name.length > 15) {
            window.repoUI.showToast('Nama folder maksimal 15 karakter');
            newFolderName.classList.add('limit-reached');
            if (charCountElement) {
                charCountElement.classList.add('limit-reached');
            }
            return;
        }
       
        await createFolder(name);
        if (addFolderModal) addFolderModal.style.display='none';
       
        // Reset counter
        if (charCountElement) {
            charCountElement.textContent = '0/15 karakter';
            charCountElement.classList.remove('warning', 'limit-reached');
            newFolderName.classList.remove('limit-reached');
        }
    });
}


// upload modal cancel
if (cancelUpload) {
    cancelUpload.addEventListener('click', () => {
        if (uploadModal) uploadModal.style.display='none';
        if (fileInput) fileInput.value = '';
    });
}


// confirmUpload (if used)
if (confirmUpload) {
    confirmUpload.addEventListener('click', async () => {
        const files = Array.from(fileInput.files || []);
        if (!files.length) { window.repoUI.showToast('Pilih file dulu'); return; }
        if (!currentOpenedFolder) { window.repoUI.showToast('Pilih folder dulu'); return; }
        await saveFilesToFolder(currentOpenedFolder.folder_name || currentOpenedFolder.name, files);
        if (uploadModal) uploadModal.style.display='none';
        fileInput.value = '';
        renderFilesInModal(currentOpenedFolder);
        window.repoUI.showToast('File diunggah');
    });
}


// click outside to close for existing modals
window.addEventListener('click', (e) => {
    if (e.target === addFolderModal) {
        addFolderModal.style.display = 'none';
        // Reset counter
        if (charCountElement) {
            charCountElement.textContent = '0/15 karakter';
            charCountElement.classList.remove('warning', 'limit-reached');
            newFolderName.classList.remove('limit-reached');
        }
    }
    if (e.target === uploadModal) uploadModal.style.display = 'none';
    if (e.target === filesModal) filesModal.style.display = 'none';
    if (e.target === $('#renameModal')) $('#renameModal').style.display = 'none';
});


// -------------------- escape html --------------------
function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/[&<>"']/g, (m)=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}


// Load folders dari backend saat halaman dimuat
async function loadFoldersFromBackend() {
    try {
        console.log('Loading folders from backend...');
       
        const response = await apiCall('/repository_folders');
        console.log('Folders response:', response);
       
        if (Array.isArray(response)) {
            // Simpan ke cache
            const foldersForCache = response.map(folder => ({
                id: folder.id,
                name: folder.folder_name,
                folder_name: folder.folder_name,
                color: folder.color
            }));
            saveFolderList(foldersForCache);
           
            // Tampilkan folder
            const addWrapper = addBtn.closest('.card-wrapper');
           
            // Hapus folder yang ada (kecuali tombol tambah)
            $$('.card-wrapper:not(:last-child)').forEach(w => w.remove());
           
            // Tampilkan folder dari backend
            response.forEach(folder => createFolderFromData(folder));
           
            return response;
        }
        return [];
    } catch (error) {
        console.error('Error loading folders from backend:', error);
       
        // Fallback ke cache lokal
        const cachedFolders = getFolderList();
        if (cachedFolders.length > 0) {
            console.log('Using cached folders:', cachedFolders);
           
            const addWrapper = addBtn.closest('.card-wrapper');
            $$('.card-wrapper:not(:last-child)').forEach(w => w.remove());
           
            cachedFolders.forEach(folder => createFolderFromData(folder));
           
            window.repoUI.showToast('Menggunakan data offline');
        }
       
        return [];
    }
}


// init (load folders & attach handlers)
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize existing folders di DOM (jika ada dari HTML)
    initializeExistingFolders();
   
    // Load folders dari backend
    await loadFoldersFromBackend();
   
    // Tambahkan folder dari cache jika masih ada yang belum ditampilkan
    const cachedFolders = getFolderList();
    const displayedFolderIds = $$('.card-wrapper:not(:last-child)').map(w => w.dataset.folderId);
   
    cachedFolders.forEach(folder => {
        if (!displayedFolderIds.includes(folder.id) && !displayedFolderIds.includes(folder.local_id)) {
            createFolderFromData(folder);
        }
    });


    // small animation for cards (optional)
    $$('.card-wrapper').forEach((wrapper, i) => {
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'translateY(20px)';
        setTimeout(()=> {
            wrapper.style.transition = 'all 0.45s ease';
            wrapper.style.opacity = '1';
            wrapper.style.transform = 'translateY(0)';
        }, i*80);
    });


    // Preload demo file into folder "Satu" if available and not already present
    if (demoFileUrl) {
        try {
            const resp = await fetch(demoFileUrl);
            if (resp.ok) {
                const blob = await resp.blob();
                const filename = demoFileUrl.split('/').pop();
                const fileObj = new File([blob], filename, { type: blob.type || 'image/jpeg' });
                const folders = getFolderList();
               
                // Cari atau buat folder "Satu"
                let satuFolder = folders.find(f => f.name === 'Satu');
                if (!satuFolder) {
                    // Buat folder "Satu" di backend
                    await createFolder('Satu');
                    // Reload folders
                    await loadFoldersFromBackend();
                }
               
                const repo = getRepoFiles();
                if (!repo['Satu'] || !repo['Satu'].find(x => x.name === filename)) {
                    await saveFilesToFolder('Satu', [fileObj]);
                    console.log('Demo file preloaded');
                }
            }
        } catch (e) {
            // ignore fetch errors when running locally without tool support
            console.warn('Demo preload failed', e);
        }
    }
});

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


console.log("repository-final.js loaded");
const demoFileUrl = "/mnt/data/ad2af446-efbf-4ff0-91c8-df4e3d487831.jpg";
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));


// API Configuration
const API_BASE_URL = 'http://localhost:3000/api'; // Sesuaikan dengan URL backend Anda


// Helper functions for API calls
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };


        if (data && (method === 'POST' || method === 'PUT')) {
            config.body = JSON.stringify(data);
        }


        console.log(`API ${method} ${endpoint}`, data);
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
       
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }


        return await response.json();
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
}


// Fungsi untuk mendapatkan user_id (contoh - sesuaikan dengan implementasi autentikasi Anda)
function getCurrentUserId() {
    // Ganti dengan cara Anda mendapatkan user ID
    // Contoh dari localStorage atau session
    const userId = localStorage.getItem('userId') || '1'; // Default untuk testing
    console.log('Current User ID:', userId);
    return userId;
}


(function createUIHelpers() {
   // Confirm modal
    const confirmModal = document.createElement('div');
    confirmModal.id = 'confirmModal';
    confirmModal.className = 'modal';
    confirmModal.innerHTML = `
    <div class="modal-content" style="width:360px;max-width:92%">
        <h3 id="confirmModalText" style="text-align:center;margin-bottom:20px;font-size:18px;color:#333;"></h3>
        <div style="display:flex;gap:12px;justify-content:center;margin-top:20px;">
        <button id="confirmCancelBtn" style="
            background:#ddd;
            color:#333;
            padding:10px 24px;
            border-radius:8px;
            border:none;
            cursor:pointer;
            font-weight:600;
            font-size:14px;
            transition:all 0.3s ease;
            min-width:80px;
        ">Batal</button>
        <button id="confirmOkBtn" style="
            background:#ff6b6b;
            color:#fff;
            padding:10px 24px;
            border-radius:8px;
            border:none;
            cursor:pointer;
            font-weight:600;
            font-size:14px;
            transition:all 0.3s ease;
            min-width:80px;
        ">Hapus</button>
        </div>
    </div>
    `;


    // Tambahkan event listeners untuk hover effects
    document.addEventListener('DOMContentLoaded', function() {
    const cancelBtn = document.getElementById('confirmCancelBtn');
    const okBtn = document.getElementById('confirmOkBtn');
   
    if (cancelBtn) {
        cancelBtn.addEventListener('mouseenter', function() {
        this.style.background = '#bbb';
        this.style.transform = 'translateY(-1px)';
        });
        cancelBtn.addEventListener('mouseleave', function() {
        this.style.background = '#ddd';
        this.style.transform = 'translateY(0)';
        });
    }
   
    if (okBtn) {
        okBtn.addEventListener('mouseenter', function() {
        this.style.background = '#ff5252';
        this.style.transform = 'translateY(-1px)';
        });
        okBtn.addEventListener('mouseleave', function() {
        this.style.background = '#ff6b6b';
        this.style.transform = 'translateY(0)';
        });
    }
    });
   
    document.body.appendChild(confirmModal);


    // Toast
    const toast = document.createElement('div');
    toast.id = 'repoToast';
    toast.style.position = 'fixed';
    toast.style.right = '20px';
    toast.style.bottom = '20px';
    toast.style.padding = '10px 14px';
    toast.style.background = 'rgba(0,0,0,0.75)';
    toast.style.color = '#fff';
    toast.style.borderRadius = '8px';
    toast.style.fontSize = '14px';
    toast.style.display = 'none';
    document.body.appendChild(toast);


    // Small preview modal (in-modal preview optional)
    const previewModal = document.createElement('div');
    previewModal.id = 'previewModal';
    previewModal.className = 'modal';
    previewModal.innerHTML = `
      <div class="modal-content" style="width:80%; max-width:900px;">
        <h3 id="previewModalTitle"></h3>
        <div id="previewModalBody" style="min-height:200px;max-height:70vh;overflow:auto;margin-top:8px;"></div>
        <div style="display:flex; justify-content:flex-end; gap:8px; margin-top:12px;">
          <a id="previewDownload" href="#" download style="text-decoration:none;"><button style="background:var(--primary-color);color:#fff;padding:8px 12px;border-radius:8px;">Download</button></a>
          <button id="previewClose" style="background:#ddd;padding:8px 12px;border-radius:8px;">Tutup</button>
        </div>
      </div>
    `;
    document.body.appendChild(previewModal);


    // Rename Modal
    const renameModal = document.createElement('div');
    renameModal.id = 'renameModal';
    renameModal.className = 'modal';
    renameModal.innerHTML = `
      <div class="modal-content" style="width:400px;max-width:92%">
        <h3>Rename Folder</h3>
        <input type="text" id="renameInput" placeholder="Nama folder baru... (maks. 15 karakter)">
        <div class="char-count" id="renameCharCount">0/15 karakter</div>
        <div class="modal-buttons">
          <button id="cancelRename" style="background:#ddd;padding:8px 12px;border-radius:8px;">Batal</button>
          <button id="confirmRename" style="background:var(--primary-color);color:#fff;padding:8px 12px;border-radius:8px;">Simpan</button>
        </div>
      </div>
    `;
    document.body.appendChild(renameModal);


    // basic modal styles (minimal, so it behaves like your other modals)
    const style = document.createElement('style');
    style.textContent = `
      .modal { display:none; position:fixed; inset:0; background:rgba(0,0,0,0.45); backdrop-filter: blur(3px); justify-content:center; align-items:center; z-index:4000; }
      .modal .modal-content { background:#fff; border-radius:12px; padding:18px; box-shadow:0 10px 30px rgba(0,0,0,0.12); }
    `;
    document.head.appendChild(style);


    // wiring
    confirmModal.addEventListener('click', (e) => { if (e.target === confirmModal) confirmModal.style.display='none'; });
    $('#confirmCancelBtn').addEventListener('click', () => confirmModal.style.display='none');


    previewModal.addEventListener('click', (e) => { if (e.target === previewModal) previewModal.style.display='none'; });
    $('#previewClose').addEventListener('click', () => previewModal.style.display='none');


    renameModal.addEventListener('click', (e) => { if (e.target === renameModal) renameModal.style.display='none'; });
    $('#cancelRename').addEventListener('click', () => renameModal.style.display='none');


    // expose functions
    window.repoUI = {
        openConfirm(text, onOk) {
            $('#confirmModal').style.display = 'flex';
            $('#confirmModalText').textContent = text;
            const okBtn = $('#confirmOkBtn');
            function handler() {
                $('#confirmModal').style.display = 'none';
                okBtn.removeEventListener('click', handler);
                onOk && onOk();
            }
            okBtn.addEventListener('click', handler);
        },
        showToast(text, ms = 1800) {
            const t = $('#repoToast');
            t.textContent = text;
            t.style.display = 'block';
            clearTimeout(t._timer);
            t._timer = setTimeout(()=> t.style.display = 'none', ms);
        },
        openPreview({name, mime, dataUrl, url}) {
            const title = $('#previewModalTitle');
            const body = $('#previewModalBody');
            const dl = $('#previewDownload');
            title.textContent = name;
            body.innerHTML = '';


            if (url) {
                // server URL
                if ((mime && mime.startsWith('image/')) || /\.(png|jpg|jpeg|gif|bmp)$/i.test(name)) {
                    const img = document.createElement('img');
                    img.src = url;
                    img.style.maxWidth = '100%';
                    body.appendChild(img);
                } else if (mime === 'application/pdf' || name.toLowerCase().endsWith('.pdf')) {
                    const iframe = document.createElement('iframe');
                    iframe.src = url;
                    iframe.style.width = '100%';
                    iframe.style.height = '70vh';
                    iframe.frameBorder = 0;
                    body.appendChild(iframe);
                } else {
                    body.innerHTML = `<p>Preview tidak tersedia. Gunakan tombol download.</p>`;
                }
                dl.href = url;
                dl.setAttribute('download', name);
            } else if (dataUrl) {
                // use blob URL for dataUrl
                try {
                    const blob = dataURLToBlob(dataUrl);
                    const objUrl = URL.createObjectURL(blob);
                    if (mime && mime.startsWith('image/')) {
                        const img = document.createElement('img');
                        img.src = objUrl;
                        img.style.maxWidth = '100%';
                        body.appendChild(img);
                    } else if (mime === 'application/pdf' || name.toLowerCase().endsWith('.pdf')) {
                        const iframe = document.createElement('iframe');
                        iframe.src = objUrl;
                        iframe.style.width = '100%';
                        iframe.style.height = '70vh';
                        iframe.frameBorder = 0;
                        body.appendChild(iframe);
                    } else if (mime && mime.startsWith('text/')) {
                        blob.text().then(txt => {
                            const pre = document.createElement('pre');
                            pre.textContent = txt;
                            pre.style.whiteSpace = 'pre-wrap';
                            body.appendChild(pre);
                        });
                    } else {
                        body.innerHTML = `<p>Preview tidak tersedia. Gunakan tombol download.</p>`;
                    }
                    dl.href = objUrl;
                    dl.setAttribute('download', name);
                    // revoke when modal closed
                    $('#previewClose').onclick = () => { URL.revokeObjectURL(objUrl); previewModal.style.display='none'; };
                } catch (e) {
                    body.innerHTML = `<p>Preview gagal.</p>`;
                    dl.href = dataUrl;
                    dl.setAttribute('download', name);
                }
            } else {
                body.innerHTML = `<p>Tidak ada data untuk preview.</p>`;
                dl.removeAttribute('href');
            }


            previewModal.style.display = 'flex';
        },
        openRenameModal(oldName, onRename) {
            $('#renameModal').style.display = 'flex';
            $('#renameInput').value = oldName;
            $('#renameCharCount').textContent = `${oldName.length}/15 karakter`;
            $('#renameCharCount').className = 'char-count';
            $('#renameInput').classList.remove('limit-reached');
           
            if (oldName.length >= 10 && oldName.length < 15) {
                $('#renameCharCount').classList.add('warning');
            } else if (oldName.length >= 15) {
                $('#renameCharCount').classList.add('limit-reached');
                $('#renameInput').classList.add('limit-reached');
            }
           
            $('#renameInput').focus();
            $('#renameInput').select();
           
            const confirmBtn = $('#confirmRename');
            const cancelBtn = $('#cancelRename');
           
            function confirmHandler() {
                const newName = $('#renameInput').value.trim();
                $('#renameModal').style.display = 'none';
                confirmBtn.removeEventListener('click', confirmHandler);
                cancelBtn.removeEventListener('click', cancelHandler);
                onRename && onRename(newName);
            }
           
            function cancelHandler() {
                $('#renameModal').style.display = 'none';
                confirmBtn.removeEventListener('click', confirmHandler);
                cancelBtn.removeEventListener('click', cancelHandler);
            }
           
            confirmBtn.addEventListener('click', confirmHandler);
            cancelBtn.addEventListener('click', cancelHandler);
           
            // Enter key support
            $('#renameInput').onkeypress = function(e) {
                if (e.key === 'Enter') {
                    confirmHandler();
                }
            };
        }
    };
})();


// utilities
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.onerror = reject;
        r.readAsDataURL(file);
    });
}


function dataURLToBlob(dataurl) {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8 = new Uint8Array(n);
    while (n--) u8[n] = bstr.charCodeAt(n);
    return new Blob([u8], {type: mime});
}


// Tetap pertahankan localStorage untuk file (sementara)
// Nanti bisa diganti dengan API backend untuk file
function getRepoFiles() {
    try { return JSON.parse(localStorage.getItem('repoFiles')||'{}'); } catch { return {}; }
}
function saveRepoFiles(obj) {
    localStorage.setItem('repoFiles', JSON.stringify(obj));
}


// Fungsi untuk menyimpan folder ke localStorage (cache)
function saveFolderList(folders) {
    localStorage.setItem('repositoryFolders', JSON.stringify(folders));
}


// Fungsi untuk mengambil folder dari cache
function getFolderList() {
    try { return JSON.parse(localStorage.getItem('repositoryFolders')||'[]'); } catch { return []; }
}


// DOM elements
const grid = document.querySelector('.grid');
const addBtn = document.getElementById('addBtn');


const addFolderModal = document.getElementById('addFolderModal');
const createFolderBtn = document.getElementById('confirmAddFolder');
const cancelFolderBtn = document.getElementById('cancelAddFolder');
const newFolderName = document.getElementById('folderInput');


const uploadModal = document.getElementById('uploadModal');
const fileInput = document.getElementById('fileInput');
const cancelUpload = document.getElementById('cancelUpload');
const confirmUpload = document.getElementById('confirmUpload');


const filesModal = document.getElementById('filesModal');
const fileList = document.getElementById('fileList');
const folderTitle = document.getElementById('folderTitle');
const closeFilesModal = document.getElementById('closeFilesModal');


// ensure essential elements exist
if (!grid) console.warn("Grid not found");
if (!filesModal) console.warn("filesModal not found");


// Character counter untuk folder name
function initializeCharacterCounter() {
    const folderInput = document.getElementById('folderInput');
    if (!folderInput) return;
   
    const charCount = document.createElement('div');
    charCount.className = 'char-count';
    charCount.textContent = '0/15 karakter';
    folderInput.parentNode.insertBefore(charCount, folderInput.nextSibling);


    // Event listener untuk membatasi input
    folderInput.addEventListener('input', function() {
        const maxLength = 15;
        const currentLength = this.value.length;
       
        // Update karakter count
        charCount.textContent = `${currentLength}/${maxLength} karakter`;
       
        // Hapus class sebelumnya
        charCount.classList.remove('warning', 'limit-reached');
        this.classList.remove('limit-reached');
       
        // Jika mendekati batas (10-14 karakter)
        if (currentLength >= 10 && currentLength < maxLength) {
            charCount.classList.add('warning');
        }
        // Jika mencapai atau melebihi batas
        else if (currentLength >= maxLength) {
            charCount.classList.add('limit-reached');
            this.classList.add('limit-reached');
           
            // Potong teks jika melebihi batas
            if (currentLength > maxLength) {
                this.value = this.value.substring(0, maxLength);
                charCount.textContent = `${maxLength}/${maxLength} karakter (maksimal)`;
                window.repoUI.showToast('Maksimal 15 karakter');
            }
        }
    });


    return charCount;
}


// Character counter untuk rename modal
function initializeRenameCharacterCounter() {
    const renameInput = document.getElementById('renameInput');
    if (!renameInput) return;
   
    const charCount = document.getElementById('renameCharCount');
   
    renameInput.addEventListener('input', function() {
        const maxLength = 15;
        const currentLength = this.value.length;
       
        // Update karakter count
        charCount.textContent = `${currentLength}/${maxLength} karakter`;
       
        // Hapus class sebelumnya
        charCount.classList.remove('warning', 'limit-reached');
        this.classList.remove('limit-reached');
       
        // Jika mendekati batas (10-14 karakter)
        if (currentLength >= 10 && currentLength < maxLength) {
            charCount.classList.add('warning');
        }
        // Jika mencapai atau melebihi batas
        else if (currentLength >= maxLength) {
            charCount.classList.add('limit-reached');
            this.classList.add('limit-reached');
           
            // Potong teks jika melebihi batas
            if (currentLength > maxLength) {
                this.value = this.value.substring(0, maxLength);
                charCount.textContent = `${maxLength}/${maxLength} karakter (maksimal)`;
                window.repoUI.showToast('Maksimal 15 karakter');
            }
        }
    });
}


// folder functions - DIUBAH untuk menggunakan API
async function createFolder(name) {
    // Validasi panjang nama
    if (name.length > 15) {
        window.repoUI.showToast('Nama folder maksimal 15 karakter');
        return;
    }


    try {
        const userId = getCurrentUserId();
        console.log('Creating folder:', { userId, name });
       
        const response = await apiCall('/folders', 'POST', {
            user_id: userId,
            folder_name: name,
            color: null
        });


        console.log('Folder creation response:', response);
       
        if (response.data) {
            const folder = response.data;
            displayFolder(folder);
           
            // Update cache lokal
            const cachedFolders = getFolderList();
            cachedFolders.push({
                id: folder.id,
                name: folder.folder_name,
                color: folder.color || `color-${(grid.querySelectorAll('.card-wrapper:not(:last-child)').length % 5) + 1}`
            });
            saveFolderList(cachedFolders);
           
            window.repoUI.showToast('Folder dibuat');
            return folder;
        }
    } catch (error) {
        console.error('Error creating folder:', error);
       
        // Fallback ke localStorage jika API gagal
        console.log('Using localStorage fallback for folder creation');
       
        // Check for duplicates in cache
        const folders = getFolderList();
        if (folders.find(f => f.name === name)) {
            window.repoUI.showToast('Folder sudah ada');
            return;
        }


        const wrapper = document.createElement('div');
        wrapper.className = 'card-wrapper';


        const numFolders = grid.querySelectorAll('.card-wrapper:not(:last-child)').length;
        const colorClass = `color-${(numFolders % 5) + 1}`;


        wrapper.innerHTML = `
            <div class="card ${colorClass}">
                <p class="folder-name">${escapeHtml(name)}</p>
                <div class="folder-actions">
                    <button class="rename-folder" title="Rename Folder">
                        <i class='bx bx-edit-alt'></i>
                    </button>
                    <button class="delete-folder">×</button>
                </div>
            </div>
        `;


        const addWrapper = addBtn.closest('.card-wrapper');
        grid.insertBefore(wrapper, addWrapper);


        // attach handlers
        attachFolderEventHandlers(wrapper, {
            id: 'local_' + Date.now(),
            folder_name: name
        });


        // persist to cache
        folders.push({
            id: 'local_' + Date.now(),
            name,
            color: colorClass
        });
        saveFolderList(folders);
       
        window.repoUI.showToast('Folder dibuat (offline)');
    }
}


function displayFolder(folder) {
    const wrapper = document.createElement('div');
    wrapper.className = 'card-wrapper';
    wrapper.dataset.folderId = folder.id;


    const colorClass = folder.color || `color-${(grid.querySelectorAll('.card-wrapper:not(:last-child)').length % 5) + 1}`;


    wrapper.innerHTML = `
        <div class="card ${colorClass}">
            <p class="folder-name">${escapeHtml(folder.folder_name)}</p>
            <div class="folder-actions">
                <button class="rename-folder" title="Rename Folder">
                    <i class='bx bx-edit-alt'></i>
                </button>
                <button class="delete-folder">×</button>
            </div>
        </div>
    `;


    const addWrapper = addBtn.closest('.card-wrapper');
    grid.insertBefore(wrapper, addWrapper);


    // attach handlers
    attachFolderEventHandlers(wrapper, folder);
}


function createFolderFromData(folder) {
    const wrapper = document.createElement('div');
    wrapper.className = 'card-wrapper';
    wrapper.dataset.folderId = folder.id || folder.local_id;
   
    const colorClass = folder.color || `color-${(grid.querySelectorAll('.card-wrapper:not(:last-child)').length % 5) + 1}`;


    wrapper.innerHTML = `
        <div class="card ${colorClass}">
            <p class="folder-name">${escapeHtml(folder.folder_name || folder.name)}</p>
            <div class="folder-actions">
                <button class="rename-folder" title="Rename Folder">
                    <i class='bx bx-edit-alt'></i>
                </button>
                <button class="delete-folder">×</button>
            </div>
        </div>
    `;
   
    const addWrapper = addBtn.closest('.card-wrapper');
    grid.insertBefore(wrapper, addWrapper);


    attachFolderEventHandlers(wrapper, folder);
}


// Function untuk attach event handlers ke folder - DIUBAH
function attachFolderEventHandlers(wrapper, folder) {
    const delBtn = wrapper.querySelector('.delete-folder');
    const renameBtn = wrapper.querySelector('.rename-folder');
    const card = wrapper.querySelector('.card');


    delBtn.addEventListener('click', async (e) => {
        e.stopPropagation();
        window.repoUI.openConfirm(`Hapus folder "${folder.folder_name || folder.name}"?`, async () => {
            try {
                // Jika folder punya ID yang bukan local_, coba hapus dari API
                if (!folder.id.startsWith('local_')) {
                    await apiCall(`/folders/${folder.id}`, 'DELETE');
                }
               
                // Hapus dari UI
                wrapper.style.transform = 'scale(0)';
                wrapper.style.opacity = '0';
                setTimeout(() => {
                    wrapper.remove();
                   
                    // Hapus dari cache
                    const cachedFolders = getFolderList();
                    const updatedFolders = cachedFolders.filter(f =>
                        f.id !== folder.id && f.id !== folder.local_id
                    );
                    saveFolderList(updatedFolders);
                   
                    // Hapus file yang terkait (jika ada di localStorage)
                    const repoFiles = getRepoFiles();
                    const folderName = folder.folder_name || folder.name;
                    if (repoFiles[folderName]) {
                        delete repoFiles[folderName];
                        saveRepoFiles(repoFiles);
                    }
                   
                    window.repoUI.showToast('Folder dihapus');
                }, 300);
            } catch (error) {
                console.error('Error deleting folder:', error);
               
                // Fallback: hapus dari cache saja
                wrapper.style.transform = 'scale(0)';
                wrapper.style.opacity = '0';
                setTimeout(() => {
                    wrapper.remove();
                   
                    const cachedFolders = getFolderList();
                    const updatedFolders = cachedFolders.filter(f =>
                        f.id !== folder.id && f.id !== folder.local_id
                    );
                    saveFolderList(updatedFolders);
                   
                    const repoFiles = getRepoFiles();
                    const folderName = folder.folder_name || folder.name;
                    if (repoFiles[folderName]) {
                        delete repoFiles[folderName];
                        saveRepoFiles(repoFiles);
                    }
                   
                    window.repoUI.showToast('Folder dihapus (offline)');
                }, 300);
            }
        });
    });


    renameBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        renameFolder(wrapper, folder);
    });


    card.addEventListener('click', () => openFolder(folder));
}


// Function rename folder - DIUBAH
async function renameFolder(wrapper, folder) {
    const oldName = folder.folder_name || folder.name;
   
    window.repoUI.openRenameModal(oldName, async (newName) => {
        if (!newName || newName.trim() === '') {
            window.repoUI.showToast('Nama folder tidak boleh kosong');
            return;
        }
       
        if (newName.length > 15) {
            window.repoUI.showToast('Nama folder maksimal 15 karakter');
            return;
        }
       
        if (newName === oldName) {
            window.repoUI.showToast('Nama folder tidak berubah');
            return;
        }


        try {
            // Jika folder punya ID yang bukan local_, coba update via API
            if (!folder.id.startsWith('local_')) {
                const response = await apiCall(`/folders/${folder.id}`, 'PUT', {
                    folder_name: newName,
                    color: folder.color
                });


                if (response.data) {
                    folder = response.data;
                }
            }
           
            // Update folder name in DOM
            const folderNameElement = wrapper.querySelector('.folder-name');
            folderNameElement.textContent = newName;
           
            // Update wrapper dataset
            wrapper.dataset.folderId = folder.id;
           
            // Update folder object
            folder.folder_name = newName;
            folder.name = newName;
           
            // Update cache
            const cachedFolders = getFolderList();
            const folderIndex = cachedFolders.findIndex(f =>
                f.id === folder.id || f.id === folder.local_id
            );
            if (folderIndex !== -1) {
                cachedFolders[folderIndex].name = newName;
                cachedFolders[folderIndex].folder_name = newName;
                saveFolderList(cachedFolders);
            }


            // Update files in localStorage if any
            const repoFiles = getRepoFiles();
            if (repoFiles[oldName]) {
                repoFiles[newName] = repoFiles[oldName];
                delete repoFiles[oldName];
                saveRepoFiles(repoFiles);
            }

            // Re-attach event handlers dengan data folder yang diperbarui
            attachFolderEventHandlers(wrapper, folder);


            window.repoUI.showToast(`Folder diubah menjadi "${newName}"`);
        } catch (error) {
            console.error('Error renaming folder:', error);
           
            // Fallback: update cache saja
            const folderNameElement = wrapper.querySelector('.folder-name');
            folderNameElement.textContent = newName;
           
            folder.folder_name = newName;
            folder.name = newName;
           
            const cachedFolders = getFolderList();
            const folderIndex = cachedFolders.findIndex(f =>
                f.id === folder.id || f.id === folder.local_id
            );
            if (folderIndex !== -1) {
                cachedFolders[folderIndex].name = newName;
                saveFolderList(cachedFolders);
            }


            const repoFiles = getRepoFiles();
            if (repoFiles[oldName]) {
                repoFiles[newName] = repoFiles[oldName];
                delete repoFiles[oldName];
                saveRepoFiles(repoFiles);
            }

            attachFolderEventHandlers(wrapper, folder);

            window.repoUI.showToast(`Folder diubah menjadi "${newName}" (offline)`);
        }
    });
}


function initializeExistingFolders() {
    $$('.card-wrapper:not(:last-child)').forEach(wrapper => {
        const folderName = wrapper.querySelector('.folder-name').textContent;
        const folderId = wrapper.dataset.folderId || 'local_' + Date.now();
       
        // Tambahkan tombol rename jika belum ada
        if (!wrapper.querySelector('.rename-folder')) {
            const deleteBtn = wrapper.querySelector('.delete-folder');
            if (deleteBtn) {
                // Buat container untuk actions
                const folderActions = document.createElement('div');
                folderActions.className = 'folder-actions';
               
                // Buat tombol rename
                const renameBtn = document.createElement('button');
                renameBtn.className = 'rename-folder';
                renameBtn.title = 'Rename Folder';
                renameBtn.innerHTML = `<i class='bx bx-edit-alt'></i>`;
               
                // Pindahkan delete button ke container
                deleteBtn.remove();
               
                // Tambahkan kedua tombol ke container
                folderActions.appendChild(renameBtn);
                folderActions.appendChild(deleteBtn);
               
                // Tambahkan container ke card
                wrapper.querySelector('.card').appendChild(folderActions);
            }
        }
       
        attachFolderEventHandlers(wrapper, {
            id: folderId,
            name: folderName,
            folder_name: folderName
        });
    });
}


// saving files - TETAP menggunakan localStorage untuk sekarang
async function saveFilesToFolder(folderName, files) {
    if (!folderName) return;
    const repo = getRepoFiles();
    if (!repo[folderName]) repo[folderName] = [];


    for (const file of files) {
        // size check: skip extremely big files and show toast
        if (file.size > 6 * 1024 * 1024) { // 6MB
            window.repoUI.showToast('File terlalu besar (max 6MB) — pilih file lebih kecil');
            continue;
        }
        try {
            const dataUrl = await fileToBase64(file);
            const entry = {
                id: Date.now().toString(36) + Math.random().toString(36).slice(2,6),
                name: file.name,
                type: file.type || '',
                uploadedAt: new Date().toLocaleString(),
                dataUrl
            };
            repo[folderName].push(entry);
        } catch (e) {
            console.error('convert error', e);
            window.repoUI.showToast('Gagal memproses file: ' + file.name);
        }
    }
    saveRepoFiles(repo);
}


// Open folder - DIUBAH
let currentOpenedFolder = null;


function openFolder(folder) {
    currentOpenedFolder = folder;


    // Hapus konten modal yang lama
    const modalContent = filesModal.querySelector('.modal-content');
    modalContent.innerHTML = '';


    // Buat header yang simple di tengah
    const headerDiv = document.createElement('div');
    headerDiv.style.textAlign = 'center';
    headerDiv.style.marginBottom = '25px';
    headerDiv.style.paddingBottom = '15px';
    headerDiv.style.borderBottom = '2px solid #f0f0f0';


    const title = document.createElement('h3');
    title.textContent = folder.folder_name || folder.name;
    title.style.fontSize = '24px';
    title.style.fontWeight = '700';
    title.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
    title.style.webkitBackgroundClip = 'text';
    title.style.webkitTextFillColor = 'transparent';
    title.style.marginBottom = '8px';


    // Container untuk tombol tambah file
    const buttonContainer = document.createElement('div');
    buttonContainer.style.marginTop = '15px';


    const addButton = document.createElement('button');
    addButton.innerHTML = '<i class="fas fa-plus"></i> Tambah File';
    addButton.style.padding = '10px 20px';
    addButton.style.background = 'var(--primary-color)';
    addButton.style.color = '#fff';
    addButton.style.border = 'none';
    addButton.style.borderRadius = '8px';
    addButton.style.cursor = 'pointer';
    addButton.style.fontSize = '14px';
    addButton.style.fontWeight = '600';
    addButton.style.transition = 'all 0.3s ease';


    addButton.addEventListener('mouseenter', () => {
        addButton.style.background = '#5a6fd8';
        addButton.style.transform = 'translateY(-2px)';
    });


    addButton.addEventListener('mouseleave', () => {
        addButton.style.background = 'var(--primary-color)';
        addButton.style.transform = 'translateY(0)';
    });


    addButton.addEventListener('click', () => {
        fileInput.value = '';
        fileInput.click();
    });


    // Buat ul untuk file list
    const fileListEl = document.createElement('ul');
    fileListEl.id = 'fileList';
    fileListEl.style.textAlign = 'left';
    fileListEl.style.maxHeight = '400px';
    fileListEl.style.overflowY = 'auto';
    fileListEl.style.marginTop = '20px';


    // Tombol tutup
    const closeButton = document.createElement('button');
    closeButton.textContent = 'Tutup';
    closeButton.style.padding = '10px 20px';
    closeButton.style.background = '#ddd';
    closeButton.style.color = '#333';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '8px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '14px';
    closeButton.style.fontWeight = '600';
    closeButton.style.marginTop = '20px';
    closeButton.style.transition = 'all 0.3s ease';


    closeButton.addEventListener('mouseenter', () => {
        closeButton.style.background = '#bbb';
    });


    closeButton.addEventListener('mouseleave', () => {
        closeButton.style.background = '#ddd';
    });


    closeButton.addEventListener('click', () => {
        filesModal.style.display = 'none';
    });


    // Susun elemen-elemen
    headerDiv.appendChild(title); // HANYA title saja, subtitle dihapus
    buttonContainer.appendChild(addButton);
   
    modalContent.appendChild(headerDiv);
    modalContent.appendChild(buttonContainer);
    modalContent.appendChild(fileListEl);
    modalContent.appendChild(closeButton);


    renderFilesInModal(folder);
    filesModal.style.display = 'flex';
}


//render files - TETAP menggunakan localStorage untuk file
function renderFilesInModal(folder) {
    const folderName = folder.folder_name || folder.name;
    const repo = getRepoFiles();
    const files = repo[folderName] || [];
    const fileListEl = document.getElementById('fileList');
    fileListEl.innerHTML = '';


    if (!files.length) {
        fileListEl.innerHTML = `
            <li style='
                color: #666;
                padding: 20px;
                text-align: center;
                font-style: italic;
                list-style: none;
            '>
                Belum ada file dalam folder ini
            </li>`;
        return;
    }


    files.forEach(file => {
        const li = document.createElement('li');
        li.style.padding = '12px 8px';
        li.style.listStyle = 'none';
        li.style.borderBottom = '1px solid #f0f0f0';


        const cont = document.createElement('div');
        cont.style.display = 'flex';
        cont.style.justifyContent = 'space-between';
        cont.style.alignItems = 'center';
        cont.style.gap = '15px';


        const left = document.createElement('div');
        left.style.flex = '1';
        left.innerHTML = `
            <div style="font-weight:700; font-size:15px;">📄 ${escapeHtml(file.name)}</div>
            <div style="font-size:12px;color:#666; margin-top:4px;">${file.uploadedAt}</div>
        `;


        const right = document.createElement('div');
        right.style.display = 'flex';
        right.style.gap = '8px';


        const viewBtn = document.createElement('button');
        viewBtn.textContent = 'Lihat';
        viewBtn.style.padding = '8px 12px';
        viewBtn.style.borderRadius = '6px';
        viewBtn.style.background = 'var(--primary-color)';
        viewBtn.style.color = '#fff';
        viewBtn.style.border = 'none';
        viewBtn.style.cursor = 'pointer';
        viewBtn.style.fontSize = '12px';
        viewBtn.style.fontWeight = '600';
        viewBtn.style.transition = 'all 0.3s ease';


        viewBtn.addEventListener('mouseenter', () => {
            viewBtn.style.background = '#5a6fd8';
            viewBtn.style.transform = 'translateY(-1px)';
        });


        viewBtn.addEventListener('mouseleave', () => {
            viewBtn.style.background = 'var(--primary-color)';
            viewBtn.style.transform = 'translateY(0)';
        });


        viewBtn.addEventListener('click', () => {
            window.repoUI.openPreview({name: file.name, mime: file.type, dataUrl: file.dataUrl});
        });


        const delBtn = document.createElement('button');
        delBtn.textContent = 'Hapus';
        delBtn.style.padding = '8px 12px';
        delBtn.style.borderRadius = '6px';
        delBtn.style.background = '#ff6b6b';
        delBtn.style.color = '#fff';
        delBtn.style.border = 'none';
        delBtn.style.cursor = 'pointer';
        delBtn.style.fontSize = '12px';
        delBtn.style.fontWeight = '600';
        delBtn.style.transition = 'all 0.3s ease';


        delBtn.addEventListener('mouseenter', () => {
            delBtn.style.background = '#ff5252';
            delBtn.style.transform = 'translateY(-1px)';
        });


        delBtn.addEventListener('mouseleave', () => {
            delBtn.style.background = '#ff6b6b';
            delBtn.style.transform = 'translateY(0)';
        });


        delBtn.addEventListener('click', () => {
            window.repoUI.openConfirm(`Hapus file "${file.name}"?`, () => {
                deleteFileFromFolder(folderName, file.id);
            });
        });


        right.appendChild(viewBtn);
        right.appendChild(delBtn);
        cont.appendChild(left);
        cont.appendChild(right);
        li.appendChild(cont);
        fileListEl.appendChild(li);
    });
}


// delete file - TETAP menggunakan localStorage
function deleteFileFromFolder(folderName, fileId) {
    const repo = getRepoFiles();
    if (!repo[folderName]) return;
    repo[folderName] = repo[folderName].filter(f => f.id !== fileId);
    saveRepoFiles(repo);
    renderFilesInModal(currentOpenedFolder);
    window.repoUI.showToast('File dihapus');
}


// hook file input
if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        if (!currentOpenedFolder) {
            window.repoUI.showToast('Klik folder dulu untuk memilih tujuan file.');
            fileInput.value = '';
            return;
        }
        await saveFilesToFolder(currentOpenedFolder.folder_name || currentOpenedFolder.name, files);
        renderFilesInModal(currentOpenedFolder);
        if (uploadModal) uploadModal.style.display = 'none';
        fileInput.value = '';
        window.repoUI.showToast('File ditambahkan');
    });
}


// add-folder button wiring
if (addBtn) {
    addBtn.addEventListener('click', () => {
        if (addFolderModal) {
            addFolderModal.style.display = 'flex';
            newFolderName.value = '';
            newFolderName.focus();
           
            // Reset counter
            const charCount = document.querySelector('.char-count');
            if (charCount) {
                charCount.textContent = '0/15 karakter';
                charCount.classList.remove('warning', 'limit-reached');
                newFolderName.classList.remove('limit-reached');
            }
        } else {
            // fallback: prompt like UI (but we avoid native prompt)
            const name = prompt('Nama folder baru (maks. 15 karakter):');
            if (name) {
                const trimmedName = name.trim();
                if (trimmedName.length > 15) {
                    window.repoUI.showToast('Nama folder maksimal 15 karakter');
                } else {
                    createFolder(trimmedName);
                }
            }
        }
    });
}


// Initialize character counters
let charCountElement = null;
document.addEventListener('DOMContentLoaded', function() {
    charCountElement = initializeCharacterCounter();
    initializeRenameCharacterCounter();
});


// modal add folder buttons
if (cancelFolderBtn) {
    cancelFolderBtn.addEventListener('click', () => {
        if (addFolderModal) {
            addFolderModal.style.display='none';
           
            // Reset counter
            if (charCountElement) {
                charCountElement.textContent = '0/15 karakter';
                charCountElement.classList.remove('warning', 'limit-reached');
                newFolderName.classList.remove('limit-reached');
            }
        }
    });
}


if (createFolderBtn) {
    createFolderBtn.addEventListener('click', async () => {
        const name = (newFolderName.value||'').trim();
       
        if (!name) {
            window.repoUI.showToast('Nama folder tidak boleh kosong');
            return;
        }
       
        if (name.length > 15) {
            window.repoUI.showToast('Nama folder maksimal 15 karakter');
            newFolderName.classList.add('limit-reached');
            if (charCountElement) {
                charCountElement.classList.add('limit-reached');
            }
            return;
        }
       
        await createFolder(name);
        if (addFolderModal) addFolderModal.style.display='none';
       
        // Reset counter
        if (charCountElement) {
            charCountElement.textContent = '0/15 karakter';
            charCountElement.classList.remove('warning', 'limit-reached');
            newFolderName.classList.remove('limit-reached');
        }
    });
}


// upload modal cancel
if (cancelUpload) {
    cancelUpload.addEventListener('click', () => {
        if (uploadModal) uploadModal.style.display='none';
        if (fileInput) fileInput.value = '';
    });
}


// confirmUpload (if used)
if (confirmUpload) {
    confirmUpload.addEventListener('click', async () => {
        const files = Array.from(fileInput.files || []);
        if (!files.length) { window.repoUI.showToast('Pilih file dulu'); return; }
        if (!currentOpenedFolder) { window.repoUI.showToast('Pilih folder dulu'); return; }
        await saveFilesToFolder(currentOpenedFolder.folder_name || currentOpenedFolder.name, files);
        if (uploadModal) uploadModal.style.display='none';
        fileInput.value = '';
        renderFilesInModal(currentOpenedFolder);
        window.repoUI.showToast('File diunggah');
    });
}


// click outside to close for existing modals
window.addEventListener('click', (e) => {
    if (e.target === addFolderModal) {
        addFolderModal.style.display = 'none';
        // Reset counter
        if (charCountElement) {
            charCountElement.textContent = '0/15 karakter';
            charCountElement.classList.remove('warning', 'limit-reached');
            newFolderName.classList.remove('limit-reached');
        }
    }
    if (e.target === uploadModal) uploadModal.style.display = 'none';
    if (e.target === filesModal) filesModal.style.display = 'none';
    if (e.target === $('#renameModal')) $('#renameModal').style.display = 'none';
});


// -------------------- escape html --------------------
function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/[&<>"']/g, (m)=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}


// Load folders dari backend saat halaman dimuat
async function loadFoldersFromBackend() {
    try {
        const userId = getCurrentUserId();
        console.log('Loading folders for user:', userId);
       
        const response = await apiCall(`/folders/user/${userId}`);
        console.log('Folders response:', response);
       
        if (Array.isArray(response)) {
            // Simpan ke cache
            const foldersForCache = response.map(folder => ({
                id: folder.id,
                name: folder.folder_name,
                folder_name: folder.folder_name,
                color: folder.color
            }));
            saveFolderList(foldersForCache);
           
            // Tampilkan folder
            const addWrapper = addBtn.closest('.card-wrapper');
           
            // Hapus folder yang ada (kecuali tombol tambah)
            $$('.card-wrapper:not(:last-child)').forEach(w => w.remove());
           
            // Tampilkan folder dari backend
            response.forEach(folder => createFolderFromData(folder));
           
            return response;
        }
        return [];
    } catch (error) {
        console.error('Error loading folders from backend:', error);
       
        // Fallback ke cache lokal
        const cachedFolders = getFolderList();
        if (cachedFolders.length > 0) {
            console.log('Using cached folders:', cachedFolders);
           
            const addWrapper = addBtn.closest('.card-wrapper');
            $$('.card-wrapper:not(:last-child)').forEach(w => w.remove());
           
            cachedFolders.forEach(folder => createFolderFromData(folder));
           
            window.repoUI.showToast('Menggunakan data offline');
        }
       
        return [];
    }
}


// init (load folders & attach handlers)
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize existing folders di DOM (jika ada dari HTML)
    initializeExistingFolders();
   
    // Load folders dari backend
    await loadFoldersFromBackend();
   
    // Tambahkan folder dari cache jika masih ada yang belum ditampilkan
    const cachedFolders = getFolderList();
    const displayedFolderIds = $$('.card-wrapper:not(:last-child)').map(w => w.dataset.folderId);
   
    cachedFolders.forEach(folder => {
        if (!displayedFolderIds.includes(folder.id) && !displayedFolderIds.includes(folder.local_id)) {
            createFolderFromData(folder);
        }
    });


    // small animation for cards (optional)
    $$('.card-wrapper').forEach((wrapper, i) => {
        wrapper.style.opacity = '0';
        wrapper.style.transform = 'translateY(20px)';
        setTimeout(()=> {
            wrapper.style.transition = 'all 0.45s ease';
            wrapper.style.opacity = '1';
            wrapper.style.transform = 'translateY(0)';
        }, i*80);
    });


    // Preload demo file into folder "Satu" if available and not already present
    if (demoFileUrl) {
        try {
            const resp = await fetch(demoFileUrl);
            if (resp.ok) {
                const blob = await resp.blob();
                const filename = demoFileUrl.split('/').pop();
                const fileObj = new File([blob], filename, { type: blob.type || 'image/jpeg' });
                const folders = getFolderList();
               
                // Cari atau buat folder "Satu"
                let satuFolder = folders.find(f => f.name === 'Satu');
                if (!satuFolder) {
                    // Buat folder "Satu" di backend
                    await createFolder('Satu');
                    // Reload folders
                    await loadFoldersFromBackend();
                }
               
                const repo = getRepoFiles();
                if (!repo['Satu'] || !repo['Satu'].find(x => x.name === filename)) {
                    await saveFilesToFolder('Satu', [fileObj]);
                    console.log('Demo file preloaded');
                }
            }
        } catch (e) {
            // ignore fetch errors when running locally without tool support
            console.warn('Demo preload failed', e);
        }
    }
});
