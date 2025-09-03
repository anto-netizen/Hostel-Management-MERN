// models/PurchaseOrderItem.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');
const PurchaseOrderItem = seq.define('PurchaseOrderItem', {
  po_item_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  po_id: { type: DataTypes.INTEGER, allowNull: false },
  item_id: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
}, { tableName: 'tbl_PurchaseOrderItem', timestamps: false });
module.exports = PurchaseOrderItem;
