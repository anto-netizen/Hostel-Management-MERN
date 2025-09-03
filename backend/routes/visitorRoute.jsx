// routes/visitorRoute.js
const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitorController');

// Create Visitor
router.post('/', visitorController.createVisitor);

// Get All Visitors
router.get('/', visitorController.getAllVisitors);

// Get Visitor by ID
router.get('/:id', visitorController.getVisitorById);

// Update Visitor
router.put('/:id', visitorController.updateVisitor);

// Delete Visitor
router.delete('/:id', visitorController.deleteVisitor);

module.exports = router;
