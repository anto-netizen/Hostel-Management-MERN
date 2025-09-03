// controllers/roomController.js
const { HostelRoom, RoomType, Hostel } = require('../models');

// 1. Get all rooms for a specific Warden's hostel (This function is fine)
exports.getRoomsByWarden = async (req, res) => {
  try {
    const wardenId = req.params.wardenId;

    // First, find the hostel managed by this warden
    const hostel = await Hostel.findOne({ where: { warden_id: wardenId } });
    if (!hostel) {
      return res.status(404).json({ message: "Hostel not found for this warden." });
    }

    // Now, find all rooms in that hostel, including RoomType details
    const rooms = await HostelRoom.findAll({
      where: { hostel_id: hostel.hostel_id },
      include: [{
        model: RoomType,
        attributes: ['type_name', 'capacity', 'price'],
        required: true
      }]
    });

    res.status(200).json({ hostel, rooms });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Create a new room - Corrected
exports.createRoom = async (req, res) => {
  try {
    // Validate and extract only the allowed fields
    const { room_number, floor_number, room_status, hostel_id, room_type_id } = req.body;

    // A basic check to ensure required fields are present
    if (!room_number || !floor_number || !hostel_id || !room_type_id) {
        return res.status(400).json({ error: "Missing required room details." });
    }

    const room = await HostelRoom.create({
        room_number,
        floor_number,
        room_status,
        hostel_id,
        room_type_id
    });
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 3. Update a room - Corrected
exports.updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    // Validate and extract only the allowed fields
    const { room_number, floor_number, room_status, hostel_id, room_type_id } = req.body;
    
    // Only include fields that are present in the request body for the update
    const updateFields = {};
    if (room_number) updateFields.room_number = room_number;
    if (floor_number) updateFields.floor_number = floor_number;
    if (room_status) updateFields.room_status = room_status;
    if (hostel_id) updateFields.hostel_id = hostel_id;
    if (room_type_id) updateFields.room_type_id = room_type_id;

    const [updated] = await HostelRoom.update(updateFields, { where: { room_id: roomId } });
    if (!updated) {
      return res.status(404).json({ message: 'Room not found' });
    }
    const updatedRoom = await HostelRoom.findByPk(roomId);
    res.status(200).json(updatedRoom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Delete a room (This function is fine)
exports.deleteRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const deleted = await HostelRoom.destroy({ where: { room_id: roomId } });
        if (!deleted) {
          return res.status(404).json({ message: 'Room not found' });
        }
        res.status(204).send();
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
};