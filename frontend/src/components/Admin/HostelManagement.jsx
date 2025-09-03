// src/components/Admin/HostelManagement.js
import React, { useState, useEffect } from 'react';

// Reusable Modal Component for Add/Edit Form
// We now pass the list of wardens into the modal
const HostelModal = ({ hostel, wardens, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        hostel_name: '',
        address: '',
        warden_id: ''
    });

    useEffect(() => {
        if (hostel) {
            setFormData({
                hostel_name: hostel.hostel_name || '',
                address: hostel.address || '',
                warden_id: hostel.warden_id || '' // Can be null
            });
        }
    }, [hostel]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert empty string from dropdown to null for the database
        const dataToSave = {
            ...formData,
            warden_id: formData.warden_id ? parseInt(formData.warden_id) : null
        };
        onSave(dataToSave);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{hostel ? 'Edit Hostel' : 'Add New Hostel'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="hostel_name">Hostel Name</label>
                        <input type="text" name="hostel_name" value={formData.hostel_name} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" required />
                    </div>
                    <div className="mb-6">
                        {/* THE NEW DROPDOWN */}
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="warden_id">Assign Warden</label>
                        <select
                            name="warden_id"
                            id="warden_id"
                            value={formData.warden_id}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        >
                            <option value="">-- Unassigned --</option>
                            {wardens.map(warden => (
                                <option key={warden.warden_id} value={warden.warden_id}>
                                    {warden.first_name} {warden.last_name}
                                </option>
                            ))}
                        </select>
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

// Main Component
const HostelManagement = () => {
    const [hostels, setHostels] = useState([]);
    const [wardens, setWardens] = useState([]); // <-- STATE FOR WARDENS
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentHostel, setCurrentHostel] = useState(null);

    const HOSTEL_API_URL = 'http://localhost:5000/api/hostels';
    const WARDEN_API_URL = 'http://localhost:5000/api/wardens';

    // Fetch all data (hostels and wardens)
    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [hostelRes, wardenRes] = await Promise.all([
                fetch(HOSTEL_API_URL),
                fetch(WARDEN_API_URL)
            ]);
            if (!hostelRes.ok || !wardenRes.ok) throw new Error('Failed to fetch data');
            const hostelData = await hostelRes.json();
            const wardenData = await wardenRes.json();
            setHostels(hostelData);
            setWardens(wardenData);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSave = async (hostelData) => {
        const method = currentHostel ? 'PUT' : 'POST';
        const url = currentHostel ? `${HOSTEL_API_URL}/${currentHostel.hostel_id}` : HOSTEL_API_URL;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(hostelData)
            });
            if (!response.ok) throw new Error('Failed to save hostel');
            fetchData(); // Refresh all data
            handleCloseModal();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (hostelId) => {
        if (window.confirm('Are you sure you want to delete this hostel?')) {
            try {
                const response = await fetch(`${HOSTEL_API_URL}/${hostelId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete hostel');
                fetchData(); // Refresh all data
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleOpenModal = (hostel = null) => {
        setCurrentHostel(hostel);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCurrentHostel(null);
        setIsModalOpen(false);
    };
    
    // ... UI rendering part below ...
    if (isLoading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Hostel Management</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
                >
                    + Add New Hostel
                </button>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-3 px-6 text-left">Name</th>
                            <th className="py-3 px-6 text-left">Address</th>
                            <th className="py-3 px-6 text-left">Assigned Warden</th> {/* <-- NEW COLUMN */}
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {hostels.map(hostel => (
                            <tr key={hostel.hostel_id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left font-semibold">{hostel.hostel_name}</td>
                                <td className="py-3 px-6 text-left">{hostel.address}</td>
                                <td className="py-3 px-6 text-left">
                                    {/* <-- DISPLAY WARDEN NAME --> */}
                                    {hostel.Warden ? `${hostel.Warden.first_name} ${hostel.Warden.last_name}` : <span className="text-gray-400 italic">Unassigned</span>}
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center space-x-2">
                                        <button onClick={() => handleOpenModal(hostel)} className="w-8 h-8 text-blue-600 hover:text-blue-900">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button onClick={() => handleDelete(hostel.hostel_id)} className="w-8 h-8 text-red-600 hover:text-red-900">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && <HostelModal hostel={currentHostel} wardens={wardens} onClose={handleCloseModal} onSave={handleSave} />}
        </div>
    );
};

export default HostelManagement;
