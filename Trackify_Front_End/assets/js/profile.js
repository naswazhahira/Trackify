document.addEventListener('DOMContentLoaded', function() {
    // ========== ELEMENTS ==========
    const backButton = document.getElementById('backButton');
    const editButton = document.getElementById('editButton');
    const deleteButton = document.getElementById('deleteButton');
    const saveButton = document.getElementById('saveButton');
    const cancelButton = document.getElementById('cancelButton');
    const overlay = document.getElementById('overlay');


    const fullNameInput = document.getElementById('fullName');
    const usernameInput = document.getElementById('username');
    const profileImage = document.getElementById('profileImage');
    const editAvatar = document.getElementById('editAvatar');


    const passwordButton = document.getElementById('passwordButton');
    const passwordModal = document.getElementById('passwordModal');


    const confirmDeleteModal = document.getElementById('confirmDeleteModal');
    const finalDeleteModal = document.getElementById('finalDeleteModal');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');
    const finalYes = document.getElementById('finalYes');
    const finalNo = document.getElementById('finalNo');
   
    const saveCropToProfile = document.getElementById('saveCropToProfile');
    const cancelSaveCrop = document.getElementById('cancelSaveCrop');
    const saveCropContainer = document.getElementById('saveCropContainer');


    const avatarModal = document.getElementById('avatarModal');
    const closeAvatarModal = document.getElementById('closeAvatarModal');
    const changeAvatar = document.getElementById('changeAvatar');
    const removeAvatar = document.getElementById('removeAvatar');


    const tabReset = document.getElementById('tabReset');
    const tabForgot = document.getElementById('tabForgot');
    const resetStage1 = document.getElementById('resetStage1');
    const resetStage2 = document.getElementById('resetStage2');
    const forgotPasswordTab = document.getElementById('forgotPasswordTab');
    const forgotStage2 = document.getElementById('forgotStage2');
    const verifyCurrentPassword = document.getElementById('verifyCurrentPassword');
    const saveNewPassword = document.getElementById('saveNewPassword');
    const verifyRecoveryPin = document.getElementById('verifyRecoveryPin');
    const saveNewPasswordForgot = document.getElementById('saveNewPasswordForgot');
    const currentPasswordInput = document.getElementById('currentPasswordInput');
    const newPasswordInput = document.getElementById('newPasswordInput');
    const confirmNewPasswordInput = document.getElementById('confirmNewPasswordInput');
    const recoveryPinInput = document.getElementById('recoveryPinInput');
    const newPasswordInputForgot = document.getElementById('newPasswordInputForgot');
    const confirmNewPasswordInputForgot = document.getElementById('confirmNewPasswordInputForgot');


    const cancelResetStage1 = document.getElementById('cancelResetStage1');
    const cancelResetStage2 = document.getElementById('cancelResetStage2');
    const cancelLupaPassword = document.getElementById('cancelLupaPassword');
    const cancelForgotStage2 = document.getElementById('cancelForgotStage2');


    // ========== VARIABLES ==========
    let currentUser = null;
    const API_BASE = 'http://localhost:5000/api/users';
    let cropper = null;
   
    // ========== INITIALIZATION ==========
    // Cek login status
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
   
    if (!token || !userData) {
        // Redirect ke login jika belum login
        window.location.href = 'login.html';
        return;
    }
   
    try {
        currentUser = JSON.parse(userData);
        loadUserData();
    } catch (e) {
        console.error('Error parsing user data:', e);
        window.location.href = 'login.html';
        return;
    }
   
    // ========== FUNGSI UTAMA ==========
    function loadUserData() {
        if (!currentUser) return;
       
        // Tampilkan data user
        if (fullNameInput) fullNameInput.value = currentUser.fullname || '';
        if (usernameInput) usernameInput.value = currentUser.username || '';
       
        // Set profile image
        if (profileImage && currentUser.profile_picture) {
            profileImage.src = currentUser.profile_picture;
        }
       
        // Ambil data fresh dari API
        fetchUserProfile();
    }
   
    async function fetchUserProfile() {
        try {
            const response = await fetch(`${API_BASE}/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
           
            if (response.status === 401) {
                // Token expired
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'login.html';
                return;
            }
           
            if (!response.ok) {
                return;
            }
           
            const data = await response.json();
           
            if (data.success && data.user) {
                // Update current user data
                currentUser = data.user;
                localStorage.setItem('user', JSON.stringify(currentUser));
               
                // Update UI
                if (fullNameInput) fullNameInput.value = currentUser.fullname || '';
                if (usernameInput) usernameInput.value = currentUser.username || '';
               
                if (profileImage && currentUser.profile_picture) {
                    profileImage.src = currentUser.profile_picture;
                }
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    }
   
    // ========== EVENT LISTENERS ==========
    // Tombol Navigasi
    if (backButton) {
        backButton.addEventListener('click', () => window.location.href = 'beranda.html');
    }


    if (saveCropToProfile) {
        saveCropToProfile.addEventListener('click', function() {
            console.log('🖱️ Tombol Simpan ke Profil diklik');
            if (window.croppedProfileImage) {
                updateProfilePicture(window.croppedProfileImage);
            } else {
                showNotification('Tidak ada foto untuk disimpan', 'error');
            }
        });
    }


    if (cancelSaveCrop) {
        cancelSaveCrop.addEventListener('click', function() {
            resetAvatarModal();
        });
    }
   
    // Edit Profil
    if (editButton) {
        editButton.addEventListener('click', () => {
            if (fullNameInput) {
                fullNameInput.readOnly = false;
                fullNameInput.focus();
            }
            if (usernameInput) usernameInput.readOnly = false;
            toggleActionButtons(false);
            showEditActions(true);
        });
    }
   
    if (saveButton) {
        saveButton.addEventListener('click', handleSaveProfile);
    }
   
    if (cancelButton) {
        cancelButton.addEventListener('click', () => {
            // Reset ke data asli
            if (currentUser) {
                if (fullNameInput) fullNameInput.value = currentUser.fullname || '';
                if (usernameInput) usernameInput.value = currentUser.username || '';
            }
           
            if (fullNameInput) fullNameInput.readOnly = true;
            if (usernameInput) usernameInput.readOnly = true;
            toggleActionButtons(true);
            showEditActions(false);
        });
    }
   
    // ========== PASSWORD MANAGEMENT ==========
    if (passwordButton) {
        passwordButton.addEventListener('click', () => {
            openModal(passwordModal);
            showPasswordTab('reset');
        });
    }
   
    if (tabReset) {
        tabReset.addEventListener('click', () => showPasswordTab('reset'));
    }
   
    if (tabForgot) {
        tabForgot.addEventListener('click', () => showPasswordTab('forgot'));
    }
   
    function showPasswordTab(tab) {
        // Reset semua tab
        if (resetStage1) resetStage1.style.display = 'none';
        if (resetStage2) resetStage2.style.display = 'none';
        if (forgotPasswordTab) forgotPasswordTab.style.display = 'none';
        if (forgotStage2) forgotStage2.style.display = 'none';
       
        // Clear inputs
        if (currentPasswordInput) currentPasswordInput.value = '';
        if (newPasswordInput) newPasswordInput.value = '';
        if (confirmNewPasswordInput) confirmNewPasswordInput.value = '';
        if (recoveryPinInput) recoveryPinInput.value = '';
        if (newPasswordInputForgot) newPasswordInputForgot.value = '';
        if (confirmNewPasswordInputForgot) confirmNewPasswordInputForgot.value = '';
       
        // Update tab aktif
        if (tabReset && tabForgot) {
            tabReset.classList.toggle('active', tab === 'reset');
            tabForgot.classList.toggle('active', tab === 'forgot');
        }
       
        // Tampilkan tab yang dipilih
        if (tab === 'reset' && resetStage1) {
            resetStage1.style.display = 'block';
        } else if (tab === 'forgot' && forgotPasswordTab) {
            forgotPasswordTab.style.display = 'block';
        }
    }
   
    // Verify current password
    if (verifyCurrentPassword) {
        verifyCurrentPassword.addEventListener('click', async () => {
            const currentPassword = currentPasswordInput ? currentPasswordInput.value.trim() : '';
           
            if (!currentPassword) {
                showNotification("Silakan masukkan password saat ini!", "error");
                return;
            }
           
            try {
                // Verify dengan API login
                const response = await fetch(`${API_BASE}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: currentUser.username,
                        password: currentPassword
                    })
                });
               
                if (!response.ok) {
                    showNotification("Password saat ini salah!", "error");
                    return;
                }
               
                // Lanjut ke stage 2
                if (resetStage1) resetStage1.style.display = 'none';
                if (resetStage2) {
                    resetStage2.style.display = 'block';
                    if (newPasswordInput) newPasswordInput.focus();
                }
               
            } catch (error) {
                console.error('Error verifying password:', error);
                showNotification("Terjadi kesalahan saat verifikasi", "error");
            }
        });
    }
   
    // Save new password
    if (saveNewPassword) {
        saveNewPassword.addEventListener('click', async () => {
            const newPassword = newPasswordInput ? newPasswordInput.value.trim() : '';
            const confirmPassword = confirmNewPasswordInput ? confirmNewPasswordInput.value.trim() : '';
           
            if (!newPassword || !confirmPassword) {
                showNotification("Lengkapi semua kolom!", "error");
                return;
            }
           
            if (newPassword.length < 5) {
                showNotification("Password minimal 5 karakter!", "error");
                return;
            }
           
            if (newPassword !== confirmPassword) {
                showNotification("Password baru tidak cocok!", "error");
                return;
            }
           
            try {
                // Update password via API
                const response = await fetch(`${API_BASE}/update-password`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: currentUser.username,
                        newPassword: newPassword
                    })
                });
               
                const data = await response.json();
               
                if (!response.ok) {
                    showNotification(data.error || "Gagal mengubah password", "error");
                    return;
                }
               
                showNotification("Password berhasil diubah!", "success");
                closeModals();
               
            } catch (error) {
                console.error('Error updating password:', error);
                showNotification("Terjadi kesalahan", "error");
            }
        });
    }
   
    // Verify PIN for forgot password
    if (verifyRecoveryPin) {
        verifyRecoveryPin.addEventListener('click', async () => {
            const pin = recoveryPinInput ? recoveryPinInput.value.trim() : '';
           
            if (!pin) {
                showNotification("Silakan masukkan PIN pemulihan!", "error");
                return;
            }
           
            try {
                const response = await fetch(`${API_BASE}/verify-pin`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: currentUser.username,
                        pin: pin
                    })
                });
               
                const data = await response.json();
               
                if (!response.ok) {
                    showNotification(data.error || "PIN salah", "error");
                    return;
                }
               
                // Lanjut ke stage 2
                if (forgotPasswordTab) forgotPasswordTab.style.display = 'none';
                if (forgotStage2) {
                    forgotStage2.style.display = 'block';
                    if (newPasswordInputForgot) newPasswordInputForgot.focus();
                }
               
            } catch (error) {
                console.error('Error verifying PIN:', error);
                showNotification("Terjadi kesalahan", "error");
            }
        });
    }
   
    // Save new password (forgot password)
    if (saveNewPasswordForgot) {
        saveNewPasswordForgot.addEventListener('click', async () => {
            const newPassword = newPasswordInputForgot ? newPasswordInputForgot.value.trim() : '';
            const confirmPassword = confirmNewPasswordInputForgot ? confirmNewPasswordInputForgot.value.trim() : '';
           
            if (!newPassword || !confirmPassword) {
                showNotification("Lengkapi semua kolom!", "error");
                return;
            }
           
            if (newPassword.length < 5) {
                showNotification("Password minimal 5 karakter!", "error");
                return;
            }
           
            if (newPassword !== confirmPassword) {
                showNotification("Password baru tidak cocok!", "error");
                return;
            }
           
            try {
                const response = await fetch(`${API_BASE}/reset-password`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        username: currentUser.username,
                        newPassword: newPassword
                    })
                });
               
                const data = await response.json();
               
                if (!response.ok) {
                    showNotification(data.error || "Gagal reset password", "error");
                    return;
                }
               
                showNotification("Password berhasil direset!", "success");
                closeModals();
               
            } catch (error) {
                console.error('Error resetting password:', error);
                showNotification("Terjadi kesalahan", "error");
            }
        });
    }
   
    // Cancel buttons
    [cancelResetStage1, cancelResetStage2, cancelLupaPassword, cancelForgotStage2].forEach(btn => {
        if (btn) btn.addEventListener('click', () => closeModals());
    });
   
    // ========== DELETE ACCOUNT ==========
    if (deleteButton) {
        deleteButton.addEventListener('click', () => openModal(confirmDeleteModal));
    }
   
    if (confirmNo) {
        confirmNo.addEventListener('click', () => closeModals());
    }
   
    if (confirmYes) {
        confirmYes.addEventListener('click', () => {
            const password = confirmPasswordInput ? confirmPasswordInput.value.trim() : '';
           
            if (!password) {
                showNotification("Silakan masukkan password untuk konfirmasi!", "error");
                return;
            }
           
            // Verifikasi password dulu
            verifyPasswordForDeletion(password);
        });
    }
   
    if (finalNo) {
        finalNo.addEventListener('click', () => closeModals());
    }
   
    if (finalYes) {
        finalYes.addEventListener('click', deleteAccount);
    }
   
    async function verifyPasswordForDeletion(password) {
        try {
            const response = await fetch(`${API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: currentUser.username,
                    password: password
                })
            });
           
            if (!response.ok) {
                showNotification("Password salah, akun tidak dihapus", "error");
                if (confirmPasswordInput) confirmPasswordInput.value = '';
                return;
            }
           
            // Password benar, tampilkan final confirmation
            closeModal(confirmDeleteModal);
            openModal(finalDeleteModal);
            if (confirmPasswordInput) confirmPasswordInput.value = '';
           
        } catch (error) {
            console.error('Error verifying password:', error);
            showNotification("Terjadi kesalahan", "error");
        }
    }
   
    async function deleteAccount() {
        try {
            const response = await fetch(`${API_BASE}/delete-user`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: currentUser.username
                })
            });
           
            const data = await response.json();
           
            if (!response.ok) {
                showNotification(data.error || "Gagal menghapus akun", "error");
                return;
            }
           
            showNotification("Akun berhasil dihapus", "success");
           
            // Clear localStorage dan redirect
            setTimeout(() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'login.html';
            }, 1500);
           
        } catch (error) {
            console.error('Error deleting account:', error);
            showNotification("Terjadi kesalahan saat menghapus akun", "error");
        }
    }
   
    // ========== EDIT PROFILE PICTURE ==========
    if (editAvatar) {
        editAvatar.addEventListener('click', () => openModal(avatarModal));
    }


    if (closeAvatarModal) {
        closeAvatarModal.addEventListener('click', closeModals);
    }


    if (changeAvatar) {
        changeAvatar.addEventListener('click', () => {
            document.getElementById('avatarInput').click();
        });
    }


    // TAMBAHKAN ELEMENT untuk tombol ambil foto
    const takePhoto = document.getElementById('takePhoto');


    // Ambil foto dari kamera
    if (takePhoto) {
        takePhoto.addEventListener('click', () => {
            console.log('📱 Membuka kamera...');
            showNotification('Membuka kamera...', 'info');
           
            // Sembunyikan modal avatar options
            closeModals();
           
            // Buka kamera langsung
            openCamera();
        });
    }


    // Handle file input change
    const avatarInput = document.getElementById('avatarInput');
    if (avatarInput) {
        avatarInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                if (!file.type.match('image.*')) {
                    showNotification('Harap pilih file gambar', 'error');
                    return;
                }
               
                if (file.size > 5 * 1024 * 1024) {
                    showNotification('Ukuran file maksimal 5MB', 'error');
                    return;
                }


                const reader = new FileReader();
                reader.onload = function(e) {
                    // Langsung ke cropper
                    openCropper(e.target.result);
                };
                reader.onerror = function() {
                    showNotification('Gagal membaca file gambar', 'error');
                };
                reader.readAsDataURL(file);
            }
        });
    }


    // ========== FUNGSI KAMERA BARU ==========
    function openCamera() {
        console.log('📱 Meminta akses kamera...');
       
        const constraints = {
            video: {
                width: { ideal: 640, max: 1280 },
                height: { ideal: 480, max: 720 },
                facingMode: 'user',
                frameRate: { ideal: 30 }
            },
            audio: false
        };
       
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia(constraints)
                .then(function(stream) {
                    console.log('✅ Akses kamera diberikan');
                    createCameraModal(stream);
                })
                .catch(function(error) {
                    console.error('❌ Error kamera:', error);
                    let errorMsg = 'Gagal mengakses kamera. ';
                   
                    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                        errorMsg = 'Izin kamera ditolak. Silakan izinkan akses kamera di pengaturan browser Anda.';
                    } else if (error.name === 'NotFoundError') {
                        errorMsg = 'Kamera tidak ditemukan di perangkat ini.';
                    } else if (error.name === 'NotReadableError') {
                        errorMsg = 'Kamera sedang digunakan oleh aplikasi lain.';
                    } else if (error.name === 'OverconstrainedError') {
                        errorMsg = 'Kamera tidak mendukung resolusi yang diminta.';
                    } else {
                        errorMsg += error.message;
                    }
                   
                    showNotification(errorMsg, 'error');
                    setTimeout(() => {
                        document.getElementById('avatarInput').click();
                    }, 1000);
                });
        } else {
            showNotification('Browser tidak mendukung akses kamera', 'error');
            setTimeout(() => {
                document.getElementById('avatarInput').click();
            }, 1000);
        }
    }


    function createCameraModal(stream) {
    const cameraModal = document.createElement('div');
    cameraModal.id = 'cameraModal';
    cameraModal.innerHTML = `
        <div class="modal" style="display: block; z-index: 1003; background: rgba(0,0,0,0.9);">
            <div class="modal-content" style="max-width: 500px; background: transparent; box-shadow: none;">
                <div class="modal-header" style="background: transparent; color: white; border: none;">
                    <h2 style="color: white;">Ambil Foto</h2>
                    <span class="close-modal" id="closeCameraModal" style="color: white; font-size: 28px;">&times;</span>
                </div>
                <div class="modal-body" style="text-align: center; padding: 0;">
                    <!-- Video Container -->
                    <div id="videoContainer" style="position: relative; background: #000; margin: 0 auto; overflow: hidden; border-radius: 10px; max-width: 400px;">
                        <video id="cameraPreview" autoplay playsinline
                               style="width: 100%; height: auto; display: block; transform: scaleX(-1);">
                        </video>
                       
                        <!-- Overlay bingkai SEDERHANA -->
                        <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0;
                                    border: 3px solid white; border-radius: 10px; pointer-events: none;">
                            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                                        width: 250px; height: 250px; border: 2px solid rgba(255,255,255,0.5);
                                        border-radius: 125px;"></div>
                        </div>
                    </div>
                   
                    <!-- Petunjuk Sederhana -->
                    <div style="color: white; margin-top: 15px; font-size: 14px; opacity: 0.8;">
                        <i class='bx bx-info-circle'></i> Posisikan wajah dalam lingkaran
                    </div>
                   
                    <!-- Tombol Aksi -->
                    <div style="margin-top: 30px; display: flex; justify-content: center; gap: 20px;">
                        <button id="cancelCamera" class="btn-cancel" style="padding: 12px 24px;">
                            <i class='bx bx-x'></i> Batal
                        </button>
                        <button id="capturePhoto" class="btn-save" style="padding: 12px 24px; background: #4CAF50;">
                            <i class='bx bx-camera'></i> Ambil Foto
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
       
        document.body.appendChild(cameraModal);
       
        const cameraPreview = document.getElementById('cameraPreview');
        cameraPreview.srcObject = stream;
       
        cameraPreview.play().then(() => {
            console.log('✅ Video kamera berjalan');
        }).catch(err => {
            console.error('❌ Gagal memutar video:', err);
            showNotification('Tidak dapat menampilkan kamera', 'warning');
        });
       
        document.getElementById('capturePhoto').addEventListener('click', function() {
            console.log('📸 Mengambil foto...');
           
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = cameraPreview.videoWidth;
            canvas.height = cameraPreview.videoHeight;
           
            context.translate(canvas.width, 0);
            context.scale(-1, 1);
            context.drawImage(cameraPreview, 0, 0, canvas.width, canvas.height);
           
            const imageUrl = canvas.toDataURL('image/jpeg', 0.8);
           
            stream.getTracks().forEach(track => track.stop());
            document.body.removeChild(cameraModal);
           
            openCropper(imageUrl);
        });
       
        function closeCamera() {
            console.log('❌ Menutup kamera...');
            stream.getTracks().forEach(track => track.stop());
            document.body.removeChild(cameraModal);
        }
       
        document.getElementById('closeCameraModal').addEventListener('click', closeCamera);
        document.getElementById('cancelCamera').addEventListener('click', closeCamera);
    }


    // ========== FUNGSI CROPPER ==========
function openCropper(imageSrc) {
    console.log('🎨 Membuka editor foto...');
   
    const cropperModal = document.createElement('div');
    cropperModal.id = 'cropperModal';
    cropperModal.innerHTML = `
        <div class="modal" style="display: block; z-index: 1004; background: rgba(0,0,0,0.95);">
            <div class="modal-content" style="max-width: 90%; max-height: 90vh; background: #1e1e1e; color: white;">
                <div class="modal-header" style="background: #2d2d2d; border-bottom: 1px solid #444;">
                    <h2 style="color: white;">
                        <i class='bx bx-crop'></i> Edit Foto
                    </h2>
                    <span class="close-modal" id="closeCropperModal" style="color: white;">&times;</span>
                </div>
                <div class="modal-body" style="padding: 20px;">
                    <!-- Area Cropper -->
                    <div style="margin-bottom: 20px; background: #000; border-radius: 8px; overflow: hidden; min-height: 300px;">
                        <img id="cropperImage" src="${imageSrc}"
                             style="max-width: 100%; max-height: 60vh; display: block; margin: 0 auto;">
                    </div>
                   
                    <!-- HAPUS PETUNJUK yang tidak relevan -->
                   
                    <!-- Tombol Simpan/Batal Saja -->
                    <div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;">
                        <button id="cancelCrop" class="btn-cancel" style="padding: 12px 30px;">
                            <i class='bx bx-x'></i> Batal
                        </button>
                        <button id="saveCroppedPhoto" class="btn-save" style="padding: 12px 30px;">
                            <i class='bx bx-check'></i> Simpan Foto
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
   
    document.body.appendChild(cropperModal);
   
    const cropperImage = document.getElementById('cropperImage');
    window.cropper = new Cropper(cropperImage, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: 'move',
        autoCropArea: 0.8,
        responsive: true,
        restore: true,
        guides: true,
        center: true,
        highlight: true,
        cropBoxMovable: true,
        cropBoxResizable: true,
        minCanvasWidth: 200,
        minCanvasHeight: 200,
        minCropBoxWidth: 150,
        minCropBoxHeight: 150,
        ready: function() {
            console.log('✅ Cropper siap digunakan');
        }
    });
   
    document.getElementById('saveCroppedPhoto').addEventListener('click', function() {
        applyCroppedImage();
    });
   
    document.getElementById('cancelCrop').addEventListener('click', function() {
        cancelCrop();
    });
   
    document.getElementById('closeCropperModal').addEventListener('click', function() {
        cancelCrop();
    });
}


   
    function applyCroppedImage() {
        if (!window.cropper) {
            showNotification('Cropper tidak tersedia', 'error');
            return;
        }
       
        try {
            const canvas = window.cropper.getCroppedCanvas({
                width: 400,
                height: 400,
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high'
            });
           
            if (!canvas) {
                throw new Error('Gagal membuat canvas dari cropper');
            }
           
            const croppedImageUrl = canvas.toDataURL('image/jpeg', 0.9);
            window.croppedProfileImage = croppedImageUrl;
           
            const cropperModal = document.getElementById('cropperModal');
            if (cropperModal) {
                document.body.removeChild(cropperModal);
            }
           
            if (window.cropper) {
                window.cropper.destroy();
                window.cropper = null;
            }
           
            showNotification('✅ Foto berhasil diedit! Menyimpan ke profil...', 'success');
           
            // LANGSUNG SIMPAN KE PROFIL
            updateProfilePicture(croppedImageUrl);
           
        } catch (error) {
            console.error('❌ Error saat crop:', error);
            showNotification('Gagal memproses foto', 'error');
        }
    }


    function cancelCrop() {
        if (window.cropper) {
            window.cropper.destroy();
            window.cropper = null;
        }
       
        const cropperModal = document.getElementById('cropperModal');
        if (cropperModal) {
            document.body.removeChild(cropperModal);
        }
       
        openModal(avatarModal);
    }


    // ========== FUNGSI UPDATE PROFILE PICTURE - INI YANG HILANG ==========
    async function updateProfilePicture(imageDataUrl) {
        console.log('🔄 Memulai update foto profil...');
        console.log('Gambar yang akan disimpan:', imageDataUrl ? 'ADA' : 'TIDAK ADA');
       
        if (!imageDataUrl) {
            showNotification('Tidak ada gambar untuk disimpan', 'error');
            return;
        }
       
        // 1. Update foto profil di UI
        const profileImageElement = document.getElementById('profileImage');
        if (profileImageElement) {
            console.log('✅ Element profileImage ditemukan, mengganti gambar...');
            profileImageElement.src = imageDataUrl;
           
            // Tambah efek visual
            profileImageElement.style.transition = 'transform 0.3s';
            profileImageElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                profileImageElement.style.transform = 'scale(1)';
            }, 300);
           
            console.log('✅ Foto profil UI diperbarui');
        } else {
            console.error('❌ Element profileImage tidak ditemukan');
            showNotification('Gagal memperbarui foto profil', 'error');
            return;
        }
       
        // 2. Update data user di localStorage
        if (currentUser) {
            currentUser.profile_picture = imageDataUrl;
            localStorage.setItem('user', JSON.stringify(currentUser));
            console.log('✅ Data user di localStorage diperbarui');
        }
       
        // 3. Upload ke server (jika ada API)
        try {
            console.log('📤 Mengupload ke server...');
            const response = await fetch(`${API_BASE}/upload-avatar`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: currentUser.username,
                    image: imageDataUrl
                })
            });
           
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Upload ke server berhasil:', data);
                showNotification('✅ Foto profil berhasil diperbarui!', 'success');
            } else {
                console.warn('⚠️ Upload gagal, tetap simpan di cache');
                showNotification('Foto disimpan di cache lokal', 'info');
            }
        } catch (error) {
            console.error('❌ Error upload:', error);
            showNotification('Foto disimpan di cache', 'info');
        }
       
        // 4. Reset dan tutup modal
        closeModals();
       
        // 5. Hapus cropper dan data temporary
        if (window.cropper) {
            window.cropper.destroy();
            window.cropper = null;
        }
        delete window.croppedProfileImage;
       
        console.log('✅ Proses update selesai');
    }


    function resetAvatarModal() {
        const cropContainer = document.getElementById('cropContainer');
        if (cropContainer) cropContainer.style.display = 'none';
       
        const saveContainer = document.getElementById('saveCropContainer');
        if (saveContainer) saveContainer.style.display = 'none';
       
        const avatarOptions = document.querySelectorAll('.modal-option');
        avatarOptions.forEach(btn => {
            btn.style.display = 'flex';
        });
       
        const avatarInput = document.getElementById('avatarInput');
        if (avatarInput) avatarInput.value = '';
    }


    // Hapus foto profil
    if (removeAvatar) {
        removeAvatar.addEventListener('click', async () => {
            if (profileImage) {
                profileImage.src = "assets/images/ikon_profil.avif";
               
                try {
                    await fetch(`${API_BASE}/remove-avatar`, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: currentUser.username
                        })
                    });
                   
                    currentUser.profile_picture = null;
                    localStorage.setItem('user', JSON.stringify(currentUser));
                   
                    showNotification("Foto profil dihapus!", "success");
                } catch (error) {
                    showNotification("Foto dihapus dari cache", "info");
                }
            }
            closeModals();
        });
    }
   
    // ========== SAVE PROFILE FUNCTION ==========
    async function handleSaveProfile() {
        const newFullname = fullNameInput ? fullNameInput.value.trim() : '';
        const newUsername = usernameInput ? usernameInput.value.trim() : '';
       
        if (!newFullname) {
            showNotification("Nama lengkap tidak boleh kosong!", "error");
            return;
        }
       
        if (!newUsername) {
            showNotification("Nama pengguna tidak boleh kosong!", "error");
            return;
        }
       
        // Jika hanya fullname yang berubah
        if (newFullname !== currentUser.fullname) {
            try {
                const response = await fetch(`${API_BASE}/update-fullname`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: currentUser.username,
                        newFullname: newFullname
                    })
                });
               
                const data = await response.json();
               
                if (!response.ok) {
                    showNotification(data.error || "Gagal update nama", "error");
                    return;
                }
               
                // Update local data
                currentUser.fullname = newFullname;
                localStorage.setItem('user', JSON.stringify(currentUser));
               
            } catch (error) {
                console.error('Error updating fullname:', error);
                showNotification("Gagal update nama", "error");
                return;
            }
        }
       
        // Jika username berubah (perlu endpoint khusus)
        if (newUsername !== currentUser.username) {
            showNotification("Fitur ubah username belum tersedia", "info");
            // Reset ke username lama
            if (usernameInput) usernameInput.value = currentUser.username;
        }
       
        // Update UI
        if (fullNameInput) fullNameInput.readOnly = true;
        if (usernameInput) usernameInput.readOnly = true;
        toggleActionButtons(true);
        showEditActions(false);
       
        showNotification("Profil berhasil diperbarui", "success");
       
        // Refresh data dari API
        fetchUserProfile();
    }
   
    // ========== HELPER FUNCTIONS ==========
    function openModal(modal) {
        if (!modal) return;
        modal.style.display = 'block';
        if (overlay) overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
   
    function closeModal(modal) {
        if (!modal) return;
        modal.style.display = 'none';
        if (overlay) overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
   
    function closeModals() {
        const modals = [passwordModal, avatarModal, confirmDeleteModal, finalDeleteModal];
        modals.forEach(modal => {
            if (modal) modal.style.display = 'none';
        });
       
        // Juga tutup modal kamera/cropper yang dibuat dinamis
        const cameraModal = document.getElementById('cameraModal');
        if (cameraModal) cameraModal.style.display = 'none';
       
        const cropperModal = document.getElementById('cropperModal');
        if (cropperModal) cropperModal.style.display = 'none';
       
        if (overlay) overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
   
    function showEditActions(show) {
        const editActions = document.querySelector('.edit-actions');
        if (editActions) {
            editActions.style.display = show ? 'flex' : 'none';
        }
    }
   
    function toggleActionButtons(show) {
        const actionButtons = document.querySelector('.action-buttons');
        if (actionButtons) {
            actionButtons.style.display = show ? 'flex' : 'none';
        }
    }
   
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class='bx ${type === 'success' ? 'bx-check-circle' : type === 'error' ? 'bx-error-circle' : 'bx-info-circle'}'></i>
                <span>${message}</span>
            </div>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#ff6b6b' : '#2196F3'};
            color: white;
            padding: 15px 20px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            z-index: 1002;
            animation: slideIn 0.3s ease;
            max-width: 300px;
            font-family: 'Poppins', sans-serif;
        `;
        document.body.appendChild(notification);
       
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }


    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModals();
        }
        if (e.altKey && e.key === 'ArrowLeft') {
            window.location.href = 'beranda.html';
        }
    });
});
