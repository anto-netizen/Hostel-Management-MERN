// src/pages/AdminDashboard.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import AuthContext from '../context/AuthContext';

const WardenDashboard = () => {
    const { logout } = useContext(AuthContext);
    return (
        <div>
            <h1>Warden Dashboard</h1>
            <p>Welcome, Warden!</p>
            <nav>
                <Link to="/manage-hostels">Manage Hostels</Link>
                {/* Add other links here later */}
            </nav>
            <br />
            <button onClick={logout}>Logout</button>
        </div>
    );
};
export default WardenDashboard;
