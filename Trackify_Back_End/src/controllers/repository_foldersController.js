const repository_foldersService = require("../services/repository_foldersService");

// Create folder
async function createFolder(req, res) {
    try {
        const { user_id, folder_name, color } = req.body;

        const folder = await repository_foldersService.createFolder(
            user_id,
            folder_name,
            color
        );

        res.status(201).json({
            message: "Folder created successfully",
            data: folder
        });
    } catch (error) {
        console.error("Create folder error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// Get folders by user
async function getFolders(req, res) {
    try {
        const { userId } = req.params;

        const folders = await repository_foldersService.getFoldersByUserId(userId);

        res.status(200).json(folders);
    } catch (error) {
        console.error("Get folders error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// Update folder
async function updateFolder(req, res) {
    try {
        const { id } = req.params;
        const { folder_name, color } = req.body;

        const folder = await repository_foldersService.updateFolder(id, folder_name, color);

        res.status(200).json({
            message: "Folder updated successfully",
            data: folder
        });
    } catch (error) {
        console.error("Update folder error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

// Delete folder
async function deleteFolder(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const folder = await repository_foldersService.deleteFolder(id, userId);

        if (!folder) {
            return res.status(403).json({ 
                error: "Forbidden - Folder tidak ditemukan atau bukan milik user ini" 
            });
        }

        res.status(200).json({
            message: "Folder & its files deleted successfully",
            data: folder
        });
    } catch (error) {
        console.error("Delete folder error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    createFolder,
    getFolders,
    updateFolder,
    deleteFolder
};
