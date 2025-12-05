const express = require("express");
const router = express.Router();
const repository_filesController = require("../controllers/repository_filesController");
const authenticateToken = require('../middlewares/authMiddleware');


// Upload file
router.post("/files", repository_filesController.uploadFile);


// Get files in folder
router.get("/files/folder/:folderId", repository_filesController.getFiles);


// Delete single file
router.delete("/files/:id", repository_filesController.deleteFile);


module.exports = router;

