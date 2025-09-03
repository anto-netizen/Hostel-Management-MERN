// models/HostelMaintenance.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');

const HostelMaintenance = seq.define('HostelMaintenance', {
  maintenance_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  room_id: { type: DataTypes.INTEGER, allowNull: false },
  reported_by_student_id: { type: DataTypes.INTEGER, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  reported_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' }, // Pending, In Progress, Resolved
  resolved_date: { type: DataTypes.DATE, allowNull: true }
}, {
  tableName: 'tbl_HostelMaintenance',
  timestamps: false
});

module.exports = HostelMaintenance;
