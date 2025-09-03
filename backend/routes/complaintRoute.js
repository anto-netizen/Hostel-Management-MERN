// routes/complaintRoute.js
const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');

// Create Complaint
router.post('/', complaintController.createComplaint);

// Get All Complaints
router.get('/', complaintController.getAllComplaints);

// Get Complaint by ID
router.get('/:id', complaintController.getComplaintById);

// Update Complaint
router.put('/:id', complaintController.updateComplaint);

// Delete Complaint
router.delete('/:id', complaintController.deleteComplaint);

module.exports = router;
