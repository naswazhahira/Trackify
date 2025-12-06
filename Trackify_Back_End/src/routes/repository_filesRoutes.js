const express = require("express");
const router = express.Router();
const repository_filesController = require("../controllers/repository_filesController");
const authenticateToken = require('../middlewares/authMiddleware');


// Upload file (POST /api/repository_files)
router.post("/", authenticateToken, repository_filesController.uploadFile);


// Get files in folder (GET /api/repository_files/:folderId)
router.get("/:folderId", authenticateToken, repository_filesController.getFiles);


// Delete single file (DELETE /api/repository_files/:id)
router.delete("/:id", authenticateToken, repository_filesController.deleteFile);

module.exports = router;
