const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authMiddleware');


// Registrasi user baru
router.post('/register', userController.registerUser);


// Login user
router.post('/login', userController.loginUser);


// Verifikasi PIN untuk lupa password
router.put('/verify-pin', userController.verifyPin);


// Reset password setelah verifikasi PIN
router.put('/reset-password', userController.resetPassword);


// Update nama lengkap
router.put('/update-fullname', authenticateToken, userController.updateFullname);


// Update username
router.put('/update-username', authenticateToken, userController.updateUsername);


// Update password
router.put('/update-password', authenticateToken, userController.updatePassword);


// Update atau hapus foto profil
router.put('/update-profile-picture', authenticateToken, userController.updateProfilePic);


// Hapus akun user
router.delete('/delete-user', authenticateToken, userController.deleteUser);


// Get user profile
router.get('/profile', authenticateToken, userController.getUserProfile);
module.exports = router;
