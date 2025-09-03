import React, { useState, useEffect } from 'react';
import roomService from '../services/roomService'; // Change the service import

// This component structure is IDENTICAL to StudentsPage.
// Just change variable names and form fields.

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const response = await roomService.getAll();
    setRooms(response.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentRoom({ ...currentRoom, [name]: value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isEditing) {
      await roomService.update(currentRoom.id, currentRoom); // Use the correct ID field, e.g., roomId
    } else {
      await roomService.create(currentRoom);
    }
    closeForm();
    fetchRooms();
  };

  const openCreateForm = () => {
    setIsEditing(false);
    setCurrentRoom({ roomNumber: '', capacity: '', status: 'available' }); // Adjust fields
  };
  
  const openEditForm = (room) => {
    setIsEditing(true);
    setCurrentRoom(room);
  };
  
  const closeForm = () => {
    setCurrentRoom(null);
  };
  
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      await roomService.remove(id);
      fetchRooms();
    }
  };

  return (
    // JSX is very similar to StudentsPage.
    // Just change the title, button texts, form fields, and table headers/columns.
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Rooms</h1>
      {/* ... Add button, modal form, and table here, adapting fields for rooms ... */}
    </div>
  );
};

export default RoomsPage;
