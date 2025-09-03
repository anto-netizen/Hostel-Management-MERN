// controllers/maintenanceController.js
const { HostelMaintenance, HostelRoom, Student, Hostel, Enrollment, Session } = require('../models'); 

// 1. Get all maintenance requests for a Warden's hostel
exports.getRequestsByWarden = async (req, res) => {
    try {
        const { wardenId } = req.params;
        const hostel = await Hostel.findOne({ where: { warden_id: wardenId } });
        if (!hostel) return res.status(404).json({ message: "Hostel not found for warden." });

        const requests = await HostelMaintenance.findAll({
            order: [['reported_date', 'DESC']],
            include: [
                {
                    model: HostelRoom,
                    attributes: ['room_number'],
                    where: { hostel_id: hostel.hostel_id },
                    required: true
                },
                {
                    model: Student,
                    as: 'Reporter', // Use the alias defined in the association
                    attributes: ['first_name', 'last_name']
                }
            ]
        });
        res.status(200).json(requests);
    } catch (err) { res.status(500).json({ error: err.message }); }
};

// 2. Update the status of a maintenance request
exports.updateRequestStatus = async (req, res) => {
    try {
        const { maintenanceId } = req.params;
        const { status } = req.body;
        
        let updateData = { status };
        if (status === 'Resolved') {
            updateData.resolved_date = new Date();
        }

        const [updated] = await HostelMaintenance.update(updateData, { where: { maintenance_id: maintenanceId } });
        if (!updated) return res.status(404).json({ message: 'Request not found.' });

        const updatedRequest = await HostelMaintenance.findByPk(maintenanceId);
        res.status(200).json(updatedRequest);
    } catch (err) { res.status(500).json({ error: err.message }); }
};
exports.createRequestByStudent = async (req, res) => {
    const { student_id, description } = req.body;
    try {
        // Find the student's active enrollment to get their room_id automatically
        const activeEnrollment = await Enrollment.findOne({
            where: { student_id: student_id },
            include: [{ model: Session, where: { is_active: true } }]
        });

        if (!activeEnrollment) {
            return res.status(404).json({ error: "No active enrollment found for this student." });
        }

        const newRequest = await HostelMaintenance.create({
            room_id: activeEnrollment.room_id,
            reported_by_student_id: student_id,
            description: description,
            status: 'Pending' // Default status
        });

        res.status(201).json(newRequest);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// 4. Get all maintenance requests for a specific student
exports.getRequestsByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const requests = await HostelMaintenance.findAll({
            where: { reported_by_student_id: studentId },
            order: [['reported_date', 'DESC']],
            include: [{ model: HostelRoom, attributes: ['room_number'] }]
        });
        res.status(200).json(requests);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
