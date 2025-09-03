// src/components/Admin/WardenManagement.js
import React, { useState, useEffect } from 'react';

// Reusable Modal Component for Add/Edit Form
const WardenModal = ({ warden, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone: ''
    });

    useEffect(() => {
        if (warden) {
            setFormData({
                first_name: warden.first_name || '',
                last_name: warden.last_name || '',
                email: warden.email || '',
                phone: warden.phone || ''
            });
        }
    }, [warden]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{warden ? 'Edit Warden' : 'Add New Warden'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-4">
                        <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="mb-6">
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                        <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancel</button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Main Component
const WardenManagement = () => {
    const [wardens, setWardens] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentWarden, setCurrentWarden] = useState(null);

    const API_URL = 'http://localhost:5000/api/wardens';

    const fetchWardens = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            setWardens(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWardens();
    }, []);

    const handleSave = async (wardenData) => {
        const method = currentWarden ? 'PUT' : 'POST';
        const url = currentWarden ? `${API_URL}/${currentWarden.warden_id}` : API_URL;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(wardenData)
            });
            if (!response.ok) throw new Error('Failed to save warden');
            fetchWardens();
            handleCloseModal();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (wardenId) => {
        if (window.confirm('Are you sure you want to delete this warden?')) {
            try {
                const response = await fetch(`${API_URL}/${wardenId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete warden');
                fetchWardens();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleOpenModal = (warden = null) => {
        setCurrentWarden(warden);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCurrentWarden(null);
        setIsModalOpen(false);
    };

    if (isLoading) return <div className="text-center p-8">Loading wardens...</div>;
    if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Warden Management</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                >
                    + Add New Warden
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">ID</th>
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">Email</th>
                            <th className="py-3 px-6 text-left">Phone</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {wardens.map(warden => (
                            <tr key={warden.warden_id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left">{warden.warden_id}</td>
                                <td className="py-3 px-6 text-left font-semibold">{warden.first_name} {warden.last_name}</td>
                                <td className="py-3 px-6 text-left">{warden.email}</td>
                                <td className="py-3 px-6 text-left">{warden.phone || 'N/A'}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center space-x-2">
                                        <button onClick={() => handleOpenModal(warden)} className="w-8 h-8 text-blue-600 hover:text-blue-900">
                                            {/* Edit Icon */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button onClick={() => handleDelete(warden.warden_id)} className="w-8 h-8 text-red-600 hover:text-red-900">
                                            {/* Delete Icon */}
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && <WardenModal warden={currentWarden} onClose={handleCloseModal} onSave={handleSave} />}
        </div>
    );
};

export default WardenManagement;
