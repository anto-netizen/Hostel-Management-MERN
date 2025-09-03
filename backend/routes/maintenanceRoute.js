// routes/maintenanceRoute.js
const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');

router.get('/warden/:wardenId', maintenanceController.getRequestsByWarden);
router.patch('/:maintenanceId/status', maintenanceController.updateRequestStatus); // PATCH is suitable for partial updates

router.post('/student', maintenanceController.createRequestByStudent);
router.get('/student/:studentId', maintenanceController.getRequestsByStudent);

module.exports = router;
