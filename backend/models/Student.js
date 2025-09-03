// models/Student.js
const { DataTypes } = require('sequelize');
const seq = require('../config/db');
const bcrypt = require('bcryptjs');

const Student = seq.define('Student', {
  student_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  student_reg_no: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
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
  password: { // <-- ADD THIS FIELD
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'tbl_Student',
  timestamps: false,
  hooks: {
    // This "hook" runs automatically before a new student is created
    beforeCreate: async (student) => {
      if (student.password) {
        const salt = await bcrypt.genSalt(10);
        student.password = await bcrypt.hash(student.password, salt);
      }
    }
  }
});

module.exports = Student;
