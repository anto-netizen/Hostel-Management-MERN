// routes/hostelRoute.js
const express = require('express');
const router = express.Router();
const hostelController = require('../controllers/hostelController');

// POST /api/hostels - Create a new hostel
router.post('/', hostelController.createHostel);

// GET /api/hostels - Get all hostels
router.get('/', hostelController.getAllHostels);

// GET /api/hostels/:id - Get a single hostel
router.get('/:id', hostelController.getHostelById);

// PUT /api/hostels/:id - Update a hostel
router.put('/:id', hostelController.updateHostel);

// DELETE /api/hostels/:id - Delete a hostel
router.delete('/:id', hostelController.deleteHostel);

module.exports = router;
