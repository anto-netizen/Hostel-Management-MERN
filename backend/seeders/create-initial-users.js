// seeders/create-initial-users.js
const seq = require('../config/db');
const { Student, Warden } = require('../models'); // Import all your user models

// --- IMPORTANT ---
// Ensure you have added the 'password' field and the 'beforeCreate' hook
// to your Student, Warden, and any other user models (Admin, Mess) first.
// For example, in models/Warden.js, add the password field and the bcrypt hook.

const createUsers = async () => {
  try {
    // Connect to the database
    await seq.authenticate();
    console.log('Database connection has been established successfully.');

    // --- User Data ---
    const initialStudents = [
      {
        student_reg_no: 'S001',
        first_name: 'Alice',
        last_name: 'Smith',
        email: 'student@example.com',
        password: 'password123' // This will be hashed automatically
      }
    ];

    const initialWardens = [
      {
        first_name: 'John',
        last_name: 'Doe',
        email: 'warden@example.com',
        phone: '1234567890',
        password: 'password123' // This will be hashed automatically
      }
    ];
    
    // In a full app, you would also have initialAdmin and initialMess users.

    // --- Create Users ---
    // The {individualHooks: true} option is important for bulkCreate to trigger the beforeCreate hook.
    await Student.bulkCreate(initialStudents, { individualHooks: true });
    console.log('Initial students created successfully.');

    await Warden.bulkCreate(initialWardens, { individualHooks: true });
    console.log('Initial wardens created successfully.');

    console.log('Seeding complete!');

  } catch (error) {
    console.error('Unable to seed the database:', error);
  } finally {
    // Close the database connection
    await seq.close();
  }
};

// Run the function
createUsers();
