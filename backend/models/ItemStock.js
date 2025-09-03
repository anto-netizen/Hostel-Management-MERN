// models/ItemStock.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');
const ItemStock = seq.define('ItemStock', {
  stock_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  item_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 },
  last_updated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { tableName: 'tbl_ItemStock', timestamps: false });
module.exports = ItemStock;
