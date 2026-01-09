const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sample route to test database connection
app.get('/test-db', async (req, res) => {  
    try {
        const [rows] = await db.query('SELECT NOW() AS currentTime');
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Database connection failed', error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('Welcome to the PrimeTrade API');  
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});