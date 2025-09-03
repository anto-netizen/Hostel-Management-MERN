import React, { useState, useEffect } from 'react';

const SessionModal = ({ session, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        session_name: '',
        start_date: '',
        end_date: ''
    });

    useEffect(() => {
        if (session) {
            setFormData({
                session_name: session.session_name || '',
                start_date: session.start_date || '',
                end_date: session.end_date || ''
            });
        }
    }, [session]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{session ? 'Edit Session' : 'Add New Session'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Session Name (e.g., 2024-2025)</label>
                        <input type="text" name="session_name" value={formData.session_name} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Start Date</label>
                        <input type="date" name="start_date" value={formData.start_date} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">End Date</label>
                        <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3" />
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                        <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SessionManagement = () => {
    const [sessions, setSessions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSession, setCurrentSession] = useState(null);

    const API_URL = 'http://localhost:5000/api/sessions';

    const fetchSessions = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            setSessions(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleSave = async (sessionData) => {
        const method = currentSession ? 'PUT' : 'POST';
        const url = currentSession ? `${API_URL}/${currentSession.session_id}` : API_URL;

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(sessionData)
            });
            if (!response.ok) throw new Error('Failed to save session');
            fetchSessions();
            handleCloseModal();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleActivate = async (sessionId) => {
        if (window.confirm('Are you sure you want to make this the active session? All other sessions will be deactivated.')) {
            try {
                const response = await fetch(`${API_URL}/activate/${sessionId}`, { method: 'PATCH' });
                if (!response.ok) throw new Error('Failed to activate session');
                fetchSessions();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleOpenModal = (session = null) => {
        setCurrentSession(session);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);
    
    if (isLoading) return <div className="text-center p-8">Loading sessions...</div>;
    if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Session Management</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                >
                    + Add New Session
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                            <th className="py-3 px-6 text-left">Session Name</th>
                            <th className="py-3 px-6 text-left">Start Date</th>
                            <th className="py-3 px-6 text-left">End Date</th>
                            <th className="py-3 px-6 text-center">Status</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {sessions.map(session => (
                            <tr key={session.session_id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 font-semibold">{session.session_name}</td>
                                <td className="py-3 px-6">{new Date(session.start_date).toLocaleDateString()}</td>
                                <td className="py-3 px-6">{new Date(session.end_date).toLocaleDateString()}</td>
                                <td className="py-3 px-6 text-center">
                                    {session.is_active ? (
                                        <span className="bg-green-200 text-green-800 py-1 px-3 rounded-full text-xs">Active</span>
                                    ) : (
                                        <span className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full text-xs">Inactive</span>
                                    )}
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <button
                                        onClick={() => handleActivate(session.session_id)}
                                        disabled={session.is_active}
                                        className={`font-bold py-1 px-3 rounded text-xs mr-2 ${session.is_active ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-700 text-white'}`}
                                    >
                                        Set Active
                                    </button>
                                    <button
                                        onClick={() => handleOpenModal(session)}
                                        className="font-bold py-1 px-3 rounded text-xs bg-yellow-500 hover:bg-yellow-700 text-white"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && <SessionModal session={currentSession} onClose={handleCloseModal} onSave={handleSave} />}
        </div>
    );
};

export default SessionManagement;
