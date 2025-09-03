const express = require('express');
const router = express.Router();

// Import the controller functions
const { registerUser, loginUser } = require('../controllers/userController');

// Define the routes
// When a POST request comes to /register, use the registerUser function
router.post('/register', registerUser);

// When a POST request comes to /login, use the loginUser function
router.post('/login', loginUser);

// Export the router so server.js can use it
module.exports = router;
