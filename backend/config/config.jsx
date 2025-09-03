const { Sequelize } = require('sequelize');

// Initialize Sequelize with your MySQL credentials
const seq = new Sequelize('hostel_db', 'root', 'R@phael001', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = seq;
