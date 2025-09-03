// controllers/uomController.js
const { UOM } = require('../models');

exports.createUOM = async (req, res) => {
  try {
    const uom = await UOM.create(req.body);
    res.status(201).json(uom);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getAllUOMs = async (req, res) => {
  try {
    const uoms = await UOM.findAll({ order: [['uom_name', 'ASC']] });
    res.status(200).json(uoms);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateUOM = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await UOM.update(req.body, { where: { uom_id: id } });
    if (!updated) return res.status(404).json({ message: 'UOM not found' });
    const updatedUOM = await UOM.findByPk(id);
    res.status(200).json(updatedUOM);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.deleteUOM = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await UOM.destroy({ where: { uom_id: id } });
    if (!deleted) return res.status(404).json({ message: 'UOM not found' });
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: err.message }); }
};
