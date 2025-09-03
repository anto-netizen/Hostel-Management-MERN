// controllers/studentDashboardController.js
const { Student, Enrollment, Hostel, HostelRoom, Session, MessBill, MenuSchedule, Menu } = require('../models');
const { Op } = require('sequelize');

exports.getDashboardData = async (req, res) => {
    try {
        const { studentId } = req.params;

        // --- 1. Get Active Enrollment and Profile Info ---
        const enrollmentInfo = await Enrollment.findOne({
            where: { student_id: studentId },
            include: [
                { model: Student },
                { model: Session, where: { is_active: true } },
                { model: HostelRoom, include: [{ model: Hostel }] }
            ]
        });

        if (!enrollmentInfo) {
            return res.status(404).json({ message: 'No active enrollment found for this student.' });
        }

        // --- 2. Get Latest Mess Bill ---
        const latestBill = await MessBill.findOne({
            where: { student_id: studentId },
            order: [['year', 'DESC'], ['month', 'DESC']]
        });

        // --- 3. Get Today's Menu ---
        const today = new Date();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todaysDayName = dayNames[today.getDay()];

        const todaysMenu = await MenuSchedule.findAll({
            where: { day_of_week: todaysDayName },
            include: [{ model: Menu, attributes: ['menu_name'] }]
        });
        
        // Format today's menu for easy use on the frontend
        const menuObject = {};
        todaysMenu.forEach(item => {
            menuObject[item.meal_type] = item.Menu.menu_name;
        });

        // --- 4. Assemble the Dashboard Payload ---
        const dashboardData = {
            profile: enrollmentInfo.Student,
            hostel: {
                hostel_name: enrollmentInfo.HostelRoom.Hostel.hostel_name,
                room_number: enrollmentInfo.HostelRoom.room_number
            },
            latestBill: latestBill,
            todaysMenu: menuObject
        };

        res.status(200).json(dashboardData);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
