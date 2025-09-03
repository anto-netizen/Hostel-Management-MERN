import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import all the components
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Admin Components
import HostelManagement from './components/Admin/HostelManagement';
import WardenManagement from './components/Admin/WardenManagement';
import RoomTypeManagement from './components/Admin/RoomTypeManagement';
import SessionManagement from './components/Admin/SessionManagement';
import StudentManagement from './components/Admin/StudentManagement';
import SupplierManagement from './components/Admin/SupplierManagement';
import ItemCategoryManagement from './components/Admin/ItemCategoryManagement';
import UOMManagement from './components/Admin/UOMManagement';
import ItemManagement from './components/Admin/ItemManagement';

// Warden Components
import WardenRoomManagement from './components/Warden/RoomManagement';
import EnrollmentManagement from './components/Warden/EnrollmentManagement';
import MaintenanceManagement from './components/Warden/MaintenanceManagement';

// Mess Components
import PurchaseOrderManagement from './components/Mess/PurchaseOrderManagement';
import StockInward from './components/Mess/StockInward';
import StockManagement from './components/Mess/StockManagement';
import DailyConsumption from './components/Mess/DailyConsumption';
import MenuManagement from './components/Mess/MenuManagement';
import MenuScheduleManagement from './components/Mess/MenuScheduleManagement';
import MessAttendance from './components/Mess/MessAttendance';
import MessBillManagement from './components/Mess/MessBillManagement';

// Student Components
import StudentDashboard from './components/Student/StudentDashboard';
import ReportMaintenance from './components/Student/ReportMaintenance';
import ViewMessBills from './components/Student/ViewMessBills';
import ViewWeeklyMenu from './components/Student/ViewWeeklyMenu';

// A simple Login simulation component
const LoginScreen = ({ onLogin }) => (
    <div className="flex items-center justify-center h-screen bg-gray-200">
        <div className="p-8 bg-white rounded-lg shadow-lg text-center">
            <h1 className="text-2xl font-bold mb-6">Hostel Management System</h1>
            <h2 className="text-xl mb-4">Select Your Role to Login</h2>
            <div className="flex flex-col space-y-2">
                <button onClick={() => onLogin('Admin')} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Login as Admin</button>
                <button onClick={() => onLogin('Warden')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Login as Warden</button>
                <button onClick={() => onLogin('Mess')} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Login as Mess Manager</button>
                <button onClick={() => onLogin('Student')} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Login as Student</button>
            </div>
        </div>
    </div>
);

function App() {
    // This state simulates user authentication.
    // In a real app, this would be null initially and set after a successful API login.
    const [userRole, setUserRole] = useState(null);

    const handleLogin = (role) => setUserRole(role);
    const handleLogout = () => setUserRole(null);

    if (!userRole) {
        return <LoginScreen onLogin={handleLogin} />;
    }

    return (
            <Routes>
                <Route path="/" element={<MainLayout userRole={userRole} onLogout={handleLogout} />}>
                    {/* Redirect base path to the appropriate dashboard */}
                    <Route index element={<Navigate to={`/${userRole.toLowerCase()}`} />} />

                    {/* Admin Routes */}
                    <Route path="admin" element={<ProtectedRoute userRole={userRole} requiredRole="Admin" />}>
                        <Route index element={<HostelManagement />} />
                        <Route path="hostels" element={<HostelManagement />} />
                        <Route path="wardens" element={<WardenManagement />} />
                        <Route path="room-types" element={<RoomTypeManagement />} />
                        <Route path="sessions" element={<SessionManagement />} />
                        <Route path="students" element={<StudentManagement />} />
                        <Route path="suppliers" element={<SupplierManagement />} />
                        <Route path="item-categories" element={<ItemCategoryManagement />} />
                        <Route path="uoms" element={<UOMManagement />} />
                        <Route path="items" element={<ItemManagement />} />
                    </Route>

                    {/* Warden Routes */}
                    <Route path="warden" element={<ProtectedRoute userRole={userRole} requiredRole="Warden" />}>
                        <Route index element={<WardenRoomManagement />} />
                        <Route path="rooms" element={<WardenRoomManagement />} />
                        <Route path="enrollment" element={<EnrollmentManagement />} />
                        <Route path="maintenance" element={<MaintenanceManagement />} />
                    </Route>
                    
                    {/* Mess Routes */}
                    <Route path="mess" element={<ProtectedRoute userRole={userRole} requiredRole="Mess" />}>
                        <Route index element={<PurchaseOrderManagement />} />
                        <Route path="po" element={<PurchaseOrderManagement />} />
                        <Route path="stock-inward" element={<StockInward />} />
                        <Route path="inventory" element={<StockManagement />} />
                        <Route path="consumption" element={<DailyConsumption />} />
                        <Route path="menus" element={<MenuManagement />} />
                        <Route path="schedule" element={<MenuScheduleManagement />} />
                        <Route path="attendance" element={<MessAttendance />} />
                        <Route path="billing" element={<MessBillManagement />} />
                    </Route>
                    
                    {/* Student Routes */}
                    <Route path="student" element={<ProtectedRoute userRole={userRole} requiredRole="Student" />}>
                        <Route index element={<StudentDashboard />} />
                        <Route path="dashboard" element={<StudentDashboard />} />
                        <Route path="maintenance" element={<ReportMaintenance />} />
                        <Route path="mess-bills" element={<ViewMessBills />} />
                        <Route path="weekly-menu" element={<ViewWeeklyMenu />} />
                    </Route>
                </Route>
                
                {/* A fallback for any unknown paths */}
                <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
    );
}

export default App;
