// models/Session.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');

const Session = seq.define('Session', {
  session_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  session_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  start_date: {
    type: DataTypes.DATEONLY, // Stores date without time
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  }
}, {
  tableName: 'tbl_Session',
  timestamps: false
});

module.exports = Session;
