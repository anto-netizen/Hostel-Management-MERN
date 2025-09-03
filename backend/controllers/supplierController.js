// controllers/supplierController.js
const { Supplier } = require('../models');

// Create a new Supplier
exports.createSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.create(req.body);
    res.status(201).json(supplier);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all Suppliers
exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({ order: [['supplier_name', 'ASC']] });
    res.status(200).json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a Supplier
exports.updateSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Supplier.update(req.body, { where: { supplier_id: id } });
    if (!updated) return res.status(404).json({ message: 'Supplier not found' });
    const updatedSupplier = await Supplier.findByPk(id);
    res.status(200).json(updatedSupplier);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a Supplier
exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Supplier.destroy({ where: { supplier_id: id } });
    if (!deleted) return res.status(404).json({ message: 'Supplier not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
