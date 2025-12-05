const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

const userRoutes = require('./src/routes/userRoutes');
const goalsRoutes = require('./src/routes/goalsRoutes');
const studysessionRoutes = require('./src/routes/studysessionRoutes');
const dailySummaryRoutes = require('./src/routes/dailySummaryRoutes');
const repository_foldersRoutes = require('./src/routes/repository_foldersRoutes');
const repository_filesRoutes = require('./src/routes/repository_filesRoutes');

// api/folders
// Register routes
app.use('/api/users', userRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/study-sessions', studysessionRoutes); 
app.use('/api/daily-summaries', dailySummaryRoutes);
app.use('/api/folders', repository_foldersRoutes); 
app.use('/api/files', repository_filesRoutes);

// Route testing awal
app.get("/", (req, res) => {
  res.send("Backend berjalan dengan baik");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});
