import React, { useState, useEffect } from 'react';

// A generic card component for the dashboard layout
const DashboardCard = ({ title, children, className }) => (
    <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>
        <h2 className="text-xl font-bold text-gray-800 mb-4">{title}</h2>
        {children}
    </div>
);

const StudentDashboard = () => {
    // In a real app, this ID would come from an authentication context after login
    const loggedInStudentId = 1; 

    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/student-dashboard/${loggedInStudentId}`);
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Failed to fetch dashboard data');
                }
                const data = await response.json();
                setDashboardData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, [loggedInStudentId]);

    if (isLoading) return <div className="p-8 text-center">Loading your dashboard...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
    if (!dashboardData) return null;

    const { profile, hostel, latestBill, todaysMenu } = dashboardData;
    const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome, {profile.first_name}!</h1>
                    <p className="text-gray-600">Here is your hostel summary for today.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Column 1: Profile & Hostel Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <DashboardCard title="My Profile">
                            <p><strong>Name:</strong> {profile.first_name} {profile.last_name}</p>
                            <p><strong>Reg No:</strong> {profile.student_reg_no}</p>
                            <p><strong>Email:</strong> {profile.email}</p>
                        </DashboardCard>
                        <DashboardCard title="Hostel Details">
                            <p><strong>Hostel:</strong> {hostel.hostel_name}</p>
                            <p><strong>Room:</strong> {hostel.room_number}</p>
                        </DashboardCard>
                    </div>

                    {/* Column 2: Mess & Actions */}
                    <div className="lg:col-span-2 space-y-6">
                        <DashboardCard title="Mess Information">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Latest Mess Bill</h3>
                                    {latestBill ? (
                                        <div className="bg-gray-50 p-4 rounded-md">
                                            <p className="text-sm">For {monthNames[latestBill.month]} {latestBill.year}</p>
                                            <p className="text-2xl font-bold">${parseFloat(latestBill.amount).toFixed(2)}</p>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full mt-2 inline-block ${latestBill.status === 'Paid' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                                                {latestBill.status}
                                            </span>
                                        </div>
                                    ) : <p>No bills generated yet.</p>}
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-2">Today's Menu</h3>
                                    <ul className="space-y-1 text-gray-700">
                                        <li><strong>Breakfast:</strong> {todaysMenu.Breakfast || 'Not set'}</li>
                                        <li><strong>Lunch:</strong> {todaysMenu.Lunch || 'Not set'}</li>
                                        <li><strong>Dinner:</strong> {todaysMenu.Dinner || 'Not set'}</li>
                                    </ul>
                                </div>
                            </div>
                        </DashboardCard>
                        
                        <DashboardCard title="Quick Actions">
                            <div className="flex flex-wrap gap-4">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                    View All Mess Bills
                                </button>
                                <button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                                    Report Maintenance Issue
                                </button>
                                <button className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded">
                                    View Weekly Menu
                                </button>
                            </div>
                        </DashboardCard>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;


