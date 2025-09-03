// models/MessBill.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');

const MessBill = seq.define('MessBill', {
  bill_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  student_id: { type: DataTypes.INTEGER, allowNull: false },
  session_id: { type: DataTypes.INTEGER, allowNull: false },
  month: { type: DataTypes.INTEGER, allowNull: false }, // 1 for Jan, 12 for Dec
  year: { type: DataTypes.INTEGER, allowNull: false },
  total_diets: { type: DataTypes.INTEGER, allowNull: false },
  diet_rate: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'Unpaid' },
  generated_date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW }
}, {
  tableName: 'tbl_MessBill',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['student_id', 'session_id', 'month', 'year'] }
  ]
});

module.exports = MessBill;
