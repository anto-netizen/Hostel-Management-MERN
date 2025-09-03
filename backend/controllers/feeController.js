// controllers/feeController.js
const Fee = require('../models/Fee');

// 1. Create Fee
exports.createFee = async (req, res) => {
  try {
    const fee = await Fee.create(req.body);
    res.status(201).json(fee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 2. Get All Fees
exports.getAllFees = async (req, res) => {
  try {
    const fees = await Fee.findAll();
    res.json(fees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get Fee by ID
exports.getFeeById = async (req, res) => {
  try {
    const fee = await Fee.findByPk(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee not found' });
    res.json(fee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Update Fee
exports.updateFee = async (req, res) => {
  try {
    const [updated] = await Fee.update(req.body, { where: { feeId: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'Fee not found' });
    res.json({ message: 'Fee updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Delete Fee
exports.deleteFee = async (req, res) => {
  try {
    const deleted = await Fee.destroy({ where: { feeId: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Fee not found' });
    res.json({ message: 'Fee deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
