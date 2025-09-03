// models/HostelRoom.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');

const HostelRoom = seq.define('HostelRoom', {
  room_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  hostel_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  room_number: {
    type: DataTypes.STRING,
    allowNull: false
  },
  room_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Available' // e.g., 'Available', 'Occupied', 'Under Maintenance'
  }
}, {
  tableName: 'tbl_HostelRoom',
  timestamps: false
});

module.exports = HostelRoom;
