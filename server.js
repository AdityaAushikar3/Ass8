const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');

// Initialize Express app
const app = express();

// Connect to MongoDB Database
connectDB();

// Global Middleware
app.use(cors());
app.use(express.json()); // Parses incoming JSON requests

// Serve static frontend UI/UX from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Student API Routes
app.use('/api/students', studentRoutes);

// API Documentation / Info Route
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Student Records REST API',
    endpoints: {
      getAllStudents: 'GET /api/students',
      getStudentById: 'GET /api/students/:id',
      createStudent: 'POST /api/students',
      updateStudent: 'PUT /api/students/:id',
      deleteStudent: 'DELETE /api/students/:id'
    }
  });
});

// Fallback Route serves index.html UI
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
