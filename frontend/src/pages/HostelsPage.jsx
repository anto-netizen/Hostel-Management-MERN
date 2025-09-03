import React, { useState, useEffect } from 'react';
import hostelService from '../services/hostelService'; // Correct service import

const HostelsPage = () => {
  const [hostels, setHostels] = useState([]);
  const [currentHostel, setCurrentHostel] = useState(null); // Manages form state (null = hidden)
  const [isEditing, setIsEditing] = useState(false);

  // Fetch all hostels when the component mounts
  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    try {
      const response = await hostelService.getAll();
      setHostels(response.data);
    } catch (error) {
      console.error('Failed to fetch hostels:', error);
      // Optionally, set an error state to show a message to the user
    }
  };

  // Handles changes in the form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentHostel({ ...currentHostel, [name]: value });
  };

  // Handles form submission for both create and update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        // Use hostelId for the update operation
        await hostelService.update(currentHostel.hostelId, currentHostel);
      } else {
        await hostelService.create(currentHostel);
      }
      closeForm();
      fetchHostels(); // Refresh the list after submission
    } catch (error) {
      console.error('Failed to save hostel:', error);
    }
  };
  
  // Opens the form modal for creating a new hostel
  const openCreateForm = () => {
    setIsEditing(false);
    // Initialize the form with empty fields
    setCurrentHostel({ hostelName: '', location: '', capacity: '' });
  };
  
  // Opens the form modal for editing an existing hostel
  const openEditForm = (hostel) => {
    setIsEditing(true);
    setCurrentHostel(hostel);
  };
  
  // Closes the form modal
  const closeForm = () => {
    setCurrentHostel(null);
  };

  // Handles the deletion of a hostel
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this hostel? This action cannot be undone.')) {
      try {
        await hostelService.remove(id);
        fetchHostels(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete hostel:', error);
      }
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Hostels</h1>
        <button 
          onClick={openCreateForm} 
          className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-200 shadow-sm"
        >
          Add New Hostel
        </button>
      </div>

      {/* Modal Form Overlay */}
      {currentHostel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-6">{isEditing ? 'Edit Hostel' : 'Add New Hostel'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Hostel Name</label>
                <input name="hostelName" value={currentHostel.hostelName} onChange={handleInputChange} placeholder="e.g., North Block A" required className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Location</label>
                <input name="location" value={currentHostel.location} onChange={handleInputChange} placeholder="e.g., Campus Main Area" className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Capacity</label>
                <input name="capacity" type="number" value={currentHostel.capacity} onChange={handleInputChange} placeholder="e.g., 200" required className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"/>
              </div>
              <div className="flex space-x-2 justify-end pt-4">
                <button type="button" onClick={closeForm} className="px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition duration-200">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-200">
                  {isEditing ? 'Update Hostel' : 'Create Hostel'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hostels Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-left text-gray-600 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 font-semibold text-left text-gray-600 uppercase tracking-wider">Hostel Name</th>
              <th className="px-4 py-3 font-semibold text-left text-gray-600 uppercase tracking-wider">Location</th>
              <th className="px-4 py-3 font-semibold text-left text-gray-600 uppercase tracking-wider">Capacity</th>
              <th className="px-4 py-3 font-semibold text-left text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {hostels.map((hostel) => (
              <tr key={hostel.hostelId}>
                <td className="px-4 py-4 text-gray-900">{hostel.hostelId}</td>
                <td className="px-4 py-4 font-medium text-gray-900">{hostel.hostelName}</td>
                <td className="px-4 py-4 text-gray-500">{hostel.location}</td>
                <td className="px-4 py-4 text-gray-500">{hostel.capacity}</td>
                <td className="px-4 py-4">
                  <div className="flex space-x-2">
                    <button onClick={() => openEditForm(hostel)} className="px-3 py-1 text-xs font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600">Edit</button>
                    <button onClick={() => handleDelete(hostel.hostelId)} className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HostelsPage;
