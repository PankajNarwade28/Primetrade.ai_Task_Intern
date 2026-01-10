const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');


// User Registration
exports.register = async (req, res) => {
    const { username, email, password, role } = req.body;
    try {
        // Password Hashing 
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await db.query(
            'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
            [username, email, hashedPassword, role || 'user']
        );
        
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Registration failed", error: error.message });
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Fetch user - Ensure database is connected
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = rows[0];

        // 2. Error handling for non-existent user [cite: 14, 24]
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 3. Password Verification
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if secret exists before signing to prevent the crash
    if (!process.env.JWT_SECRET) {
        console.error("FATAL ERROR: JWT_SECRET is not defined.");
        return res.status(500).json({ message: "Internal server configuration error" });
    }
 

        // 4. JWT Generation - Must have JWT_SECRET in .env [cite: 11, 26]
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            token,
            user: { id: user.id, username: user.username, role: user.role }
        });

    } catch (error) {
        console.error("Login Error:", error); // Check this log in your terminal
        res.status(500).json({ message: "Internal server error" });  
    }
};