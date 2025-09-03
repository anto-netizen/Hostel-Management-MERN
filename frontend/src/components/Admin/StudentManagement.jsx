import React, { useState, useEffect } from 'react';
import { LucideEdit, LucideTrash2 } from 'lucide-react';

// Modal component for adding/editing StudentAdmission records
const StudentAdmissionModal = ({ student, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        student_reg_no: '',
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        address: ''
    });

    useEffect(() => {
        if (student) {
            setFormData(student);
        } else {
            setFormData({
                student_reg_no: '',
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                address: ''
            });
        }
    }, [student]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg transform transition-all duration-300 scale-95 md:scale-100">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    {student ? 'Edit Student' : 'Add New Student'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Registration No.
                            </label>
                            <input
                                type="text"
                                name="student_reg_no"
                                value={formData.student_reg_no}
                                onChange={handleChange}
                                required
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Phone
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                            />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Address
                        </label>
                        <textarea
                            name="address"
                            value={formData.address || ''}
                            onChange={handleChange}
                            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                            rows="2"
                        ></textarea>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition duration-150 transform hover:scale-105"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg transition duration-150 transform hover:scale-105"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Main component for managing StudentAdmission records
const StudentAdmissionManagement = () => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentStudent, setCurrentStudent] = useState(null);

    const API_URL = 'http://localhost:5000/api/studentsAdmission';

    const fetchStudents = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch data');
            const data = await response.json();
            setStudents(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleSave = async (studentData) => {
        const method = currentStudent ? 'PUT' : 'POST';
        const url = currentStudent ? `${API_URL}/${currentStudent.student_id}` : API_URL;

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });
            if (!response.ok) throw new Error('Failed to save student');
            fetchStudents();
            handleCloseModal();
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (studentId) => {
        if (confirm('Are you sure you want to delete this student?')) {
            try {
                const response = await fetch(`${API_URL}/${studentId}`, {
                    method: 'DELETE'
                });
                if (!response.ok) throw new Error('Failed to delete student');
                fetchStudents();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleOpenModal = (student = null) => {
        setCurrentStudent(student);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-100">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center p-8 text-red-500 bg-red-100 rounded-lg shadow-md">Error: {error}</div>;
    }

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-4 sm:mb-0">Student Admission Data</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                    + Add New Student
                </button>
            </div>
            <div className="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm font-semibold">
                                <th className="py-4 px-6 text-left">Reg. No.</th>
                                <th className="py-4 px-6 text-left">Name</th>
                                <th className="py-4 px-6 text-left">Email</th>
                                <th className="py-4 px-6 text-left hidden sm:table-cell">Phone</th>
                                <th className="py-4 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm font-light">
                            {students.length > 0 ? (
                                students.map((student) => (
                                    <tr key={student.student_id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                                        <td className="py-3 px-6 font-medium">{student.student_reg_no}</td>
                                        <td className="py-3 px-6">{student.first_name} {student.last_name}</td>
                                        <td className="py-3 px-6">{student.email}</td>
                                        <td className="py-3 px-6 hidden sm:table-cell">{student.phone || 'N/A'}</td>
                                        <td className="py-3 px-6 text-center">
                                            <div className="flex items-center justify-center space-x-2">
                                                <button
                                                    onClick={() => handleOpenModal(student)}
                                                    className="text-blue-600 hover:text-blue-800 transition-colors duration-200 transform hover:scale-110"
                                                    aria-label="Edit student"
                                                >
                                                    <LucideEdit size={20} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(student.student_id)}
                                                    className="text-red-600 hover:text-red-800 transition-colors duration-200 transform hover:scale-110"
                                                    aria-label="Delete student"
                                                >
                                                    <LucideTrash2 size={20} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-8 text-gray-500">No students found. Add a new student to get started.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && (
                <StudentAdmissionModal
                    student={currentStudent}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                />
            )}
        </div>
    );
};

export default StudentAdmissionManagement;
