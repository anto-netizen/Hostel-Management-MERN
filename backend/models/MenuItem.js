// models/MenuItem.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');
const MenuItem = seq.define('MenuItem', {
  menu_item_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  menu_id: { type: DataTypes.INTEGER, allowNull: false },
  item_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.DECIMAL(10, 3), allowNull: false } // Quantity per serving, e.g., 0.100 Kg
}, { tableName: 'tbl_Menu_Item', timestamps: false });
module.exports = MenuItem;