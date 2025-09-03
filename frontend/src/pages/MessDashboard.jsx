// src/pages/AdminDashboard.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import AuthContext from '../context/AuthContext';

const MessDashboard = () => {
    const { logout } = useContext(AuthContext);
    return (
        <div>
            <h1>Mess Dashboard</h1>
            <p>Welcome, mess!</p>
            <nav>
                <Link to="/manage-hostels">Manage Hostels</Link>
                {/* Add other links here later */}
            </nav>
            <br />
            <button onClick={logout}>Logout</button>
        </div>
    );
};
export default MessDashboard;
