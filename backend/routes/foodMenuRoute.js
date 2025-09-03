// routes/foodMenuRoute.js
const express = require('express');
const router = express.Router();
const foodMenuController = require('../controllers/foodMenuController');

// Create Food Menu
router.post('/', foodMenuController.createFoodMenu);

// Get All Food Menus
router.get('/', foodMenuController.getAllFoodMenus);

// Get Food Menu by ID
router.get('/:id', foodMenuController.getFoodMenuById);

// Update Food Menu
router.put('/:id', foodMenuController.updateFoodMenu);

// Delete Food Menu
router.delete('/:id', foodMenuController.deleteFoodMenu);

module.exports = router;
