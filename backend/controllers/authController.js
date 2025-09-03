// controllers/authController.js
const { Student, Warden } = require('../models'); // Import all user models
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// A simple secret for your JWT. In production, this should be in an environment variable!
const JWT_SECRET = 'your_super_secret_key_that_is_long_and_random';

exports.login = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        let user;
        let userModel;

        // Determine which model to search based on the role
        if (role === 'Student') userModel = Student;
        else if (role === 'Warden') userModel = Warden;
        // ... add else if for Admin and Mess roles
        else return res.status(400).json({ error: 'Invalid role specified.' });
        
        // Find the user by email
        user = await userModel.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // Compare the provided password with the hashed password in the database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials.' });
        }

        // If credentials are correct, create a payload for the JWT
        const payload = {
            id: user.student_id || user.warden_id, // Use the correct ID field
            email: user.email,
            role: role
        };

        // Sign the token
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' }); // Token expires in 1 day

        res.status(200).json({
            token,
            user: {
                id: payload.id,
                email: user.email,
                role: payload.role
            }
        });

    } catch (err) {
        res.status(500).json({ error: 'Server error during login.' });
    }
};
// In controllers/authController.js
exports.register = async (req, res) => {
    try {
        // Here you would add validation for req.body
        
        // The beforeCreate hook in the Student model will hash the password automatically.
        const newStudent = await Student.create(req.body); 
        
        // You would then typically log them in by generating a JWT, similar to the login function.
        res.status(201).json({ message: "User registered successfully." });

    } catch (err) {
        res.status(500).json({ error: "Failed to register user." });
    }
};

