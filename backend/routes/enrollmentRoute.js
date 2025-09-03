// routes/enrollmentRoute.js
const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

router.get('/warden/:wardenId', enrollmentController.getEnrollmentsByWarden);
router.get('/prerequisites/:wardenId', enrollmentController.getEnrollmentPrerequisites);
router.post('/', enrollmentController.createEnrollment);

module.exports = router;
