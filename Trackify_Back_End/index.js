const express = require("express");
const cors = require("cors");
require("dotenv").config();


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Import route user
const userRoutes = require('./src/routes/userRoutes');
app.use('/api/users', userRoutes);

// Route testing awal
app.get("/", (req, res) => {
  res.send("Backend berjalan dengan baik");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server berjalan pada port ${PORT}`);
});
