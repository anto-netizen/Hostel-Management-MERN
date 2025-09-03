// routes/roomRoute.js
const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// Routes are scoped by warden for getting the list
router.get('/warden/:wardenId', roomController.getRoomsByWarden);

// Routes for CUD operations can be direct
router.post('/', roomController.createRoom);
router.put('/:roomId', roomController.updateRoom);
router.delete('/:roomId', roomController.deleteRoom);

module.exports = router;
