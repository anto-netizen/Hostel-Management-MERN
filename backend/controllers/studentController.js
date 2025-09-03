// controllers/studentController.js
const { Student } = require('../models');

// 1. Create a new Student
exports.createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 2. Get all Students
exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({ order: [['first_name', 'ASC']] });
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 3. Update a Student by ID
exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Student.update(req.body, { where: { student_id: id } });
    if (!updated) return res.status(404).json({ message: 'Student not found' });
    const updatedStudent = await Student.findByPk(id);
    res.status(200).json(updatedStudent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 4. Delete a Student by ID
exports.deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Student.destroy({ where: { student_id: id } });
    if (!deleted) return res.status(404).json({ message: 'Student not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
