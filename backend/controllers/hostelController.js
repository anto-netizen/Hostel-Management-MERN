// controllers/hostelController.js
const { Hostel, Warden } = require('../models'); // <-- Change this to import from models/index.js


// 1. Create a new Hostel
exports.createHostel = async (req, res) => {
  try {
    const hostel = await Hostel.create(req.body);
    res.status(201).json(hostel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 2. Get all Hostels
exports.getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.findAll({
      include: [{
        model: Warden, // The model to include
        attributes: ['first_name', 'last_name'], // Specify which warden fields you want
        required: false // Use LEFT JOIN, so hostels without a warden are still returned
      }]
    });
    res.status(200).json(hostels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get a single Hostel by ID
exports.getHostelById = async (req, res) => {
  try {
    const hostel = await Hostel.findByPk(req.params.id);
    if (!hostel) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    res.status(200).json(hostel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Update a Hostel by ID
exports.updateHostel = async (req, res) => {
  try {
    const [updated] = await Hostel.update(req.body, { where: { hostel_id: req.params.id } });
    if (!updated) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    const updatedHostel = await Hostel.findByPk(req.params.id);
    res.status(200).json(updatedHostel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Delete a Hostel by ID
exports.deleteHostel = async (req, res) => {
  try {
    const deleted = await Hostel.destroy({ where: { hostel_id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Hostel not found' });
    }
    res.status(204).json({ message: 'Hostel deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
