// controllers/complaintController.js
const Complaint = require('../models/Complaint');

// 1. Create Complaint
exports.createComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.create(req.body);
    res.status(201).json(complaint);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 2. Get All Complaints
exports.getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.findAll();
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get Complaint by ID
exports.getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findByPk(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Update Complaint
exports.updateComplaint = async (req, res) => {
  try {
    const [updated] = await Complaint.update(req.body, { where: { complaintId: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'Complaint not found' });
    res.json({ message: 'Complaint updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Delete Complaint
exports.deleteComplaint = async (req, res) => {
  try {
    const deleted = await Complaint.destroy({ where: { complaintId: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Complaint not found' });
    res.json({ message: 'Complaint deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
