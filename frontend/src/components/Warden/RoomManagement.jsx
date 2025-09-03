import React, { useState, useEffect } from 'react';

// Reusable Modal for the Room form
const RoomModal = ({ room, roomTypes, hostelId, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        room_number: '',
        room_type_id: '',
        status: 'Available',
        hostel_id: hostelId
    });

    useEffect(() => {
        if (room) {
            setFormData({
                room_number: room.room_number || '',
                room_type_id: room.room_type_id || '',
                status: room.status || 'Available',
                hostel_id: hostelId
            });
        }
    }, [room, hostelId]);

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
                <h2 className="text-2xl font-bold mb-4">{room ? 'Edit Room' : 'Add New Room'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Room Number</label>
                        <input type="text" name="room_number" value={formData.room_number} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Room Type</label>
                        <select name="room_type_id" value={formData.room_type_id} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3">
                            <option value="">-- Select a Type --</option>
                            {roomTypes.map(rt => (
                                <option key={rt.room_type_id} value={rt.room_type_id}>{rt.type_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3">
                            <option value="Available">Available</option>
                            <option value="Occupied">Occupied</option>
                            <option value="Under Maintenance">Under Maintenance</option>
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
const WardenRoomManagement = () => {
    // In a real app, this would come from user authentication (e.g., a login context)
    const loggedInWardenId = 1; 

    const [hostelInfo, setHostelInfo] = useState(null);
    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(null);
    
    const API_BASE_URL = 'http://localhost:5000/api';

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch both room data for the warden and all available room types
            const [roomsResponse, roomTypesResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/rooms/warden/${loggedInWardenId}`),
                fetch(`${API_BASE_URL}/roomtypes`)
            ]);

            if (!roomsResponse.ok || !roomTypesResponse.ok) throw new Error('Failed to fetch initial data');
            
            const roomsData = await roomsResponse.json();
            const roomTypesData = await roomTypesResponse.json();
            
            setHostelInfo(roomsData.hostel);
            setRooms(roomsData.rooms);
            setRoomTypes(roomTypesData);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [loggedInWardenId]);

    const handleSave = async (roomData) => {
        const method = currentRoom ? 'PUT' : 'POST';
        const url = currentRoom ? `${API_BASE_URL}/rooms/${currentRoom.room_id}` : `${API_BASE_URL}/rooms`;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(roomData)
            });
            if (!response.ok) throw new Error('Failed to save room');
            fetchData();
            handleCloseModal();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (roomId) => {
        if (window.confirm('Are you sure you want to delete this room? This cannot be undone.')) {
            try {
                const response = await fetch(`${API_BASE_URL}/rooms/${roomId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete room');
                fetchData();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleOpenModal = (room = null) => {
        setCurrentRoom(room);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setCurrentRoom(null);
        setIsModalOpen(false);
    };

    if (isLoading) return <div className="text-center p-8">Loading Room Data...</div>;
    if (error) return <div className="text-center p-8 text-red-500">Error: {error}</div>;
    if (!hostelInfo) return <div className="text-center p-8 text-orange-500">This warden is not assigned to a hostel.</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Room Management</h1>
                    <p className="text-lg text-gray-600">Hostel: {hostelInfo.hostel_name}</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                >
                    + Add New Room
                </button>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                            <th className="py-3 px-6 text-left">Room #</th>
                            <th className="py-3 px-6 text-left">Type</th>
                            <th className="py-3 px-6 text-center">Capacity</th>
                            <th className="py-3 px-6 text-left">Status</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {rooms.map(room => (
                            <tr key={room.room_id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 text-left font-semibold">{room.room_number}</td>
                                <td className="py-3 px-6 text-left">{room.RoomType.type_name}</td>
                                <td className="py-3 px-6 text-center">{room.RoomType.capacity}</td>
                                <td className="py-3 px-6 text-left">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                        room.status === 'Available' ? 'bg-green-200 text-green-800' :
                                        room.status === 'Occupied' ? 'bg-red-200 text-red-800' :
                                        'bg-yellow-200 text-yellow-800'
                                    }`}>
                                        {room.status}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center space-x-2">
                                        <button onClick={() => handleOpenModal(room)} className="w-8 h-8 text-blue-600 hover:text-blue-900">
                                            {/* ... edit icon svg ... */}
                                        </button>
                                        <button onClick={() => handleDelete(room.room_id)} className="w-8 h-8 text-red-600 hover:text-red-900">
                                            {/* ... delete icon svg ... */}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && <RoomModal room={currentRoom} roomTypes={roomTypes} hostelId={hostelInfo.hostel_id} onClose={handleCloseModal} onSave={handleSave} />}
        </div>
    );
};

export default WardenRoomManagement;
