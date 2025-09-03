// models/Item.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');

const Item = seq.define('Item', {
  item_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  item_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  uom_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'tbl_Item',
  timestamps: false
});

module.exports = Item;
