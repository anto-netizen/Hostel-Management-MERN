import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ userRole, requiredRole }) => {
    if (userRole !== requiredRole) {
        // If the roles don't match, redirect to a login or unauthorized page.
        // For now, we'll just show a simple message.
        return (
            <div className="p-8 text-center text-red-500">
                <h1 className="text-2xl font-bold">Unauthorized Access</h1>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }

    // If roles match, render the content of the route.
    return <Outlet />;
};

export default ProtectedRoute;
