// controllers/itemCategoryController.js
const { ItemCategory } = require('../models');

exports.createCategory = async (req, res) => {
  try {
    const category = await ItemCategory.create(req.body);
    res.status(201).json(category);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await ItemCategory.findAll({ order: [['category_name', 'ASC']] });
    res.status(200).json(categories);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await ItemCategory.update(req.body, { where: { category_id: id } });
    if (!updated) return res.status(404).json({ message: 'Category not found' });
    const updatedCategory = await ItemCategory.findByPk(id);
    res.status(200).json(updatedCategory);
  } catch (err) { res.status(400).json({ error: err.message }); }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await ItemCategory.destroy({ where: { category_id: id } });
    if (!deleted) return res.status(404).json({ message: 'Category not found' });
    res.status(204).send();
  } catch (err) { res.status(500).json({ error: err.message }); }
};
