const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/authMiddleware');
const tradeController = require('../controllers/tradeController');

// All routes below require a valid JWT
router.get('/', verifyToken, tradeController.getTrades);
router.post('/', verifyToken, tradeController.createTrade);
router.delete('/:id', verifyToken, tradeController.deleteTrade);

module.exports = router;