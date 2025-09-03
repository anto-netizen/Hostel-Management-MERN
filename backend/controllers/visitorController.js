// controllers/visitorController.js
const Visitor = require('../models/Visitor');

// 1. Create Visitor
exports.createVisitor = async (req, res) => {
  try {
    const visitor = await Visitor.create(req.body);
    res.status(201).json(visitor);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 2. Get All Visitors
exports.getAllVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.findAll();
    res.json(visitors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get Visitor by ID
exports.getVisitorById = async (req, res) => {
  try {
    const visitor = await Visitor.findByPk(req.params.id);
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
    res.json(visitor);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Update Visitor
exports.updateVisitor = async (req, res) => {
  try {
    const [updated] = await Visitor.update(req.body, { where: { visitorId: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'Visitor not found' });
    res.json({ message: 'Visitor updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Delete Visitor
exports.deleteVisitor = async (req, res) => {
  try {
    const deleted = await Visitor.destroy({ where: { visitorId: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Visitor not found' });
    res.json({ message: 'Visitor deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
