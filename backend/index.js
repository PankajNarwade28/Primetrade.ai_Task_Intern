const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); // The pool created in Phase 2

const app = express();

// Middleware
app.use(cors()); // Allows Next.js to connect
app.use(express.json()); // Parses incoming JSON [cite: 11]

// Health Check Route (For Dashboard Test)
app.get('/api/v1/health', async (req, res) => {
    try {
        // Test database connection with a simple query 
        await db.query('SELECT 1'); 
        res.status(200).json({
            status: 'success',
            message: 'Backend is running',
            database: true
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Database connection failed',
            database: false
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});