import React, { useState, useEffect } from 'react';
import studentService from '../services/studentService'; // Ensure this path is correct

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [currentStudent, setCurrentStudent] = useState(null); // null when no form, object when editing/creating
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await studentService.getAll();
      setStudents(response.data);
    } catch (error) {
      console.error('Failed to fetch students:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentStudent({ ...currentStudent, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await studentService.update(currentStudent.studentId, currentStudent);
      } else {
        await studentService.create(currentStudent);
      }
      closeForm();
      fetchStudents();
    } catch (error) {
      console.error('Failed to save student:', error);
    }
  };

  const openCreateForm = () => {
    setIsEditing(false);
    setCurrentStudent({ name: '', contact: '', address: '' });
  };
  
  const openEditForm = (student) => {
    setIsEditing(true);
    setCurrentStudent(student);
  };
  
  const closeForm = () => {
    setCurrentStudent(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentService.remove(id);
        fetchStudents();
      } catch (error) {
        console.error('Failed to delete student:', error);
      }
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Students</h1>
        <button onClick={openCreateForm} className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-200">
          Add Student
        </button>
      </div>

      {/* Modal Form */}
      {currentStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">{isEditing ? 'Edit Student' : 'Add New Student'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input name="name" value={currentStudent.name} onChange={handleInputChange} placeholder="Full Name" required className="w-full p-2 border rounded-md"/>
              <input name="contact" value={currentStudent.contact} onChange={handleInputChange} placeholder="Contact Number" className="w-full p-2 border rounded-md"/>
              <input name="address" value={currentStudent.address} onChange={handleInputChange} placeholder="Address" className="w-full p-2 border rounded-md"/>
              <div className="flex space-x-2 justify-end">
                <button type="button" onClick={closeForm} className="px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600">
                  {isEditing ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Students Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-left text-gray-600 uppercase tracking-wider">ID</th>
              <th className="px-4 py-3 font-semibold text-left text-gray-600 uppercase tracking-wider">Name</th>
              <th className="px-4 py-3 font-semibold text-left text-gray-600 uppercase tracking-wider">Contact</th>
              <th className="px-4 py-3 font-semibold text-left text-gray-600 uppercase tracking-wider">Address</th>
              <th className="px-4 py-3 font-semibold text-left text-gray-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.map((student) => (
              <tr key={student.studentId}>
                <td className="px-4 py-4 text-gray-900">{student.studentId}</td>
                <td className="px-4 py-4 font-medium text-gray-900">{student.name}</td>
                <td className="px-4 py-4 text-gray-500">{student.contact}</td>
                <td className="px-4 py-4 text-gray-500">{student.address}</td>
                <td className="px-4 py-4">
                  <div className="flex space-x-2">
                    <button onClick={() => openEditForm(student)} className="px-3 py-1 text-xs font-medium text-white bg-yellow-500 rounded hover:bg-yellow-600">Edit</button>
                    <button onClick={() => handleDelete(student.studentId)} className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700">Delete</button>
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

export default StudentsPage;
