// controllers/itemController.js
const { Item, ItemCategory, UOM } = require('../models');

exports.createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    res.status(201).json(item);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll({
      order: [['item_name', 'ASC']],
      include: [
        { model: ItemCategory, attributes: ['category_name'], required: true },
        { model: UOM, attributes: ['uom_short_name'], required: true }
      ]
    });
    res.status(200).json(items);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Item.update(req.body, { where: { item_id: id } });
    if (!updated) return res.status(404).json({ message: 'Item not found' });
    const updatedItem = await Item.findByPk(id);
    res.status(200).json(updatedItem);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Item.destroy({ where: { item_id: id } });
    if (!deleted) return res.status(404).json({ message: 'Item not found' });
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: err.message }); }
};
