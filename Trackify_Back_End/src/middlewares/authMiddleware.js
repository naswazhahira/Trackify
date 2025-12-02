const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) return res.status(401).json({ error: 'Token tidak ditemukan. Akses ditolak.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('❌ Token verification failed:', err.message);
            return res.status(403).json({ error: 'Token tidak valid atau kadaluwarsa.' });
        }

        // DEBUG: Lihat isi user object
        console.log('✅ Authenticated user data:', user);
        
        // PASTIKAN USER ID ADA
        if (!user.id) {
            console.log('❌ User ID not found in token');
            return res.status(403).json({ error: 'Token tidak valid - user ID tidak ditemukan.' });
        }

        req.user = user;
        next();
    });
}

module.exports = authenticateToken;
