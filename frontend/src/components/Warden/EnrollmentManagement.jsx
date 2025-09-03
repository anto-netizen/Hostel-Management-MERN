import React, { useState, useEffect } from 'react';

// Modal for the enrollment form
const EnrollmentModal = ({ prerequisites, onClose, onSave }) => {
    const [studentId, setStudentId] = useState('');
    const [roomId, setRoomId] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!studentId || !roomId) {
            alert('Please select a student and a room.');
            return;
        }
        onSave({
            student_id: studentId,
            room_id: roomId,
            session_id: prerequisites.activeSession.session_id,
        });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Enroll New Student</h2>
                <p className="mb-4 text-gray-600">Session: <span className="font-semibold">{prerequisites.activeSession.session_name}</span></p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Select Student</label>
                        <select value={studentId} onChange={(e) => setStudentId(e.target.value)} required className="shadow border rounded w-full py-2 px-3">
                            <option value="">-- Choose a student --</option>
                            {prerequisites.availableStudents.map(s => (
                                <option key={s.student_id} value={s.student_id}>{s.first_name} {s.last_name} ({s.student_reg_no})</option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Select Available Room</label>
                        <select value={roomId} onChange={(e) => setRoomId(e.target.value)} required className="shadow border rounded w-full py-2 px-3">
                            <option value="">-- Choose a room --</option>
                            {prerequisites.availableRooms.map(r => (
                                <option key={r.room_id} value={r.room_id}>{r.room_number}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                        <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Enroll Student</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// Main Component
const EnrollmentManagement = () => {
    const loggedInWardenId = 1; // This would come from auth context

    const [enrollments, setEnrollments] = useState([]);
    const [prerequisites, setPrerequisites] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const API_URL = `http://localhost:5000/api/enrollments`;

    const fetchEnrollments = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/warden/${loggedInWardenId}`);
            if (!response.ok) throw new Error('Failed to fetch enrollments');
            const data = await response.json();
            setEnrollments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEnrollments();
    }, [loggedInWardenId]);

    const handleOpenModal = async () => {
        try {
            const response = await fetch(`${API_URL}/prerequisites/${loggedInWardenId}`);
            if (!response.ok) throw new Error('Could not load data for enrollment form.');
            const data = await response.json();
            setPrerequisites(data);
            setIsModalOpen(true);
        } catch (err) {
            setError(err.message);
        }
    };
    
    const handleSave = async (enrollmentData) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(enrollmentData)
            });
            if (!response.ok) throw new Error('Failed to enroll student');
            fetchEnrollments(); // Refresh the list
            setIsModalOpen(false);
            setPrerequisites(null);
        } catch (err) {
            setError(err.message);
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading enrollments...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Student Enrollment</h1>
                <button
                    onClick={handleOpenModal}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                >
                    + Enroll New Student
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                            <th className="py-3 px-6 text-left">Reg. No.</th>
                            <th className="py-3 px-6 text-left">Student Name</th>
                            <th className="py-3 px-6 text-left">Room</th>
                            <th className="py-3 px-6 text-left">Room Type</th>
                            <th className="py-3 px-6 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {enrollments.map(e => (
                            <tr key={e.enrollment_id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 font-semibold">{e.Student.student_reg_no}</td>
                                <td className="py-3 px-6">{e.Student.first_name} {e.Student.last_name}</td>
                                <td className="py-3 px-6">{e.HostelRoom.room_number}</td>
                                <td className="py-3 px-6">{e.HostelRoom.RoomType.type_name}</td>
                                <td className="py-3 px-6 text-center">
                                    <span className="bg-green-200 text-green-800 py-1 px-3 rounded-full text-xs">{e.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && prerequisites && <EnrollmentModal prerequisites={prerequisites} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
        </div>
    );
};

export default EnrollmentManagement;
