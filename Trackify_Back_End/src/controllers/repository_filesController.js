const repository_filesService = require('../services/repository_filesService');

// Upload file
async function uploadFile(req, res) {
    try {
        const user_id = req.user.id; // Ambil dari JWT token
        const { folder_id, file_name, file_url, file_type, file_size } = req.body;

        console.log('📤 Uploading file:', {
            user_id,
            folder_id,
            file_name,
            file_type,
            file_size
        });

        if (!folder_id || !file_name || !file_url || !file_type) {
            return res.status(400).json({ 
                error: "Missing required fields: folder_id, file_name, file_url, file_type" 
            });
        }

        const file = await repository_filesService.createFile(
            folder_id,
            user_id,
            file_name,
            file_url,
            file_type,
            file_size || 0
        );

        console.log('✅ File uploaded successfully:', file.id);

        res.status(201).json({
            message: "File uploaded successfully",
            data: file
        });
    } catch (error) {
        console.error("Upload file error:", error);
        res.status(500).json({ error: "Internal server error: " + error.message });
    }
}


// Get files in a folder
async function getFiles(req, res) {
    try {
        const { folderId } = req.params;


        const files = await repository_filesService.getFilesByFolderId(folderId);


        res.status(200).json(files);
    } catch (error) {
        console.error("Get files error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}


// Delete file
async function deleteFile(req, res) {
    try {
        const { id } = req.params;


        const file = await repository_filesService.deleteFile(id);


        res.status(200).json({
            message: "File deleted successfully",
            data: file
        });
    } catch (error) {
        console.error("Delete file error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    uploadFile,
    getFiles,
    deleteFile,
};

