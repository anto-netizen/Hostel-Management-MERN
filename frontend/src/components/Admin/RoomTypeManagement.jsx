import React, { useState, useEffect } from 'react';

// Reusable Modal for the form
const RoomTypeModal = ({ roomType, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        type_name: '',
        capacity: '',
        price: ''
    });

    useEffect(() => {
        if (roomType) {
            setFormData({
                type_name: roomType.type_name || '',
                capacity: roomType.capacity || '',
                price: roomType.price || ''
            });
        }
    }, [roomType]);

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
                <h2 className="text-2xl font-bold mb-4">{roomType ? 'Edit Room Type' : 'Add New Room Type'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type_name">Type Name</label>
                        <input type="text" name="type_name" value={formData.type_name} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="capacity">Capacity (persons)</label>
                        <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">Price (per semester)</label>
                        <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
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
const RoomTypeManagement = () => {
    const [roomTypes, setRoomTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRoomType, setCurrentRoomType] = useState(null);

    const API_URL = 'http://localhost:5000/api/roomtypes';

    const fetchRoomTypes = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            setRoomTypes(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRoomTypes();
    }, []);

    const handleSave = async (roomTypeData) => {
        const method = currentRoomType ? 'PUT' : 'POST';
        const url = currentRoomType ? `${API_URL}/${currentRoomType.room_type_id}` : API_URL;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(roomTypeData)
            });
            if (!response.ok) throw new Error('Failed to save room type');
            fetchRoomTypes();
            handleCloseModal();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (roomTypeId) => {
        if (window.confirm('Are you sure you want to delete this room type?')) {
            try {
                const response = await fetch(`${API_URL}/${roomTypeId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete room type');
                fetchRoomTypes();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleOpenModal = (roomType = null) => {
        setCurrentRoomType(roomType);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCurrentRoomType(null);
        setIsModalOpen(false);
    };

    if (isLoading) return <div className="text-center p-8">Loading room types...</div>;
    if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Room Type Management</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                >
                    + Add New Room Type
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                            <th className="py-3 px-6 text-left">Type Name</th>
                            <th className="py-3 px-6 text-center">Capacity</th>
                            <th className="py-3 px-6 text-right">Price</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {roomTypes.map(rt => (
                            <tr key={rt.room_type_id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left font-semibold">{rt.type_name}</td>
                                <td className="py-3 px-6 text-center">{rt.capacity}</td>
                                <td className="py-3 px-6 text-right">${parseFloat(rt.price).toFixed(2)}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center space-x-2">
                                        <button onClick={() => handleOpenModal(rt)} className="w-8 h-8 text-blue-600 hover:text-blue-900">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                        </button>
                                        <button onClick={() => handleDelete(rt.room_type_id)} className="w-8 h-8 text-red-600 hover:text-red-900">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && <RoomTypeModal roomType={currentRoomType} onClose={handleCloseModal} onSave={handleSave} />}
        </div>
    );
};

export default RoomTypeManagement;
