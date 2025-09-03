// routes/attendanceRoute.js
const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.get('/eligible-students', attendanceController.getEligibleStudents);
router.post('/', attendanceController.markAttendance);

module.exports = router;
