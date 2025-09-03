// models/RoomType.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');

const RoomType = seq.define('RoomType', {
  room_type_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  type_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  tableName: 'tbl_RoomType',
  timestamps: false
});

module.exports = RoomType;
