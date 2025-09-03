// routes/studentDashboardRoute.js
const express = require('express');
const router = express.Router();
const studentDashboardController = require('../controllers/studentDashboardController');

router.get('/:studentId', studentDashboardController.getDashboardData);

module.exports = router;
