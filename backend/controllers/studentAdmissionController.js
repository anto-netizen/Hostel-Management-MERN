// controllers/studentAdmissionController.js
const StudentAdmission = require('../models/Student'); // ✅ direct import

// 1. Get all students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await StudentAdmission.findAll({
      order: [['first_name', 'ASC']] // optional: sorted by first_name
    });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Some error occurred while retrieving students.'
    });
  }
};

// 2. Get a single student by ID
exports.getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await StudentAdmission.findByPk(id);

    if (!student) {
      return res.status(404).json({ message: `Student with id=${id} not found.` });
    }

    res.status(200).json(student);
  } catch (err) {
    res.status(500).json({
      message: `Error retrieving Student with id=${req.params.id}`
    });
  }
};

// 3. Create a new student
exports.createStudent = async (req, res) => {
  try {
    const { student_reg_no, email, first_name, last_name, phone, address } = req.body;

    // Validation
    if (!student_reg_no || !email) {
      return res.status(400).json({
        message: 'Registration number and email are required fields!'
      });
    }

    const student = await StudentAdmission.create({
      student_reg_no,
      first_name,
      last_name,
      email,
      phone,
      address
    });

    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({
      message: err.message || 'Some error occurred while creating the Student.'
    });
  }
};

// 4. Update a student by ID
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const [updated] = await StudentAdmission.update(req.body, {
      where: { student_id: id } // ✅ PK is student_id
    });

    if (!updated) {
      return res.status(404).json({
        message: `Cannot update Student with id=${id}. Maybe Student was not found or request body is empty.`
      });
    }

    const updatedStudent = await StudentAdmission.findByPk(id);
    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(500).json({
      message: `Error updating Student with id=${req.params.id}`
    });
  }
};

// 5. Delete a student by ID
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await StudentAdmission.destroy({
      where: { student_id: id }
    });

    if (!deleted) {
      return res.status(404).json({
        message: `Cannot delete Student with id=${id}. Maybe Student was not found!`
      });
    }

    res.status(200).json({ message: 'Student deleted successfully!' });
  } catch (err) {
    res.status(500).json({
      message: `Could not delete Student with id=${req.params.id}`
    });
  }
};
