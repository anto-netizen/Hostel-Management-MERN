// models/MenuSchedule.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');

const MenuSchedule = seq.define('MenuSchedule', {
  schedule_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  menu_id: { type: DataTypes.INTEGER, allowNull: false },
  day_of_week: { type: DataTypes.STRING, allowNull: false },
  meal_type: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: 'tbl_MenuSchedule',
  timestamps: false,
  indexes: [ // Add a unique index to enforce one menu per slot
    { unique: true, fields: ['day_of_week', 'meal_type'] }
  ]
});

module.exports = MenuSchedule;
