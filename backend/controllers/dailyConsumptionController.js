// controllers/dailyConsumptionController.js
const { DailyConsumption, ItemStock, sequelize } = require('../models');
const { Op } = require('sequelize');

exports.recordConsumption = async (req, res) => {
    const { date, meal_type, items } = req.body; // items is array of {item_id, quantity}
    const t = await sequelize.transaction();

    try {
        // Step 1: Validate stock for all items BEFORE making any changes
        for (const item of items) {
            const stockItem = await ItemStock.findOne({ where: { item_id: item.item_id } });
            if (!stockItem || parseFloat(stockItem.quantity) < parseFloat(item.quantity)) {
                await t.rollback();
                return res.status(400).json({ error: `Insufficient stock for item ID ${item.item_id}.` });
            }
        }

        // Step 2: Log consumption and update stock
        for (const item of items) {
            // Log the consumption
            await DailyConsumption.create({
                item_id: item.item_id,
                quantity: item.quantity,
                date: date,
                meal_type: meal_type
            }, { transaction: t });

            // Decrement the stock
            await ItemStock.decrement('quantity', {
                by: item.quantity,
                where: { item_id: item.item_id },
                transaction: t
            });
        }

        await t.commit();
        res.status(201).json({ message: 'Consumption recorded and stock updated successfully.' });

    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
};
