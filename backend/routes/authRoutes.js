const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes mapped to /api/v1/auth  
router.post('/login', authController.login);
router.post('/register', authController.register);

module.exports = router;