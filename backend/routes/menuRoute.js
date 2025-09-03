// routes/menuRoute.js
const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/', menuController.getAllMenus);
router.post('/', menuController.createMenu);
// Add PUT and DELETE routes as needed later

module.exports = router;
