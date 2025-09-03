// routes/feeRoute.js
const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');

// Create Fee
router.post('/', feeController.createFee);

// Get All Fees
router.get('/', feeController.getAllFees);

// Get Fee by ID
router.get('/:id', feeController.getFeeById);

// Update Fee
router.put('/:id', feeController.updateFee);

// Delete Fee
router.delete('/:id', feeController.deleteFee);

module.exports = router;
