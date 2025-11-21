console.log("repository-final.js loaded");
const demoFileUrl = "/mnt/data/ad2af446-efbf-4ff0-91c8-df4e3d487831.jpg";
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));


(function createUIHelpers() {
    // Confirm modal
    const confirmModal = document.createElement('div');
    confirmModal.id = 'confirmModal';
    confirmModal.className = 'modal';
    confirmModal.innerHTML = `
      <div class="modal-content" style="width:360px;max-width:92%">
        <h3 id="confirmModalText"></h3>
        <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:12px;">
          <button id="confirmCancelBtn" style="background:#ddd;padding:8px 12px;border-radius:8px;">Batal</button>
          <button id="confirmOkBtn" style="background:#ff6b6b;color:#fff;padding:8px 12px;border-radius:8px;">Hapus</button>
        </div>
      </div>
    `;
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
        }
    };
})();


//  utilities 
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

function getRepoFiles() {
    try { return JSON.parse(localStorage.getItem('repoFiles')||'{}'); } catch { return {}; }
}
function saveRepoFiles(obj) {
    localStorage.setItem('repoFiles', JSON.stringify(obj));
}

function saveFolderList(folders) {
    localStorage.setItem('repositoryFolders', JSON.stringify(folders));
}
function getFolderList() {
    try { return JSON.parse(localStorage.getItem('repositoryFolders')||'[]'); } catch { return []; }
}

//  DOM elements
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

//  folder functions 
function createFolder(name) {
    // avoid duplicates
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
            <button class="delete-folder">×</button>
        </div>
    `;

    const addWrapper = addBtn.closest('.card-wrapper');
    grid.insertBefore(wrapper, addWrapper);

    // attach handlers
    const delBtn = wrapper.querySelector('.delete-folder');
    delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.repoUI.openConfirm(`Hapus folder "${name}"?`, () => {
            deleteFolder(wrapper, name);
        });
    });

    const card = wrapper.querySelector('.card');
    card.addEventListener('click', () => openFolder(name));

    // persist
    folders.push({name, color: colorClass});
    saveFolderList(folders);
    window.repoUI.showToast('Folder dibuat');
}

function createFolderFromData(name, colorClass) {
    const wrapper = document.createElement('div');
    wrapper.className = 'card-wrapper';
    wrapper.innerHTML = `
        <div class="card ${colorClass}">
            <p class="folder-name">${escapeHtml(name)}</p>
            <button class="delete-folder">×</button>
        </div>
    `;
    const addWrapper = addBtn.closest('.card-wrapper');
    grid.insertBefore(wrapper, addWrapper);

    const delBtn = wrapper.querySelector('.delete-folder');
    delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.repoUI.openConfirm(`Hapus folder "${name}"?`, () => {
            deleteFolder(wrapper, name);
        });
    });

    const card = wrapper.querySelector('.card');
    card.addEventListener('click', () => openFolder(name));
}

function deleteFolder(wrapper, name) {
    wrapper.style.transform = 'scale(0)';
    wrapper.style.opacity = '0';
    setTimeout(() => {
        wrapper.remove();
        // remove files
        const rf = getRepoFiles();
        if (rf[name]) { delete rf[name]; saveRepoFiles(rf); }
        // remove folder list
        let folders = getFolderList();
        folders = folders.filter(f => f.name !== name);
        saveFolderList(folders);
        window.repoUI.showToast('Folder dihapus');
    }, 300);
}

function initializeExistingFolders() {
    $$('.card-wrapper:not(:last-child)').forEach(wrapper => {
        const folderName = wrapper.querySelector('.folder-name').textContent;
        const card = wrapper.querySelector('.card');
        const deleteBtn = wrapper.querySelector('.delete-folder');

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            window.repoUI.openConfirm(`Hapus folder "${folderName}"?`, () => {
                deleteFolder(wrapper, folderName);
            });
        });

        card.addEventListener('click', () => openFolder(folderName));
    });
}

// saving files 
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

// Open folder
let currentOpenedFolder = null;
let injectedHeader = false;

function openFolder(name) {
    currentOpenedFolder = name;
    folderTitle.textContent = 'Isi folder: ' + name;

    // inject header with + only once (do not move existing title element)
    if (!injectedHeader) {
        const modalContent = filesModal.querySelector('.modal-content');
        const headerDiv = document.createElement('div');
        headerDiv.style.display = 'flex';
        headerDiv.style.justifyContent = 'space-between';
        headerDiv.style.alignItems = 'center';
        headerDiv.style.marginBottom = '10px';

        const titleClone = document.createElement('div');
        titleClone.id = 'folderTitleClone';
        titleClone.style.fontWeight = '700';
        titleClone.style.fontSize = '16px';
        titleClone.textContent = folderTitle.textContent;

        const plusBtn = document.createElement('button');
        plusBtn.textContent = '＋';
        plusBtn.title = 'Tambah file';
        plusBtn.style.fontSize = '20px';
        plusBtn.style.padding = '6px 10px';
        plusBtn.style.borderRadius = '8px';
        plusBtn.style.background = getComputedStyle(document.documentElement).getPropertyValue('--primary-color') || '#9EC6F3';
        plusBtn.style.color = '#fff';
        plusBtn.style.border = 'none';
        plusBtn.style.cursor = 'pointer';

        plusBtn.addEventListener('click', () => {
            fileInput.value = '';
            fileInput.click();
        });

        headerDiv.appendChild(titleClone);
        headerDiv.appendChild(plusBtn);

        const fileListEl = filesModal.querySelector('#fileList');
        modalContent.insertBefore(headerDiv, fileListEl);
        injectedHeader = true;
    } else {
        // update cloned title text
        const clone = $('#folderTitleClone');
        if (clone) clone.textContent = 'Isi folder: ' + name;
    }

    renderFilesInModal(name);
    filesModal.style.display = 'flex';
}

//render files
function renderFilesInModal(folderName) {
    const repo = getRepoFiles();
    const files = repo[folderName] || [];
    fileList.innerHTML = '';

    if (!files.length) {
        fileList.innerHTML = "<li style='color:#666;padding:8px;'>Belum ada file.</li>";
        return;
    }

    files.forEach(file => {
        const li = document.createElement('li');
        li.style.padding = '8px 4px';
        li.style.listStyle = 'none';

        const cont = document.createElement('div');
        cont.style.display = 'flex';
        cont.style.justifyContent = 'space-between';
        cont.style.alignItems = 'center';
        cont.style.gap = '12px';

        const left = document.createElement('div');
        left.innerHTML = `<div style="font-weight:700;">📄 ${escapeHtml(file.name)}</div>
                          <div style="font-size:12px;color:#666;">${file.uploadedAt}</div>`;

        const right = document.createElement('div');

        const viewBtn = document.createElement('button');
        viewBtn.textContent = 'Lihat';
        viewBtn.style.padding = '6px 8px';
        viewBtn.style.borderRadius = '8px';
        viewBtn.style.cursor = 'pointer';
        viewBtn.addEventListener('click', () => {
            window.repoUI.openPreview({name: file.name, mime: file.type, dataUrl: file.dataUrl});
        });

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Hapus';
        delBtn.style.padding = '6px 8px';
        delBtn.style.borderRadius = '8px';
        delBtn.style.background = '#ff6b6b';
        delBtn.style.color = '#fff';
        delBtn.style.cursor = 'pointer';
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
        fileList.appendChild(li);

        const hr = document.createElement('hr');
        hr.style.border = 'none';
        hr.style.borderTop = '1px solid rgba(0,0,0,0.05)';
        fileList.appendChild(hr);
    });
}

// delete file 
function deleteFileFromFolder(folderName, fileId) {
    const repo = getRepoFiles();
    if (!repo[folderName]) return;
    repo[folderName] = repo[folderName].filter(f => f.id !== fileId);
    saveRepoFiles(repo);
    renderFilesInModal(folderName);
    window.repoUI.showToast('File dihapus');
}

//  hook file input 
if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        if (!currentOpenedFolder) {
            window.repoUI.showToast('Klik folder dulu untuk memilih tujuan file.');
            fileInput.value = '';
            return;
        }
        await saveFilesToFolder(currentOpenedFolder, files);
        renderFilesInModal(currentOpenedFolder);
        if (uploadModal) uploadModal.style.display = 'none';
        fileInput.value = '';
        window.repoUI.showToast('File ditambahkan');
    });
}

//  add-folder button wiring
if (addBtn) {
    addBtn.addEventListener('click', () => {
        if (addFolderModal) {
            addFolderModal.style.display = 'flex';
            newFolderName.value = '';
            newFolderName.focus();
        } else {
            // fallback: prompt like UI (but we avoid native prompt)
            const name = prompt('Nama folder baru:');
            if (name) createFolder(name.trim());
        }
    });
}

// modal add folder buttons
if (cancelFolderBtn) {
    cancelFolderBtn.addEventListener('click', () => { if (addFolderModal) addFolderModal.style.display='none'; });
}
if (createFolderBtn) {
    createFolderBtn.addEventListener('click', () => {
        const name = (newFolderName.value||'').trim();
        if (!name) { window.repoUI.showToast('Nama folder tidak boleh kosong'); return; }
        createFolder(name);
        if (addFolderModal) addFolderModal.style.display='none';
    });
}

// upload modal cancel
if (cancelUpload) {
    cancelUpload.addEventListener('click', () => { if (uploadModal) uploadModal.style.display='none'; if (fileInput) fileInput.value = ''; });
}

// confirmUpload (if used)
if (confirmUpload) {
    confirmUpload.addEventListener('click', async () => {
        const files = Array.from(fileInput.files || []);
        if (!files.length) { window.repoUI.showToast('Pilih file dulu'); return; }
        if (!currentOpenedFolder) { window.repoUI.showToast('Pilih folder dulu'); return; }
        await saveFilesToFolder(currentOpenedFolder, files);
        if (uploadModal) uploadModal.style.display='none';
        fileInput.value = '';
        renderFilesInModal(currentOpenedFolder);
        window.repoUI.showToast('File diunggah');
    });
}

// close files modal
if (closeFilesModal) {
    closeFilesModal.addEventListener('click', () => { filesModal.style.display = 'none'; });
}

// click outside to close for existing modals
window.addEventListener('click', (e) => {
    if (e.target === addFolderModal) addFolderModal.style.display = 'none';
    if (e.target === uploadModal) uploadModal.style.display = 'none';
    if (e.target === filesModal) filesModal.style.display = 'none';
});

// -------------------- escape html --------------------
function escapeHtml(s) {
    if (!s) return '';
    return s.replace(/[&<>"']/g, (m)=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

//  init (load folders & attach handlers) 
document.addEventListener('DOMContentLoaded', async () => {
    initializeExistingFolders();

    // load saved folders
    const saved = getFolderList();
    if (saved && saved.length) {
        // remove default existing cards and re-create from saved (to avoid duplicates)
        $$('.card-wrapper:not(:last-child)').forEach(w => w.remove());
        saved.forEach(f => createFolderFromData(f.name, f.color));
    }

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
                if (!folders.find(f => f.name === 'Satu')) createFolder('Satu');
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
