// controllers/menuController.js
const { Menu, MenuItem, Item, UOM, sequelize } = require('../models');

// 1. Get all Menus with their items
exports.getAllMenus = async (req, res) => {
    try {
        const menus = await Menu.findAll({
            include: [{
                model: MenuItem,
                include: [{
                    model: Item,
                    attributes: ['item_name'],
                    include: [{ model: UOM, attributes: ['uom_short_name'] }]
                }]
            }],
            order: [['menu_name', 'ASC']]
        });
        res.status(200).json(menus);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 2. Create a new Menu (Transactional)
exports.createMenu = async (req, res) => {
    const { menu_name, description, items } = req.body; // items is array of {item_id, quantity}
    const t = await sequelize.transaction();
    try {
        const menu = await Menu.create({ menu_name, description }, { transaction: t });
        const menuItems = items.map(item => ({ ...item, menu_id: menu.menu_id }));
        await MenuItem.bulkCreate(menuItems, { transaction: t });

        await t.commit();
        res.status(201).json(menu);
    } catch (err) {
        await t.rollback();
        res.status(400).json({ error: err.message });
    }
};
