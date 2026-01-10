 
const jwt = require('jsonwebtoken');

const authorize = (roles = []) => {
    return (req, res, next) => {
        // req.user is populated by your verifyToken middleware
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access Denied: Insufficient Permissions" });
        }
        next();
    };
};

module.exports = authorize;