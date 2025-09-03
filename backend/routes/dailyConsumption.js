// routes/dailyConsumptionRoute.js
const express = require('express');
const router = express.Router();
const dailyConsumptionController = require('../controllers/dailyConsumptionController');

router.post('/', dailyConsumptionController.recordConsumption);

module.exports = router;
