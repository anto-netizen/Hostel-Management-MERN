// controllers/buildingController.js
const Building = require('../models/Building');

// 1. Create Building
exports.createBuilding = async (req, res) => {
  try {
    const building = await Building.create(req.body);
    res.status(201).json(building);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 2. Get All Buildings
exports.getAllBuildings = async (req, res) => {
  try {
    const buildings = await Building.findAll();
    res.json(buildings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get Building by ID
exports.getBuildingById = async (req, res) => {
  try {
    const building = await Building.findByPk(req.params.id);
    if (!building) return res.status(404).json({ message: 'Building not found' });
    res.json(building);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Update Building
exports.updateBuilding = async (req, res) => {
  try {
    const [updated] = await Building.update(req.body, { where: { buildingId: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'Building not found' });
    res.json({ message: 'Building updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Delete Building
exports.deleteBuilding = async (req, res) => {
  try {
    const deleted = await Building.destroy({ where: { buildingId: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Building not found' });
    res.json({ message: 'Building deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
