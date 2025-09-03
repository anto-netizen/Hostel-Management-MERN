// server.js
const express = require('express');
const cors = require('cors');
const seq = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// --- Import Routes ---
const hostelRoute = require('./routes/hostelRoute');
const wardenRoute = require('./routes/wardenRoute');
const roomTypeRoute = require('./routes/roomTypeRoute');
const roomRoute = require('./routes/roomRoute');
const sessionRoute = require('./routes/sessionRoute');
const studentRoute = require('./routes/studentRoute');
const enrollmentRoute = require('./routes/enrollmentRoute');
const maintenanceRoute = require('./routes/maintenanceRoute');
const supplierRoute = require('./routes/supplierRoute');
const itemCategoryRoute = require('./routes/itemCategoryRoute');
const uomRoute = require('./routes/uomRoute');
const itemRoute = require('./routes/itemRoute');
const purchaseOrderRoute = require('./routes/purchaseOrderRoute');
const stockRoute = require('./routes/stockRoute');
const dailyConsumptionRoute = require('./routes/dailyConsumption');
const menuScheduleRoute = require('./routes/menuScheduleRoute');
const attendanceRoute = require('./routes/attendanceRoute');
const messBillRoute = require('./routes/messBillRoute');
const studentDashboardRoute = require('./routes/studentDashboardRoute');
const authRoute = require('./routes/authRoute');
const studentAdmissionRoute = require('./routes/studentAdmissionRoutes');

// ... import other routes as you build them

// --- Map Routes ---
app.use('/api/hostels', hostelRoute);
app.use('/api/wardens', wardenRoute); 
app.use('/api/roomtypes', roomTypeRoute); 
app.use('/api/rooms',roomRoute);
app.use('/api/sessions',sessionRoute);
app.use('/api/students',studentRoute);
app.use('/api/enrollments',enrollmentRoute);
app.use('/api/maintenance',maintenanceRoute);
app.use('/api/suppliers',supplierRoute);
app.use('/api/itemcategories',itemCategoryRoute);
app.use('/api/uoms',uomRoute);
app.use('/api/items',itemRoute);
app.use('/api/pos',purchaseOrderRoute);
app.use('/api/stock',stockRoute);
app.use('/api/consumption',dailyConsumptionRoute);
app.use('/api/schedule',menuScheduleRoute);
app.use('/api/attendance',attendanceRoute);
app.use('/api/mess-bills',messBillRoute);
app.use('/api/student-dashboard', studentDashboardRoute); // <-- ADD
app.use('/api/auth',authRoute);
app.use('/api/studentsAdmission',studentAdmissionRoute);
// ... use other routes

// --- Import Models for Sync ---
require('./models');
// ... require other models

// --- Start Server ---
const startServer = async () => {
  try {
    await seq.authenticate();
    console.log("DB Connected successfully");

    // {force: false} prevents it from dropping tables on every restart
    await seq.sync({ force: false }); 
    console.log("All models were synchronized successfully.");

    app.listen(5000, () => {
      console.log("Server listening at http://localhost:5000");
    });
  } catch (error) {
    console.error('Unable to start server:', error.message);
  }
};

startServer();
