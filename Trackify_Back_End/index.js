const express = require("express");
const cors = require("cors");
require("dotenv").config();


const app = express();


// Middleware
app.use(express.json({ limit: '10mb' })); // Increase limit for file uploads (base64)
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cors(
  
));


// LOGGING middleware
app.use((req, res, next) => {
    console.log(`📥 ${req.method} ${req.url}`);
    next();
});


const userRoutes = require('./src/routes/userRoutes');
const goalsRoutes = require('./src/routes/goalsRoutes');
const studysessionRoutes = require('./src/routes/studysessionRoutes');
const dailySummaryRoutes = require('./src/routes/dailySummaryRoutes');
const taskRoutes = require('./src/routes/taskRoutes');
const repository_filesRoutes = require('./src/routes/repository_filesRoutes');
const repository_foldersRoutes = require('./src/routes/repository_foldersRoutes');


// Register routes
app.use('/api/users', userRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/study-sessions', studysessionRoutes);
app.use('/api/daily-summaries', dailySummaryRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/repository_files', repository_filesRoutes);
app.use('/api/repository_folders', repository_foldersRoutes);


// Route testing awal
app.get("/", (req, res) => {
  res.send("Backend berjalan dengan baik");
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});

