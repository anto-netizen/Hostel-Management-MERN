// models/PurchaseOrder.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');
const PurchaseOrder = seq.define('PurchaseOrder', {
  po_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  supplier_id: { type: DataTypes.INTEGER, allowNull: false },
  order_date: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  total_amount: { type: DataTypes.DECIMAL(10, 2) },
  status: { type: DataTypes.STRING, defaultValue: 'Pending' }
}, { tableName: 'tbl_PurchaseOrder', timestamps: false });
module.exports = PurchaseOrder;

