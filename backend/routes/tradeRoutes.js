const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const tradeController = require('../controllers/tradeController');

// Existing routes...
router.get('/', verifyToken, tradeController.getTrades);
router.post('/', verifyToken, tradeController.createTrade);

// Separate Delete Route
router.delete('/:id', verifyToken, tradeController.deleteTrade);

module.exports = router;