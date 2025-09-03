// models/Attendance.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');

const Attendance = seq.define('Attendance', {
  attendance_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  student_id: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  meal_type: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Present' }
}, {
  tableName: 'tbl_Attendance',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['student_id', 'date', 'meal_type'] }
  ]
});

module.exports = Attendance;
