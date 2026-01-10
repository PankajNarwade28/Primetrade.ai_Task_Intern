const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); // The pool created in Phase 2

const app = express();

// Middleware
app.use(cors()); // Allows Next.js to connect 
// Use CORS middleware before your routes
app.use(cors({
    origin: 'http://localhost:3000', // Allow only your Next.js app
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json()); // Essential for parsing JSON bodies

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

// Routes
const tradeRoutes = require('./routes/tradeRoutes'); 
app.use('/api/v1/trades', tradeRoutes); 

// Import Routes    
const authRoutes = require('./routes/authRoutes'); 

// API Routes 
app.use('/api/v1/auth', authRoutes); 

// Start Server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});