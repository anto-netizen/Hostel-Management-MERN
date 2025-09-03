// models/DailyConsumption.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');

const DailyConsumption = seq.define('DailyConsumption', {
  consumption_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  item_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  meal_type: { type: DataTypes.STRING, allowNull: false } // Breakfast, Lunch, Dinner
}, {
  tableName: 'tbl_DailyConsumption',
  timestamps: false
});

module.exports = DailyConsumption;
