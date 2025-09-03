// controllers/enrollmentController.js
const { Enrollment, Student, HostelRoom, RoomType, Session, Hostel } = require('../models');
const { sequelize } = require('../models/Hostel'); // For transactions
const { Op } = require('sequelize');

// 1. Get all enrollments for a Warden's hostel
exports.getEnrollmentsByWarden = async (req, res) => {
    try {
        const { wardenId } = req.params;
        const hostel = await Hostel.findOne({ where: { warden_id: wardenId } });
        if (!hostel) return res.status(404).json({ message: "Hostel not found for this warden." });

        const enrollments = await Enrollment.findAll({
            include: [
                { model: Student, attributes: ['student_reg_no', 'first_name', 'last_name'] },
                { model: Session, where: { is_active: true } }, // Only for the active session
                { 
                    model: HostelRoom, 
                    attributes: ['room_number'],
                    where: { hostel_id: hostel.hostel_id },
                    include: [{ model: RoomType, attributes: ['type_name'] }]
                }
            ]
        });
        res.status(200).json(enrollments);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 2. Get data needed for the enrollment form (Available students and rooms)
exports.getEnrollmentPrerequisites = async (req, res) => {
    try {
        const { wardenId } = req.params;
        const hostel = await Hostel.findOne({ where: { warden_id: wardenId } });
        if (!hostel) return res.status(404).json({ message: "Hostel not found." });

        const activeSession = await Session.findOne({ where: { is_active: true } });
        if (!activeSession) return res.status(404).json({ message: "No active session found." });

        // Find students NOT enrolled in the active session
        const enrolledStudentIds = (await Enrollment.findAll({ where: { session_id: activeSession.session_id } })).map(e => e.student_id);
        const availableStudents = await Student.findAll({ where: { student_id: { [Op.notIn]: enrolledStudentIds } } });

        // Find rooms that are 'Available' in this warden's hostel
        const availableRooms = await HostelRoom.findAll({ where: { hostel_id: hostel.hostel_id, status: 'Available' } });

        res.status(200).json({ activeSession, availableStudents, availableRooms });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 3. Create a new enrollment (TRANSACTIONAL)
exports.createEnrollment = async (req, res) => {
    const { student_id, room_id, session_id } = req.body;
    const t = await sequelize.transaction();
    try {
        // Step 1: Create the enrollment record
        const enrollment = await Enrollment.create({ student_id, room_id, session_id }, { transaction: t });

        // Step 2: Update the room status to 'Occupied'
        await HostelRoom.update({ status: 'Occupied' }, { where: { room_id: room_id }, transaction: t });

        await t.commit();
        res.status(201).json(enrollment);
    } catch (err) {
        await t.rollback();
        res.status(400).json({ error: err.message });
    }
};
