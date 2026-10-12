const Student = require('../models/Student');

// 1. CREATE: Add a new student record
// POST /api/students
const createStudent = async (req, res) => {
  try {
    const { rollNo, name, email, department, marks } = req.body;

    // Validate required fields
    if (!rollNo || !name || !email || !department || marks === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide rollNo, name, email, department, and marks'
      });
    }

    // Check if rollNo already exists
    const existingStudent = await Student.findOne({ rollNo: rollNo.trim() });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: `Student with roll number "${rollNo}" already exists`
      });
    }

    // Create and save student
    const student = new Student({
      rollNo: rollNo.trim(),
      name: name.trim(),
      email: email.trim(),
      department: department.trim(),
      marks: Number(marks)
    });

    const savedStudent = await student.save();

    res.status(201).json({
      success: true,
      message: 'Student record created successfully',
      data: savedStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating student record',
      error: error.message
    });
  }
};

// 2. READ ALL: Get all student records
// GET /api/students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching student records',
      error: error.message
    });
  }
};

// 3. READ ONE: Get single student by ID or roll number
// GET /api/students/:id
const getStudentById = async (req, res) => {
  try {
    const param = req.params.id;

    // Try finding by MongoDB _id if valid ObjectId, else find by rollNo
    let student;
    if (param.match(/^[0-9a-fA-F]{24}$/)) {
      student = await Student.findById(param);
    } else {
      student = await Student.findOne({ rollNo: param });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        message: `Student not found with ID or roll number "${param}"`
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching student',
      error: error.message
    });
  }
};

// 4. UPDATE: Update an existing student record by ID
// PUT /api/students/:id
const updateStudent = async (req, res) => {
  try {
    const param = req.params.id;
    const { name, email, department, marks } = req.body;

    let filter = param.match(/^[0-9a-fA-F]{24}$/) ? { _id: param } : { rollNo: param };

    const updatedStudent = await Student.findOneAndUpdate(
      filter,
      {
        ...(name && { name: name.trim() }),
        ...(email && { email: email.trim() }),
        ...(department && { department: department.trim() }),
        ...(marks !== undefined && { marks: Number(marks) })
      },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: `Student not found with identifier "${param}"`
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student record updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating student record',
      error: error.message
    });
  }
};

// 5. DELETE: Remove student record by ID
// DELETE /api/students/:id
const deleteStudent = async (req, res) => {
  try {
    const param = req.params.id;

    let filter = param.match(/^[0-9a-fA-F]{24}$/) ? { _id: param } : { rollNo: param };

    const deletedStudent = await Student.findOneAndDelete(filter);

    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: `Student not found with identifier "${param}"`
      });
    }

    res.status(200).json({
      success: true,
      message: `Student record for "${deletedStudent.name}" (Roll No: ${deletedStudent.rollNo}) deleted successfully`,
      data: deletedStudent
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting student record',
      error: error.message
    });
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent
};
