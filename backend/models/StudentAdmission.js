// models/Student.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');

// Define the 'Student' model with the corresponding table name and fields.
const StudentAdmission = seq.define('StudentAdmission', {
  student_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  student_reg_no: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  first_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING(20)
  },
  address: {
    type: DataTypes.TEXT
  }
}, {
  // Explicitly set the table name to 'students'
  tableName: 'tbl_studentsAdmission',
  // Sequelize automatically handles `created_at` and `updated_at` with timestamps.
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = StudentAdmission;
