// routes/menuScheduleRoute.js
const express = require('express');
const router = express.Router();
const menuScheduleController = require('../controllers/menuScheduleController');

router.get('/', menuScheduleController.getSchedule);
router.post('/', menuScheduleController.setSchedule); // A single endpoint to set the whole schedule

module.exports = router;
