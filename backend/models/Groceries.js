// models/Groceries.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');
const Groceries = seq.define('Groceries', {
  grocery_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  item_id: { type: DataTypes.INTEGER, allowNull: false },
  po_id: { type: DataTypes.INTEGER, allowNull: true }, // Link back to the PO
  quantity_purchased: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  purchase_date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  supplier_id: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'tbl_Groceries', timestamps: false });
module.exports = Groceries;

