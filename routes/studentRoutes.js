const express = require('express');
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');

// Routes for /api/students
router.route('/')
  .post(createStudent)      // CREATE student
  .get(getAllStudents);     // READ all students

// Routes for /api/students/:id
router.route('/:id')
  .get(getStudentById)      // READ single student
  .put(updateStudent)       // UPDATE student
  .delete(deleteStudent);   // DELETE student

module.exports = router;
