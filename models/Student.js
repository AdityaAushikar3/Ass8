const mongoose = require('mongoose');

// Student Schema Definition
const studentSchema = new mongoose.Schema(
  {
    rollNo: {
      type: String,
      required: [true, 'Roll number is required'],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true
    },
    marks: {
      type: Number,
      required: [true, 'Marks are required'],
      min: [0, 'Marks cannot be less than 0'],
      max: [100, 'Marks cannot be greater than 100']
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Student', studentSchema);
