// routes/roomTypeRoute.js
const express = require('express');
const router = express.Router();
const roomTypeController = require('../controllers/roomTypeController');

router.post('/', roomTypeController.createRoomType);
router.get('/', roomTypeController.getAllRoomTypes);
router.put('/:id', roomTypeController.updateRoomType);
router.delete('/:id', roomTypeController.deleteRoomType);

module.exports = router;
