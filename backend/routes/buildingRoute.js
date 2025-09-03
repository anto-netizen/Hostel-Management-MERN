// routes/buildingRoute.js
const express = require('express');
const router = express.Router();
const buildingController = require('../controllers/buildingController');

// Create Building
router.post('/', buildingController.createBuilding);

// Get All Buildings
router.get('/', buildingController.getAllBuildings);

// Get Building by ID
router.get('/:id', buildingController.getBuildingById);

// Update Building
router.put('/:id', buildingController.updateBuilding);

// Delete Building
router.delete('/:id', buildingController.deleteBuilding);

module.exports = router;
