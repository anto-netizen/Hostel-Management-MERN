// models/Menu.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');
const Menu = seq.define('Menu', {
  menu_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  menu_name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: { type: DataTypes.TEXT }
}, { tableName: 'tbl_Menu', timestamps: false });
module.exports = Menu;