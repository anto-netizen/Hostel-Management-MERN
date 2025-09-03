// controllers/stockController.js
const { PurchaseOrder, Groceries, ItemStock, sequelize } = require('../models');
const { Op } = require('sequelize');
const { Item, ItemCategory, UOM } = require('../models'); // Add these if not present

// 1. Get all pending Purchase Orders
exports.getPendingPOs = async (req, res) => {
    try {
        const pendingPOs = await PurchaseOrder.findAll({
            where: { status: 'Pending' },
            include: ['Supplier']
        });
        res.status(200).json(pendingPOs);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 2. Receive stock against a PO (TRANSACTIONAL)
exports.receiveStock = async (req, res) => {
    const { po_id, supplier_id, items } = req.body; // items is an array of {item_id, quantity_purchased}
    const t = await sequelize.transaction();
    try {
        // Step 1: Log the received groceries
        const groceryLogs = items.map(item => ({ ...item, po_id, supplier_id }));
        await Groceries.bulkCreate(groceryLogs, { transaction: t });

        // Step 2: Update the master stock for each item
        for (const item of items) {
            const stockItem = await ItemStock.findOne({ where: { item_id: item.item_id } });
            if (stockItem) {
                await stockItem.increment('quantity', { by: item.quantity_purchased, transaction: t });
            } else {
                await ItemStock.create({ item_id: item.item_id, quantity: item.quantity_purchased }, { transaction: t });
            }
        }

        // Step 3: Update the PO status to 'Completed'
        await PurchaseOrder.update({ status: 'Completed' }, { where: { po_id }, transaction: t });

        await t.commit();
        res.status(201).json({ message: 'Stock received and inventory updated successfully.' });
    } catch (err) {
        await t.rollback();
        res.status(400).json({ error: err.message });
    }
};
exports.getCurrentStock = async (req, res) => {
    try {
        const stockLevels = await ItemStock.findAll({
            order: [['last_updated', 'DESC']],
            include: [
                {
                    model: Item,
                    attributes: ['item_name'],
                    required: true,
                    include: [
                        { model: ItemCategory, attributes: ['category_name'] },
                        { model: UOM, attributes: ['uom_short_name'] }
                    ]
                }
            ]
        });
        res.status(200).json(stockLevels);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
