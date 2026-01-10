const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController'); 
 

// CRUD APIs for Trades [cite: 13]
router.get('/', tradeController.getTrades);
router.post('/', tradeController.createTrade);
router.delete('/:id', tradeController.deleteTrade);

module.exports = router;