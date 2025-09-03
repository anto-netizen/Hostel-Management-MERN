// controllers/sessionController.js
const { Session } = require('../models');
const { sequelize } = require('../models/Session'); // For transactions

// 1. Get all Sessions
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.findAll({ order: [['start_date', 'DESC']] });
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Create a new Session
exports.createSession = async (req, res) => {
  try {
    const session = await Session.create(req.body);
    res.status(201).json(session);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 3. Update a Session
exports.updateSession = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Session.update(req.body, { where: { session_id: id } });
        if (!updated) return res.status(404).json({ message: 'Session not found' });
        const updatedSession = await Session.findByPk(id);
        res.status(200).json(updatedSession);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// 4. Set a Session as Active (ensures only one is active)
exports.setActiveSession = async (req, res) => {
    const { id } = req.params;
    const t = await sequelize.transaction(); // Start a transaction

    try {
        // Step 1: Deactivate all other sessions
        await Session.update(
            { is_active: false },
            { where: { session_id: { [require('sequelize').Op.ne]: id } }, transaction: t }
        );

        // Step 2: Activate the target session
        const [updated] = await Session.update(
            { is_active: true },
            { where: { session_id: id }, transaction: t }
        );

        if (!updated) {
            await t.rollback();
            return res.status(404).json({ message: 'Session not found' });
        }

        await t.commit(); // Commit the transaction
        res.status(200).json({ message: 'Session activated successfully.' });

    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
};
