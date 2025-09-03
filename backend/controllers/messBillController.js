// controllers/messBillController.js
const { MessBill, Attendance, Enrollment, Session, Student, sequelize } = require('../models');
const { Op } = require('sequelize');

const DIET_RATE = 50.00; // For now, a fixed rate. In a real system, this would come from a settings table.

// 1. Generate Bills for a given month and year
exports.generateBills = async (req, res) => {
    const { month, year } = req.body; // month is 1-12
    const t = await sequelize.transaction();
    try {
        const activeSession = await Session.findOne({ where: { is_active: true } });
        if (!activeSession) throw new Error('No active session found.');

        // Get all actively enrolled students
        const enrollments = await Enrollment.findAll({ where: { session_id: activeSession.session_id, status: 'Active' } });
        const studentIds = enrollments.map(e => e.student_id);

        // Get attendance counts for all these students for the specified month/year
        const attendanceCounts = await Attendance.findAll({
            attributes: ['student_id', [sequelize.fn('COUNT', sequelize.col('attendance_id')), 'diet_count']],
            where: {
                student_id: { [Op.in]: studentIds },
                [Op.and]: [
                    sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month),
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year)
                ]
            },
            group: ['student_id']
        });

        if (attendanceCounts.length === 0) {
            await t.rollback();
            return res.status(200).json({ message: 'No attendance data found for the selected period. No bills were generated.' });
        }

        // Prepare bill records
        const billRecords = attendanceCounts.map(att => {
            const dietCount = att.get('diet_count');
            return {
                student_id: att.student_id,
                session_id: activeSession.session_id,
                month,
                year,
                total_diets: dietCount,
                diet_rate: DIET_RATE,
                amount: dietCount * DIET_RATE,
                status: 'Unpaid'
            };
        });

        // Bulk create/update bills
        await MessBill.bulkCreate(billRecords, {
            updateOnDuplicate: ['total_diets', 'diet_rate', 'amount', 'generated_date'],
            transaction: t
        });
        
        await t.commit();
        res.status(201).json({ message: `${billRecords.length} mess bills were successfully generated/updated.` });

    } catch (err) {
        await t.rollback();
        res.status(500).json({ error: err.message });
    }
};

// 2. Get all generated bills (for viewing)
exports.getAllBills = async (req, res) => {
    try {
        const bills = await MessBill.findAll({
            include: [{ model: Student, attributes: ['first_name', 'last_name', 'student_reg_no'] }],
            order: [['year', 'DESC'], ['month', 'DESC'], [Student, 'first_name', 'ASC']]
        });
        res.status(200).json(bills);
    } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.getBillsByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const bills = await MessBill.findAll({
            where: { student_id: studentId },
            include: [{ model: Session, attributes: ['session_name'] }],
            order: [['year', 'DESC'], ['month', 'DESC']] // Show most recent first
        });
        res.status(200).json(bills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
