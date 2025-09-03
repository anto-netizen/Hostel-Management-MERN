import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

// This data structure will drive our navigation.
// In a real app, this could be dynamically generated based on user role.
const navLinks = {
    Admin: [
        { name: 'Hostels', path: '/admin/hostels' },
        { name: 'Wardens', path: '/admin/wardens' },
        { name: 'Room Types', path: '/admin/room-types' },
        { name: 'Sessions', path: '/admin/sessions' },
        { name: 'Students Master', path: '/admin/students' },
        { name: 'Suppliers', path: '/admin/suppliers' },
        { name: 'Item Categories', path: '/admin/item-categories' },
        { name: 'UOMs', path: '/admin/uoms' },
        { name: 'Items Master', path: '/admin/items' },
    ],
    Warden: [
        { name: 'Room Management', path: '/warden/rooms' },
        { name: 'Enrollment', path: '/warden/enrollment' },
        { name: 'Maintenance', path: '/warden/maintenance' },
    ],
    Mess: [
        { name: 'Purchase Orders', path: '/mess/po' },
        { name: 'Stock Inward', path: '/mess/stock-inward' },
        { name: 'Stock View', path: '/mess/inventory' },
        { name: 'Consumption', path: '/mess/consumption' },
        { name: 'Menu Master', path: '/mess/menus' },
        { name: 'Menu Schedule', path: '/mess/schedule' },
        { name: 'Attendance', path: '/mess/attendance' },
        { name: 'Bill Generation', path: '/mess/billing' },
    ],
    Student: [
        { name: 'Dashboard', path: '/student/dashboard' },
        { name: 'Report Issue', path: '/student/maintenance' },
        { name: 'My Mess Bills', path: '/student/mess-bills' },
        { name: 'Weekly Menu', path: '/student/weekly-menu' },
    ]
};

const MainLayout = ({ userRole, onLogout }) => {
    const links = navLinks[userRole] || [];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-800 text-white flex flex-col">
                <div className="p-4 text-2xl font-bold border-b border-gray-700">HostelMS</div>
                <nav className="flex-1 p-2 space-y-2">
                    {links.map(link => (
                        <NavLink
                            key={link.name}
                            to={link.path}
                            className={({ isActive }) =>
                                `block py-2 px-4 rounded transition duration-200 hover:bg-gray-700 ${isActive ? 'bg-blue-600' : ''}`
                            }
                        >
                            {link.name}
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-700">
                    <button onClick={onLogout} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        Logout ({userRole})
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto">
                {/* Outlet is a placeholder from React Router where the matched route's component will be rendered. */}
                <Outlet />
            </main>
        </div>
    );
};

export default MainLayout;
