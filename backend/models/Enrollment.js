// models/Enrollment.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');

const Enrollment = seq.define('Enrollment', {
  enrollment_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  student_id: { type: DataTypes.INTEGER, allowNull: false },
  room_id: { type: DataTypes.INTEGER, allowNull: false },
  session_id: { type: DataTypes.INTEGER, allowNull: false },
  enrollment_date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: 'Active' }
}, {
  tableName: 'tbl_Enrollment',
  timestamps: false
});

module.exports = Enrollment;
