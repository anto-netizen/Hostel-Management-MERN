import React, { useState, useEffect } from 'react';

// Reusable component to display the status with color coding
const StatusBadge = ({ status }) => {
    let colorClasses = 'bg-gray-200 text-gray-800';
    if (status === 'Pending') colorClasses = 'bg-yellow-200 text-yellow-800';
    else if (status === 'In Progress') colorClasses = 'bg-blue-200 text-blue-800';
    else if (status === 'Resolved') colorClasses = 'bg-green-200 text-green-800';
    
    return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClasses}`}>{status}</span>;
};

const ReportMaintenance = () => {
    const loggedInStudentId = 1; // From auth context

    const [requests, setRequests] = useState([]);
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:5000/api/maintenance/student';

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/${loggedInStudentId}`);
            if (!response.ok) throw new Error('Failed to fetch your requests');
            setRequests(await response.json());
        } catch (err) { setError(err.message); } 
        finally { setIsLoading(false); }
    };

    useEffect(() => {
        fetchRequests();
    }, [loggedInStudentId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description.trim()) {
            alert('Please provide a description of the issue.');
            return;
        }
        setIsSubmitting(true);
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ student_id: loggedInStudentId, description })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to submit request');
            
            alert('Your request has been submitted successfully!');
            setDescription('');
            fetchRequests(); // Refresh the list with the new request
        } catch (err) {
            alert(`Error: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Maintenance Requests</h1>

                {/* --- Submission Form --- */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-bold mb-4">Report a New Issue</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
                                Please describe the issue in your room:
                            </label>
                            <textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows="4"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="e.g., The faucet in the bathroom is leaking."
                            ></textarea>
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-md disabled:bg-gray-400"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Request'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- History of Requests --- */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-4">My Request History</h2>
                    {isLoading ? <p>Loading history...</p> : error ? <p className="text-red-500">{error}</p> : (
                        <div className="space-y-4">
                            {requests.length > 0 ? requests.map(req => (
                                <div key={req.maintenance_id} className="border-b pb-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="font-semibold">Room {req.HostelRoom.room_number}</p>
                                            <p className="text-gray-700">{req.description}</p>
                                        </div>
                                        <StatusBadge status={req.status} />
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Reported on: {new Date(req.reported_date).toLocaleString()}
                                    </p>
                                </div>
                            )) : <p>You have not submitted any maintenance requests.</p>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportMaintenance;
