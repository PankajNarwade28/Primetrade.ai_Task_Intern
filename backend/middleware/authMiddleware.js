const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Get token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

    // 2. Check if token exists
    if (!token) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    try {
        // 3. Verify token using the secret key from .env
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        
        // 4. Attach user data (id, role) to the request object
        req.user = verified;
        
        // 5. Move to the next middleware or controller
        next();
    } catch (error) {
        // Handle expired or malformed tokens
        res.status(403).json({ message: "Invalid or Expired Token" });
    }
};

module.exports = verifyToken;