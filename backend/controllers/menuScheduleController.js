// controllers/menuScheduleController.js
const { MenuSchedule, Menu, sequelize } = require('../models');

// 1. Get the full weekly schedule
exports.getSchedule = async (req, res) => {
    try {
        const schedule = await MenuSchedule.findAll({
            include: [{ model: Menu, attributes: ['menu_name'] }]
        });
        res.status(200).json(schedule);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 2. Set/Update the weekly schedule (Transactional Upsert)
exports.setSchedule = async (req, res) => {
    const scheduleData = req.body; // Expects an array of { day_of_week, meal_type, menu_id }
    const t = await sequelize.transaction();
    try {
        // Clear the existing schedule first for simplicity
        await MenuSchedule.destroy({ truncate: true, transaction: t });

        // Bulk insert the new schedule
        await MenuSchedule.bulkCreate(scheduleData, { transaction: t });
        
        await t.commit();
        res.status(201).json({ message: 'Schedule updated successfully.' });
    } catch (err) {
        await t.rollback();
        res.status(400).json({ error: err.message });
    }
};
