const HostelRoom = require("../models/HostelRoom");

// GET all hostel rooms
exports.getHostelRooms = async (req, res) => {
  try {
    const hostelRooms = await HostelRoom.findAll();
    res.json(hostelRooms);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch hostel rooms" });
  }
};

// GET hostel room by ID
exports.getHostelRoomById = async (req, res) => {
  try {
    const hostelRoom = await HostelRoom.findByPk(req.params.id);
    if (!hostelRoom) return res.status(404).json({ error: "HostelRoom not found" });
    res.json(hostelRoom);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch hostel room" });
  }
};

// CREATE hostel room
exports.createHostelRoom = async (req, res) => {
  try {
    const newHostelRoom = await HostelRoom.create(req.body);
    res.status(201).json(newHostelRoom);
  } catch (err) {
    res.status(500).json({ error: "Failed to create hostel room" });
  }
};

// UPDATE hostel room
exports.updateHostelRoom = async (req, res) => {
  try {
    const hostelRoom = await HostelRoom.findByPk(req.params.id);
    if (!hostelRoom) return res.status(404).json({ error: "HostelRoom not found" });
    await hostelRoom.update(req.body);
    res.json(hostelRoom);
  } catch (err) {
    res.status(500).json({ error: "Failed to update hostel room" });
  }
};

// DELETE hostel room
exports.deleteHostelRoom = async (req, res) => {
  try {
    const hostelRoom = await HostelRoom.findByPk(req.params.id);
    if (!hostelRoom) return res.status(404).json({ error: "HostelRoom not found" });
    await hostelRoom.destroy();
    res.json({ message: "Hostel room deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete hostel room" });
  }
};
