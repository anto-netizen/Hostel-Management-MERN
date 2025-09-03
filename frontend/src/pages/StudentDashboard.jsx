// src/pages/AdminDashboard.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import AuthContext from '../context/AuthContext';

const StudentDashboard = () => {
    const { logout } = useContext(AuthContext);
    return (
        <div>
            <h1>Student Dashboard</h1>
            <p>Welcome, Student!</p>
            <nav>
                <Link to="/manage-hostels">Manage Hostels</Link>
                {/* Add other links here later */}
            </nav>
            <br />
            <button onClick={logout}>Logout</button>
        </div>
    );
};
export default StudentDashboard;
