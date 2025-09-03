// models/Hostel.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');

const Hostel = seq.define('Hostel', {
  hostel_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  hostel_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  warden_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'tbl_Warden', // This is the table name
      key: 'warden_id',    // This is the column name in tbl_Warden
    }
  }
}, {
  // To match your table name exactly and prevent Sequelize from pluralizing
  tableName: 'tbl_Hostel',
  // Disable the default createdAt and updatedAt columns
  timestamps: false 
});

module.exports = Hostel;
