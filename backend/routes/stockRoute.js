// routes/stockRoute.js
const express = require('express');
const router = express.Router();
const stockController = require('../controllers/stockController');

router.get('/pending-pos', stockController.getPendingPOs);
router.post('/receive', stockController.receiveStock);
router.get('/current', stockController.getCurrentStock); // <-- ADD THIS LINE

module.exports = router;
