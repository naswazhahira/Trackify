// script.js - Profil
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const backButton = document.getElementById('backButton');
    const editButton = document.getElementById('editButton');
    const deleteButton = document.getElementById('deleteButton');
    const editModal = document.getElementById('editModal');
    const confirmDeleteModal = document.getElementById('confirmDeleteModal');
    const overlay = document.getElementById('overlay');
    const closeModal = document.getElementById('closeModal');
    const changeUsernameBtn = document.getElementById('changeUsername');
    const changePasswordBtn = document.getElementById('changePassword');
    const forgotPasswordBtn = document.getElementById('forgotPassword');
    const confirmYes = document.getElementById('confirmYes');
    const confirmNo = document.getElementById('confirmNo');
    const avatarIcon = document.querySelector('.avatar .icon');


    // Modal baru
    const usernameModal = document.getElementById('usernameModal');
    const passwordModal = document.getElementById('passwordModal');
    const forgotPasswordModal = document.getElementById('forgotPasswordModal');
   
    // Tombol modal baru
    const closeUsernameModal = document.getElementById('closeUsernameModal');
    const closePasswordModal = document.getElementById('closePasswordModal');
    const closeForgotPasswordModal = document.getElementById('closeForgotPasswordModal');
    const cancelUsername = document.getElementById('cancelUsername');
    const cancelPassword = document.getElementById('cancelPassword');
    const cancelForgotPassword = document.getElementById('cancelForgotPassword');
    const submitUsername = document.getElementById('submitUsername');
    const submitPassword = document.getElementById('submitPassword');
    const submitForgotPassword = document.getElementById('submitForgotPassword');
   
    // Input fields
    const newUsernameInput = document.getElementById('newUsername');
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const emailForgotInput = document.getElementById('emailForgot');


    console.log('🔍 Profile Elements Check:', {
        backButton: !!backButton,
        editButton: !!editButton,
        deleteButton: !!deleteButton,
        editModal: !!editModal,
        confirmDeleteModal: !!confirmDeleteModal,
        overlay: !!overlay,
        closeModal: !!closeModal
    });


    // Load user data from localStorage
    loadUserData();


    // ==================== BACK BUTTON - DIKOREKSI ====================
    if (backButton) {
        backButton.addEventListener('click', () => {
            console.log('🔙 Back button clicked - Redirecting to beranda.html');
            // Redirect ke halaman beranda
            window.location.href = 'beranda.html';
        });
       
        // Juga tambahkan event listener untuk ikon panah jika ada
        const backIcon = document.querySelector('.back-icon');
        if (backIcon) {
            backIcon.addEventListener('click', () => {
                window.location.href = 'beranda.html';
            });
        }
    } else {
        console.error('❌ Back button not found');
       
        // Fallback: buat back button jika tidak ada
        createBackButtonFallback();
    }


    // ==================== TOMBOL EDIT ====================
    if (editButton) {
        editButton.addEventListener('click', () => {
            console.log('✏️ Edit button clicked');
            openModal(editModal);
        });
    } else {
        console.error('❌ Edit button not found');
    }


    // Delete Button - Open Confirm Modal
    if (deleteButton) {
        deleteButton.addEventListener('click', () => {
            openModal(confirmDeleteModal);
        });
    }


    // Close Modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            closeModals();
        });
    }


    // Confirm No
    if (confirmNo) {
        confirmNo.addEventListener('click', () => {
            closeModals();
        });
    }


    // Confirm Yes - Delete Account
    if (confirmYes) {
        confirmYes.addEventListener('click', () => {
            if (confirm('Apakah Anda benar-benar yakin? Tindakan ini akan menghapus semua data Anda secara permanen.')) {
                deleteAccount();
            }
        });
    }


    // Overlay Click
    if (overlay) {
        overlay.addEventListener('click', () => {
            closeModals();
        });
    }


    // Change Username
    if (changeUsernameBtn) {
        changeUsernameBtn.addEventListener('click', () => {
            closeModals();
            const currentUsername = document.getElementById('usernameDisplay').textContent;
            newUsernameInput.value = currentUsername;
            if (emailForgotInput) {
                emailForgotInput.value = document.getElementById('emailDisplay').textContent;
            }
            openModal(usernameModal);
        });
    }


    // Change Password
    if (changePasswordBtn) {
        changePasswordBtn.addEventListener('click', () => {
            closeModals();
            // Reset form
            if (currentPasswordInput) currentPasswordInput.value = '';
            if (newPasswordInput) newPasswordInput.value = '';
            if (confirmPasswordInput) confirmPasswordInput.value = '';
            openModal(passwordModal);
        });
    }


    // Forgot Password
    if (forgotPasswordBtn) {
        forgotPasswordBtn.addEventListener('click', () => {
            closeModals();
            if (emailForgotInput) {
                emailForgotInput.value = document.getElementById('emailDisplay').textContent;
            }
            openModal(forgotPasswordModal);
        });
    }


    // Avatar Change
    if (avatarIcon) {
        avatarIcon.addEventListener('click', () => {
            showNotification('Fitur upload foto profil akan segera tersedia!', 'info');
        });
    }


    // Close modal baru
    if (closeUsernameModal) {
        closeUsernameModal.addEventListener('click', () => closeModals());
    }
    if (closePasswordModal) {
        closePasswordModal.addEventListener('click', () => closeModals());
    }
    if (closeForgotPasswordModal) {
        closeForgotPasswordModal.addEventListener('click', () => closeModals());
    }
    if (cancelUsername) {
        cancelUsername.addEventListener('click', () => closeModals());
    }
    if (cancelPassword) {
        cancelPassword.addEventListener('click', () => closeModals());
    }
    if (cancelForgotPassword) {
        cancelForgotPassword.addEventListener('click', () => closeModals());
    }


    // Submit Username
    if (submitUsername) {
        submitUsername.addEventListener('click', () => {
            const newName = newUsernameInput.value.trim();
            if (newName === "") {
                showNotification("Username tidak boleh kosong!", 'error');
                return;
            }
            changeUsername(newName);
            closeModals();
        });
    }


    // Submit Password
    if (submitPassword) {
        submitPassword.addEventListener('click', () => {
            const currentPass = currentPasswordInput.value;
            const newPass = newPasswordInput.value;
            const confirmPass = confirmPasswordInput.value;


            if (!currentPass) {
                showNotification("Password saat ini harus diisi!", 'error');
                return;
            }


            if (newPass.length < 6) {
                showNotification("Password minimal 6 karakter!", 'error');
                return;
            }


            if (newPass !== confirmPass) {
                showNotification("Password baru tidak cocok!", 'error');
                return;
            }


            showNotification("Password berhasil diganti!", 'success');
            closeModals();
        });
    }


    // Submit Forgot Password
    if (submitForgotPassword) {
        submitForgotPassword.addEventListener('click', () => {
            const email = emailForgotInput.value;
            showNotification(`Link reset password telah dikirim ke ${email}`, 'success');
            closeModals();
        });
    }


    // ==================== FUNGSI TAMBAHAN ====================
    function createBackButtonFallback() {
        // Buat tombol back otomatis jika tidak ada di HTML
        const fallbackBackBtn = document.createElement('button');
        fallbackBackBtn.id = 'fallbackBackButton';
        fallbackBackBtn.innerHTML = '⬅ Kembali ke Beranda';
        fallbackBackBtn.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: #667eea;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 10px;
            cursor: pointer;
            z-index: 1000;
            font-family: 'Poppins', sans-serif;
        `;
       
        fallbackBackBtn.addEventListener('click', () => {
            window.location.href = 'beranda.html';
        });
       
        document.body.appendChild(fallbackBackBtn);
        console.log('✅ Fallback back button created');
    }


    // ==================== KEYBOARD SHORTCUT ====================
    document.addEventListener('keydown', function(e) {
        // ESC key untuk tutup modal atau kembali
        if (e.key === 'Escape') {
            const anyModalOpen =
                (editModal && editModal.style.display === 'block') ||
                (confirmDeleteModal && confirmDeleteModal.style.display === 'block') ||
                (usernameModal && usernameModal.style.display === 'block') ||
                (passwordModal && passwordModal.style.display === 'block') ||
                (forgotPasswordModal && forgotPasswordModal.style.display === 'block');
           
            if (anyModalOpen) {
                closeModals();
            } else {
                // Jika tidak ada modal terbuka, ESC akan kembali ke beranda
                window.location.href = 'beranda.html';
            }
        }
       
        // Alt + ArrowLeft untuk kembali
        if (e.altKey && e.key === 'ArrowLeft') {
            window.location.href = 'beranda.html';
        }
    });


    // Functions
    function openModal(modal) {
        if (!modal) {
            console.error('❌ Modal not found:', modal);
            return;
        }
        modal.style.display = 'block';
        if (overlay) overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        console.log('✅ Modal opened:', modal.id);
    }


    function closeModals() {
        const modals = [
            editModal,
            confirmDeleteModal,
            usernameModal,
            passwordModal,
            forgotPasswordModal
        ];
       
        modals.forEach(modal => {
            if (modal) {
                modal.style.display = 'none';
            }
        });
       
        if (overlay) overlay.style.display = 'none';
        document.body.style.overflow = 'auto';
        console.log('✅ All modals closed');
    }


    function changeUsername(newName) {
        const usernameDisplay = document.getElementById('usernameDisplay');
        if (usernameDisplay) {
            usernameDisplay.textContent = newName;
        }
        saveUserData();
       
        // Show success notification
        showNotification(`Username berhasil diubah menjadi: ${newName}`, 'success');
    }


    function deleteAccount() {
        // Simulasi penghapusan akun
        localStorage.removeItem('userProfile');
        localStorage.removeItem('currentUser'); // Juga hapus current user
       
        showNotification('Akun berhasil dihapus', 'error');
       
        setTimeout(() => {
            alert('Akun Anda telah dihapus. Anda akan dialihkan ke halaman utama.');
            window.location.href = 'regis.html'; // Redirect ke halaman login
        }, 2000);
    }


    function saveUserData() {
        const emailDisplay = document.getElementById('emailDisplay');
        const usernameDisplay = document.getElementById('usernameDisplay');
       
        if (emailDisplay && usernameDisplay) {
            const userData = {
                email: emailDisplay.textContent,
                username: usernameDisplay.textContent
            };
            localStorage.setItem('userProfile', JSON.stringify(userData));
            console.log('💾 User data saved:', userData);
        }
    }


    function loadUserData() {
        // Coba load dari currentUser dulu (dari login)
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const savedData = localStorage.getItem('userProfile');
       
        const emailDisplay = document.getElementById('emailDisplay');
        const usernameDisplay = document.getElementById('usernameDisplay');
       
        if (!emailDisplay || !usernameDisplay) {
            console.error('❌ Display elements not found');
            return;
        }


        if (currentUser) {
            // Gunakan data dari login
            emailDisplay.textContent = currentUser.email || `${currentUser.username}@gmail.com`;
            usernameDisplay.textContent = currentUser.username || 'user';
            console.log('✅ Loaded from currentUser:', currentUser);
        } else if (savedData) {
            // Gunakan data yang disimpan
            const userData = JSON.parse(savedData);
            emailDisplay.textContent = userData.email || 'user@gmail.com';
            usernameDisplay.textContent = userData.username || 'user';
            console.log('✅ Loaded from userProfile:', userData);
        } else {
            // Data default
            emailDisplay.textContent = 'user@gmail.com';
            usernameDisplay.textContent = 'user';
            console.log('✅ Using default data');
        }
    }


    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class='bx ${type === 'success' ? 'bx-check-circle' : type === 'error' ? 'bx-error-circle' : 'bx-info-circle'}'></i>
                <span>${message}</span>
            </div>
        `;


        // Add styles
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


        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }


    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        .notification-content {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .notification-content i {
            font-size: 20px;
        }
    `;
    document.head.appendChild(style);


    // Debug: Check if all required elements exist
    console.log('🔍 Final Check - Required Elements:', {
        backButton: !!backButton,
        editButton: !!editButton,
        editModal: !!editModal,
        overlay: !!overlay
    });
});


// Handle browser back button
window.addEventListener('popstate', function() {
    const modals = document.querySelectorAll('.modal, .confirm-modal, .input-modal');
    const overlay = document.getElementById('overlay');
   
    modals.forEach(modal => {
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    });
   
    if (overlay) {
        overlay.style.display = 'none';
    }
    document.body.style.overflow = 'auto';
});


// Error handling global
window.addEventListener('error', function(e) {
    console.error('❌ Global Error:', e.error);
});

