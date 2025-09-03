// models/UOM.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');

const UOM = seq.define('UOM', {
  uom_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  uom_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  uom_short_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'tbl_UOM',
  timestamps: false
});

module.exports = UOM;
