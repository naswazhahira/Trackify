
document.addEventListener('DOMContentLoaded', function() {
    const USERS_KEY = "trackify_users";              
    const ACTIVE_USER_KEY = "activeUser";    

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
    const newPasswordInput = document.getElementById('newPasswordInput');
    const confirmNewPasswordInput = document.getElementById('confirmNewPasswordInput');
    const recoveryPinInput = document.getElementById('recoveryPinInput');
    const newPasswordInputForgot = document.getElementById('newPasswordInputForgot');
    const confirmNewPasswordInputForgot = document.getElementById('confirmNewPasswordInputForgot');

    const cancelResetStage1 = document.getElementById('cancelResetStage1');
    const cancelResetStage2 = document.getElementById('cancelResetStage2');
    const cancelLupaPassword = document.getElementById('cancelLupaPassword');
    const cancelForgotStage2 = document.getElementById('cancelForgotStage2');

    let currentUser = null;
    let originalUsername = null; 

    // Muat data user
    loadUserData();

    //  Tombol Navigasi 
    if (backButton) backButton.addEventListener('click', () => window.location.href = 'beranda.html');

    //  Edit Profil 
    if (editButton) editButton.addEventListener('click', () => {
        fullNameInput.readOnly = false;
        usernameInput.readOnly = false;
        toggleActionButtons(false); 
        showEditActions(true);
        fullNameInput.focus();
    });

    if (saveButton) saveButton.addEventListener('click', handleSaveProfile);

    if (cancelButton) cancelButton.addEventListener('click', () => {
        if (currentUser) {
            fullNameInput.value = currentUser.fullname;
            usernameInput.value = currentUser.username;
        }
        fullNameInput.readOnly = true;
        usernameInput.readOnly = true;
        toggleActionButtons(true);
        showEditActions(false);
    });

    //  Kelola Password 
    if (passwordButton) {
        passwordButton.addEventListener('click', () => {
            openModal(passwordModal);
            showPasswordTab('reset');
            setTimeout(() => {
                updateResetStage2Buttons();
                updateForgotStage2Buttons();
                updateResetStage1Buttons();
                updateForgotStage1Buttons();
            }, 0);
        });
    }

    if (tabReset) tabReset.addEventListener('click', () => showPasswordTab('reset'));
    if (tabForgot) tabForgot.addEventListener('click', () => showPasswordTab('forgot'));

    function showPasswordTab(tab) {
        resetStage1.style.display = 'none';
        resetStage2.style.display = 'none';
        forgotPasswordTab.style.display = 'none';
        forgotStage2.style.display = 'none';
        clearPasswordInputs();

        tabReset.classList.toggle('active', tab === 'reset');
        tabForgot.classList.toggle('active', tab === 'forgot');

        if (tab === 'reset') resetStage1.style.display = 'block';
        else if (tab === 'forgot') forgotPasswordTab.style.display = 'block';

        updateResetStage2Buttons();
        updateForgotStage2Buttons();
        updateResetStage1Buttons();
        updateForgotStage1Buttons();
    }


    // validasi tahap 1 reset password 
    if (verifyCurrentPassword) {
        verifyCurrentPassword.addEventListener('click', () => {
            const pwdInput = document.getElementById('currentPasswordInput').value.trim();
            if (!pwdInput) return showNotification("Silakan masukkan kata sandi akun!", "error");
            if (!currentUser || typeof currentUser.password === 'undefined') return showNotification("Akun tidak ditemukan.", "error");
            if (pwdInput !== currentUser.password) return showNotification("Password salah!", "error");

            resetStage1.style.display = 'none';
            resetStage2.style.display = 'block';
            newPasswordInput.focus();
            updateResetStage2Buttons();
        });

        const currentPwdInputEl = document.getElementById('currentPasswordInput');
        if (currentPwdInputEl) {
            currentPwdInputEl.addEventListener('input', updateResetStage1Buttons);
        }
    }

    // simpan password baru hanya jika minimal 5 karakter 
    if (saveNewPassword) {
        saveNewPassword.addEventListener('click', () => {
            const newPwd = newPasswordInput.value.trim();
            const confirmPwd = confirmNewPasswordInput.value.trim();
            if (!newPwd || !confirmPwd) return showNotification("Lengkapi semua kolom!", "error");
            if (newPwd.length < 5) return showNotification("Password minimal 5 karakter!", "error"); // perubahan: enforce min length
            if (newPwd !== confirmPwd) return showNotification("Password baru tidak cocok!", "error");

            if (!currentUser) return showNotification("Akun tidak ditemukan.", "error");
            currentUser.password = newPwd;
            updateUserProfile();
            showNotification("Password berhasil diubah!", "success");
            closeModals();
        });

        newPasswordInput && newPasswordInput.addEventListener('input', updateResetStage2Buttons);
        confirmNewPasswordInput && confirmNewPasswordInput.addEventListener('input', updateResetStage2Buttons);
    }

    if (verifyRecoveryPin) {
        verifyRecoveryPin.addEventListener('click', () => {
            const pinInput = recoveryPinInput.value.trim();
            if (!pinInput) return showNotification("Silakan masukkan PIN pemulihan!", "error");
            if (!currentUser) return showNotification("Akun tidak ditemukan.", "error");
            if (typeof currentUser.pin === 'undefined' || currentUser.pin === null) {
                return showNotification("PIN pemulihan tidak tersedia untuk akun ini.", "error");
            }
            if (pinInput !== String(currentUser.pin)) return showNotification("PIN pemulihan salah!", "error");

            forgotPasswordTab.style.display = 'none';
            forgotStage2.style.display = 'block';
            newPasswordInputForgot.focus();
            updateForgotStage2Buttons();
        });

        // disable lanjut jika pin field kosong
        recoveryPinInput && recoveryPinInput.addEventListener('input', updateForgotStage1Buttons);
    }

    if (saveNewPasswordForgot) {
        saveNewPasswordForgot.addEventListener('click', () => {
            const newPwd = newPasswordInputForgot.value.trim();
            const confirmPwd = confirmNewPasswordInputForgot.value.trim();
            if (!newPwd || !confirmPwd) return showNotification("Lengkapi semua kolom!", "error");
            if (newPwd.length < 5) return showNotification("Password minimal 5 karakter!", "error"); 
            if (newPwd !== confirmPwd) return showNotification("Password baru tidak cocok!", "error");

            if (!currentUser) return showNotification("Akun tidak ditemukan.", "error");
            currentUser.password = newPwd;
            updateUserProfile();
            showNotification("Password berhasil diubah!", "success");
            closeModals();
        });

        newPasswordInputForgot && newPasswordInputForgot.addEventListener('input', updateForgotStage2Buttons);
        confirmNewPasswordInputForgot && confirmNewPasswordInputForgot.addEventListener('input', updateForgotStage2Buttons);
    }

    [cancelResetStage1, cancelResetStage2, cancelLupaPassword, cancelForgotStage2].forEach(btn => {
        if (btn) btn.addEventListener('click', () => closeModals());
    });

    //  Hapus Akun 
    if (deleteButton) deleteButton.addEventListener('click', () => openModal(confirmDeleteModal));

    if (confirmNo) confirmNo.addEventListener('click', () => closeModals());
    if (confirmYes) confirmYes.addEventListener('click', () => {
        const pwd = confirmPasswordInput.value.trim();
        if (!pwd) return showNotification("Silakan masukkan kata sandi akun!", "error");
        if (!currentUser || pwd !== currentUser.password) return showNotification("Password salah, akun tidak dihapus", "error");

        closeModal(confirmDeleteModal);   
        openModal(finalDeleteModal);      
        confirmPasswordInput.value = '';
    });

    if (finalNo) finalNo.addEventListener('click', () => closeModals());
    if (finalYes) finalYes.addEventListener('click', deleteAccount);

    //  Edit Foto Profil 
    if (editAvatar) editAvatar.addEventListener('click', () => openModal(avatarModal));
    if (closeAvatarModal) closeAvatarModal.addEventListener('click', closeModals);

    if (changeAvatar) changeAvatar.addEventListener('click', () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/*';
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = function() {
                profileImage.src = reader.result;
                if (!currentUser) currentUser = {};
                currentUser.profilePic = reader.result;
                updateUserProfile();
                closeModals();
                showNotification("Foto profil berhasil diubah!", "success");
            };
            reader.readAsDataURL(file);
        });
        fileInput.click();
    });

    if (removeAvatar) removeAvatar.addEventListener('click', () => {
        profileImage.src = "assets/images/ikon_profil.avif";
        if (!currentUser) currentUser = {};
        currentUser.profilePic = null;
        updateUserProfile();
        closeModals();
        showNotification("Foto profil dihapus!", "info");
    });

    function loadUserData() {
        const users = loadUsers();
        const activeUsername = localStorage.getItem(ACTIVE_USER_KEY);

        if (!users.length || !activeUsername) {
            currentUser = { fullname: 'User', username: 'user', password: '', profilePic: null, pin: null }; 
            originalUsername = currentUser.username; 
        } else {
            currentUser = users.find(u => u.username === activeUsername);
            originalUsername = activeUsername; 
        }

        if (currentUser) {
            fullNameInput.value = currentUser.fullname || '';
            usernameInput.value = currentUser.username || '';
            if (currentUser.profilePic) profileImage.src = currentUser.profilePic;
        }
    }

    function saveUsers(users) { localStorage.setItem(USERS_KEY, JSON.stringify(users)); }
    function loadUsers() { const raw = localStorage.getItem(USERS_KEY); return raw ? JSON.parse(raw) : []; }

    function updateUserProfile() {
        const users = loadUsers();
        const idx = users.findIndex(u => u.username === originalUsername);
        if (idx !== -1) {
            users[idx] = { ...currentUser };
            saveUsers(users);
            localStorage.setItem(ACTIVE_USER_KEY, currentUser.username);
            originalUsername = currentUser.username;
        } else {
            const idx2 = users.findIndex(u => u.username === currentUser.username);
            if (idx2 !== -1) {
                users[idx2] = { ...currentUser };
                saveUsers(users);
                localStorage.setItem(ACTIVE_USER_KEY, currentUser.username);
                originalUsername = currentUser.username;
            } else {
                users.push({ ...currentUser });
                saveUsers(users);
                localStorage.setItem(ACTIVE_USER_KEY, currentUser.username);
                originalUsername = currentUser.username;
                console.warn("updateUserProfile: user tidak ditemukan, menambahkan sebagai user baru.");
            }
        }
    }

    function handleSaveProfile() {
        if (!currentUser) currentUser = {};
        const newFull = fullNameInput.value.trim();
        const newUser = usernameInput.value.trim();

        if (!newFull) return showNotification("Nama lengkap tidak boleh kosong!", "error");
        if (!newUser) return showNotification("Nama pengguna tidak boleh kosong!", "error");

        const users = loadUsers();
        const taken = users.some(u => u.username === newUser && u.username !== originalUsername);
        if (taken) return showNotification("Nama pengguna sudah digunakan oleh akun lain!", "error");

        currentUser.fullname = newFull;
        currentUser.username = newUser;
        updateUserProfile();

        fullNameInput.readOnly = true;
        usernameInput.readOnly = true;
        toggleActionButtons(true);
        showEditActions(false);
        showNotification("Profil berhasil diperbarui", "success");
    }

    function deleteAccount() {
        let users = loadUsers();
        users = users.filter(u => u.username !== currentUser.username);
        saveUsers(users);
        localStorage.removeItem(ACTIVE_USER_KEY);
        showNotification("Akun berhasil dihapus", "error");
        setTimeout(() => window.location.href = 'index.html', 1500);
    }

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
        [passwordModal, avatarModal, confirmDeleteModal, finalDeleteModal].forEach(m => closeModal(m));
        resetStage1 && (resetStage1.style.display = 'block');
        resetStage2 && (resetStage2.style.display = 'none');
        forgotPasswordTab && (forgotPasswordTab.style.display = 'none');
        forgotStage2 && (forgotStage2.style.display = 'none');
        clearPasswordInputs();
    }

    function clearPasswordInputs() {
        const currentPwdEl = document.getElementById('currentPasswordInput');
        if (currentPwdEl) currentPwdEl.value = '';
        if (newPasswordInput) newPasswordInput.value = '';
        if (confirmNewPasswordInput) confirmNewPasswordInput.value = '';
        if (recoveryPinInput) recoveryPinInput.value = '';
        if (newPasswordInputForgot) newPasswordInputForgot.value = '';
        if (confirmNewPasswordInputForgot) confirmNewPasswordInputForgot.value = '';
        updateResetStage2Buttons();
        updateForgotStage2Buttons();
        updateResetStage1Buttons();
        updateForgotStage1Buttons();
    }

    function showEditActions(show) {
        const editActions = document.querySelector('.edit-actions');
        if (editActions) editActions.style.display = show ? 'flex' : 'none';
    }

    function toggleActionButtons(show) {
        const actionButtons = document.querySelector('.action-buttons');
        if (actionButtons) actionButtons.style.display = show ? 'flex' : 'none';
    }

    function updateResetStage1Buttons() {
        const currentPwdEl = document.getElementById('currentPasswordInput');
        if (!verifyCurrentPassword) return;
        if (!currentPwdEl) {
            verifyCurrentPassword.disabled = true;
            return;
        }
        verifyCurrentPassword.disabled = currentPwdEl.value.trim().length === 0;
    }

    function updateResetStage2Buttons() {
        if (!saveNewPassword) return;
        const newPwd = newPasswordInput ? newPasswordInput.value.trim() : '';
        const confirmPwd = confirmNewPasswordInput ? confirmNewPasswordInput.value.trim() : '';
        const enabled = newPwd.length >= 5 && confirmPwd.length >= 5 && newPwd === confirmPwd;
        saveNewPassword.disabled = !enabled;
    }

    function updateForgotStage1Buttons() {
        if (!verifyRecoveryPin) return;
        const pinVal = recoveryPinInput ? recoveryPinInput.value.trim() : '';
        verifyRecoveryPin.disabled = pinVal.length === 0;
    }

    function updateForgotStage2Buttons() {
        if (!saveNewPasswordForgot) return;
        const newPwd = newPasswordInputForgot ? newPasswordInputForgot.value.trim() : '';
        const confirmPwd = confirmNewPasswordInputForgot ? confirmNewPasswordInputForgot.value.trim() : '';
        const enabled = newPwd.length >= 5 && confirmPwd.length >= 5 && newPwd === confirmPwd;
        saveNewPasswordForgot.disabled = !enabled;
    }

    (function attachRealtimeValidators() {
        const currentPwdEl = document.getElementById('currentPasswordInput');
        if (currentPwdEl && verifyCurrentPassword) currentPwdEl.addEventListener('input', updateResetStage1Buttons);

        if (newPasswordInput) newPasswordInput.addEventListener('input', updateResetStage2Buttons);
        if (confirmNewPasswordInput) confirmNewPasswordInput.addEventListener('input', updateResetStage2Buttons);

        if (recoveryPinInput) recoveryPinInput.addEventListener('input', updateForgotStage1Buttons);

        if (newPasswordInputForgot) newPasswordInputForgot.addEventListener('input', updateForgotStage2Buttons);
        if (confirmNewPasswordInputForgot) confirmNewPasswordInputForgot.addEventListener('input', updateForgotStage2Buttons);

        if (fullNameInput) fullNameInput.addEventListener('input', () => {
        });
        if (usernameInput) usernameInput.addEventListener('input', () => {
        });
    })();

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
            setTimeout(() => { if (notification.parentNode) notification.parentNode.removeChild(notification); }, 300);
        }, 3000);
    }

    // ==================== Keyboard Shortcut ====================
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModals();
        if (e.altKey && e.key === 'ArrowLeft') window.location.href = 'beranda.html';
    });

    // ==================== Global Error Handler ====================
    window.addEventListener('error', function(e) { console.error('❌ Global Error:', e.error); });
});