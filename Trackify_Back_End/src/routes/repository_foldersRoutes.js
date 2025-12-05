const express = require("express");
const router = express.Router();
const repository_foldersController = require("../controllers/repository_foldersController");
const authenticateToken = require('../middlewares/authMiddleware');

// Create folder
router.post("/", authenticateToken, repository_foldersController.createFolder);

// Get all folders by user
router.get("/user/:userId", authenticateToken, repository_foldersController.getFolders);

// Update folder
router.put("/:id", authenticateToken, repository_foldersController.updateFolder);

// Delete folder (+ files)
router.delete("/:id", authenticateToken, repository_foldersController.deleteFolder);

module.exports = router;

