// routes/wardenRoute.js
const express = require('express');
const router = express.Router();
const wardenController = require('../controllers/wardenController');

router.post('/', wardenController.createWarden);
router.get('/', wardenController.getAllWardens);
router.put('/:id', wardenController.updateWarden);
router.delete('/:id', wardenController.deleteWarden);

module.exports = router;
