import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700">
          Welcome back, <span className="text-indigo-600">{user?.name}</span>!
        </h2>
        <p className="mt-2 text-gray-600">
          Your role is <span className="font-semibold">{user?.role}</span>. Manage all hostel activities from the sidebar.
        </p>
      </div>
      {/* You can add summary cards here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total Students</h3>
            <p className="text-3xl font-bold text-indigo-600 mt-2">150</p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Rooms Available</h3>
            <p className="text-3xl font-bold text-green-600 mt-2">25</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
