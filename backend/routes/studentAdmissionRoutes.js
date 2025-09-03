// routes/studentAdmissionRoutes.js
const express = require('express');
const router = express.Router();
const studentAdmissionController = require('../controllers/studentAdmissionController');

// GET all students + CREATE student
router.route('/')
  .get(studentAdmissionController.getAllStudents)
  .post(studentAdmissionController.createStudent);

// GET by ID + UPDATE + DELETE
router.route('/:id')
  .get(studentAdmissionController.getStudentById)
  .put(studentAdmissionController.updateStudent)
  .delete(studentAdmissionController.deleteStudent);

module.exports = router;
