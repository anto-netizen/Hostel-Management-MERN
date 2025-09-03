import React, { useState, useEffect } from 'react';

// A helper function to format dates
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
};

const MaintenanceManagement = () => {
    const loggedInWardenId = 1; // From auth context

    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:5000/api/maintenance';

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/warden/${loggedInWardenId}`);
            if (!response.ok) throw new Error('Failed to fetch maintenance requests');
            const data = await response.json();
            setRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [loggedInWardenId]);

    const handleStatusChange = async (maintenanceId, newStatus) => {
        if (!window.confirm(`Are you sure you want to change the status to "${newStatus}"?`)) return;

        try {
            const response = await fetch(`${API_URL}/${maintenanceId}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (!response.ok) throw new Error('Failed to update status');
            fetchRequests(); // Re-fetch to show updated data
        } catch (err) {
            setError(err.message);
        }
    };

    const StatusBadge = ({ status }) => {
        let colorClasses = 'bg-gray-200 text-gray-800';
        if (status === 'Pending') colorClasses = 'bg-yellow-200 text-yellow-800';
        else if (status === 'In Progress') colorClasses = 'bg-blue-200 text-blue-800';
        else if (status === 'Resolved') colorClasses = 'bg-green-200 text-green-800';
        
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClasses}`}>{status}</span>;
    };
    
    if (isLoading) return <div className="p-8 text-center">Loading requests...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Hostel Maintenance Requests</h1>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                            <th className="py-3 px-6 text-left">Room</th>
                            <th className="py-3 px-6 text-left">Description</th>
                            <th className="py-3 px-6 text-left">Reported By</th>
                            <th className="py-3 px-6 text-left">Reported On</th>
                            <th className="py-3 px-6 text-center">Status</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {requests.map(req => (
                            <tr key={req.maintenance_id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 font-semibold">{req.HostelRoom.room_number}</td>
                                <td className="py-3 px-6">{req.description}</td>
                                <td className="py-3 px-6">{req.Reporter.first_name} {req.Reporter.last_name}</td>
                                <td className="py-3 px-6">{formatDate(req.reported_date)}</td>
                                <td className="py-3 px-6 text-center"><StatusBadge status={req.status} /></td>
                                <td className="py-3 px-6 text-center">
                                    {req.status !== 'Resolved' && (
                                        <select
                                            onChange={(e) => handleStatusChange(req.maintenance_id, e.target.value)}
                                            value={req.status}
                                            className="text-xs border rounded p-1"
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Resolved">Resolved</option>
                                        </select>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MaintenanceManagement;
