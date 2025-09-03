// controllers/foodMenuController.js
const FoodMenu = require('../models/FoodMenu');

// 1. Create Food Menu
exports.createFoodMenu = async (req, res) => {
  try {
    const foodMenu = await FoodMenu.create(req.body);
    res.status(201).json(foodMenu);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 2. Get All Food Menus
exports.getAllFoodMenus = async (req, res) => {
  try {
    const menus = await FoodMenu.findAll();
    res.json(menus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Get Food Menu by ID
exports.getFoodMenuById = async (req, res) => {
  try {
    const menu = await FoodMenu.findByPk(req.params.id);
    if (!menu) return res.status(404).json({ message: 'Food Menu not found' });
    res.json(menu);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 4. Update Food Menu
exports.updateFoodMenu = async (req, res) => {
  try {
    const [updated] = await FoodMenu.update(req.body, { where: { menuId: req.params.id } });
    if (!updated) return res.status(404).json({ message: 'Food Menu not found' });
    res.json({ message: 'Food Menu updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 5. Delete Food Menu
exports.deleteFoodMenu = async (req, res) => {
  try {
    const deleted = await FoodMenu.destroy({ where: { menuId: req.params.id } });
    if (!deleted) return res.status(404).json({ message: 'Food Menu not found' });
    res.json({ message: 'Food Menu deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
