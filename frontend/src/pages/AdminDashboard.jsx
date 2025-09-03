import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const AdminDashboard = () => {
    const { user, logout } = useContext(AuthContext);
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-2 text-xl">Welcome, {user?.name || 'Admin'}!</p>
            <p>Your role is: {user?.role}</p>
            <button onClick={logout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded">Logout</button>
            {/* Add links to manage hostels, users, etc. */}
        </div>
    )
}

export default AdminDashboard;
