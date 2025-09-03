// models/ItemCategory.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');

const ItemCategory = seq.define('ItemCategory', {
  category_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  category_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'tbl_ItemCategory',
  timestamps: false
});

module.exports = ItemCategory;
