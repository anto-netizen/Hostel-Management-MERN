// controllers/wardenController.js
const Warden = require('../models/Warden');

// 1. Create a new Warden
exports.createWarden = async (req, res) => {
  try {
    const warden = await Warden.create(req.body);
    res.status(201).json(warden);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 2. Get all Wardens
exports.getAllWardens = async (req, res) => {
  try {
    const wardens = await Warden.findAll();
    res.status(200).json(wardens);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Update a Warden by ID
exports.updateWarden = async (req, res) => {
  try {
    const [updated] = await Warden.update(req.body, { where: { warden_id: req.params.id } });
    if (!updated) {
      return res.status(404).json({ message: 'Warden not found' });
    }
    const updatedWarden = await Warden.findByPk(req.params.id);
    res.status(200).json(updatedWarden);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Delete a Warden by ID
exports.deleteWarden = async (req, res) => {
  try {
    const deleted = await Warden.destroy({ where: { warden_id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ message: 'Warden not found' });
    }
    res.status(204).json({ message: 'Warden deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
