// models/Supplier.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');

const Supplier = seq.define('Supplier', {
  supplier_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  supplier_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  contact_person: {
    type: DataTypes.STRING
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: {
      isEmail: true
    }
  }
}, {
  tableName: 'tbl_Supplier',
  timestamps: false
});

module.exports = Supplier;
