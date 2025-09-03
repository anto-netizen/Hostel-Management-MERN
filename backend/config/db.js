// config/db.js
const { Sequelize } = require('sequelize');

// Initialize Sequelize with your database credentials
const seq = new Sequelize('db', 'root', 'R@phael001', {
  host: 'localhost',
  dialect: 'mysql'
});

module.exports = seq;
