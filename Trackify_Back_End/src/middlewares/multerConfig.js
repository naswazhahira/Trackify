const multer = require('multer');

// Multer memory storage untuk handle base64 files
const storage = multer.memoryStorage();

// Filter untuk validasi file type
const fileFilter = (req, file, cb) => {
    // Accept semua file type untuk sekarang
    cb(null, true);
};

// Multer configuration dengan limit 10MB
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB
    },
    fileFilter: fileFilter
});

module.exports = upload;
