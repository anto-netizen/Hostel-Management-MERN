// controllers/attendanceController.js
const { Attendance, Enrollment, Student, Session, sequelize } = require('../models');

// 1. Get all actively enrolled students for the attendance sheet
exports.getEligibleStudents = async (req, res) => {
    try {
        const activeSession = await Session.findOne({ where: { is_active: true } });
        if (!activeSession) return res.status(404).json({ message: 'No active session found.' });

        const students = await Enrollment.findAll({
            where: { session_id: activeSession.session_id, status: 'Active' },
            include: [{ model: Student, attributes: ['student_id', 'first_name', 'last_name', 'student_reg_no'] }],
            order: [[Student, 'first_name', 'ASC']]
        });
        res.status(200).json(students);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 2. Mark attendance (Bulk create)
exports.markAttendance = async (req, res) => {
    const { date, meal_type, present_student_ids } = req.body; // Expects an array of student IDs
    const t = await sequelize.transaction();
    try {
        const attendanceRecords = present_student_ids.map(student_id => ({
            student_id,
            date,
            meal_type,
            status: 'Present'
        }));
        
        // Use "ignoreDuplicates" to handle cases where attendance might be re-submitted.
        // The unique index in the model is crucial for this to work.
        await Attendance.bulkCreate(attendanceRecords, { ignoreDuplicates: true, transaction: t });

        await t.commit();
        res.status(201).json({ message: `${present_student_ids.length} attendance records saved.` });
    } catch (err) {
        await t.rollback();
        res.status(400).json({ error: err.message });
    }
};
