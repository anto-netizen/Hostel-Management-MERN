// controllers/roomTypeController.js
const RoomType = require('../models/RoomType');

// 1. Create a new RoomType
exports.createRoomType = async (req, res) => {
  try {
    const roomType = await RoomType.create(req.body);
    res.status(201).json(roomType);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 2. Get all RoomTypes
exports.getAllRoomTypes = async (req, res) => {
  try {
    const roomTypes = await RoomType.findAll();
    res.status(200).json(roomTypes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Update a RoomType by ID
exports.updateRoomType = async (req, res) => {
  try {
    const [updated] = await RoomType.update(req.body, { where: { room_type_id: req.params.id } });
    if (!updated) {
      return res.status(404).json({ message: 'Room Type not found' });
    }
    const updatedRoomType = await RoomType.findByPk(req.params.id);
    res.status(200).json(updatedRoomType);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Delete a RoomType by ID
exports.deleteRoomType = async (req, res) => {
  try {
    const deleted = await RoomType.destroy({ where: { room_type_id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Room Type not found' });
    }
    res.status(204).json({ message: 'Room Type deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
