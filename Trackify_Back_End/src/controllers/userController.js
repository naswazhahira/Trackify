const userService = require('../services/userService');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;

// Registrasi user baru
async function registerUser(req, res) {
    try {
        const { fullname, username, password } = req.body;
        if (!fullname || !username || !password) {
            return res.status(400).json({ error: 'Semua kolom wajib diisi.' });
        }

        const existingUser = await userService.findUserByUsername(username);
        if (existingUser) {
            return res.status(409).json({ error: 'Nama pengguna sudah digunakan.' });
        }

        // Buat PIN 4 digit
        const pin = String(Math.floor(1000 + Math.random() * 9000));

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
        const pinHash = await bcrypt.hash(pin, SALT_ROUNDS);

        const newUser = await userService.createUser(fullname, username, passwordHash, pinHash);

        return res.status(201).json({
            message: 'Registrasi berhasil.',
            user: {
                username: newUser.username,
                fullname: newUser.fullname,
                pin: pin
            }
        });
    } catch (err) {
        console.error('Error detail:', err);
        return res.status(500).json({ error: err.message, stack: err.stack });
    }
}

// Login user
async function loginUser(req, res) {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Nama pengguna dan kata sandi wajib diisi.' });
        }

        const user = await userService.findUserByUsername(username);
        if (!user) {
            return res.status(404).json({ error: 'Akun tidak ditemukan. Pastikan informasi sudah benar atau lakukan registrasi jika belum memiliki akun.' });
        }

        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) return res.status(401).json({ error: 'Kata sandi salah. Silakan coba lagi.' });

        // Generate token JWT
        const token = jwt.sign(
            { username: user.username, fullname: user.fullname },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return res.status(200).json({ 
            message: `Selamat datang kembali, ${user.fullname}!`, 
            user: { username: user.username, fullname: user.fullname, profilePicture: user.profile_picture },
            token
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Verifikasi PIN untuk pemulihan password
async function verifyPin(req, res) {
    try {
        const { username, pin } = req.body;
        if (!username || !pin) {
            return res.status(400).json({ error: 'Username dan PIN wajib diisi.' });
        }

        const user = await userService.verifyUserPin(username, pin);
        if (!user) {
            return res.status(401).json({ error: 'PIN salah atau user tidak ditemukan.' });
        }

        return res.status(200).json({ message: 'PIN terverifikasi.', username: user.username });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Reset password setelah verifikasi PIN
async function resetPassword(req, res) {
    try {
        const { username, newPassword } = req.body;
        if (!username || !newPassword) {
            return res.status(400).json({ error: 'Username dan password baru wajib diisi.' });
        }

        const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
        const updatedUser = await userService.updateUserPassword(username, passwordHash);
        if (!updatedUser) {
            return res.status(404).json({ error: 'User tidak ditemukan.' });
        }

        return res.status(200).json({ message: 'Password berhasil diubah.', user: updatedUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Update nama lengkap
async function updateFullname(req, res) {
    try {
        const { username, newFullname } = req.body;
        if (!username || !newFullname) {
            return res.status(400).json({ error: 'Username dan fullname baru wajib diisi.' });
        }

        const updatedUser = await userService.updateUserFullname(username, newFullname);
        return res.status(200).json({ message: 'Nama lengkap diperbarui.', user: updatedUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Update username
async function updateUsername(req, res) {
    try {
        const { oldUsername, newUsername } = req.body;
        if (!oldUsername || !newUsername) {
            return res.status(400).json({ error: 'Old dan new username wajib diisi.' });
        }

        const exists = await userService.findUserByUsername(newUsername);
        if (exists) {
            return res.status(409).json({ error: 'Username baru sudah digunakan.' });
        }

        const updatedUser = await userService.updateUsername(oldUsername, newUsername);
        return res.status(200).json({ message: 'Username diperbarui.', user: updatedUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Update password
async function updatePassword(req, res) {
    try {
        const { username, newPassword } = req.body;
        if (!username || !newPassword) {
            return res.status(400).json({ error: 'Username dan password baru wajib diisi.' });
        }

        const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
        const updatedUser = await userService.updateUserPassword(username, passwordHash);
        return res.status(200).json({ message: 'Password diperbarui.', user: updatedUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Update atau hapus foto profil
async function updateProfilePic(req, res) {
    try {
        const { username, profilePictureUrl } = req.body;
        if (!username) {
            return res.status(400).json({ error: 'Username wajib diisi.' });
        }

        let updatedUser;
        if (profilePictureUrl) {
            updatedUser = await userService.updateProfilePicture(username, profilePictureUrl);
        } else {
            updatedUser = await userService.removeProfilePicture(username);
        }

        return res.status(200).json({ message: 'Foto profil diperbarui.', user: updatedUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

// Hapus akun
async function deleteUser(req, res) {
    try {
        const { username } = req.body;
        if (!username) {
            return res.status(400).json({ error: 'Username wajib diisi.' });
        }

        const deletedUser = await userService.deleteUser(username);
        return res.status(200).json({ message: 'Akun dihapus.', user: deletedUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Terjadi kesalahan server.' });
    }
}

module.exports = {
    registerUser,
    loginUser,
    verifyPin,
    resetPassword,
    updateFullname,
    updateUsername,
    updatePassword,
    updateProfilePic,
    deleteUser
};
