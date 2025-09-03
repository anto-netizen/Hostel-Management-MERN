// models/Warden.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');

const Warden = seq.define('Warden', {
  warden_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  phone: {
    type: DataTypes.STRING
  }
}, {
  tableName: 'tbl_Warden',
  timestamps: false
});

module.exports = Warden;
