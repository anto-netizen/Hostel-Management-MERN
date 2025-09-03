import React, { useState, useEffect, useMemo } from 'react';

const MessAttendance = () => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Form State
    const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().slice(0, 10));
    const [mealType, setMealType] = useState('Breakfast');
    const [presentStudents, setPresentStudents] = useState(new Set());

    const API_URL = 'http://localhost:5000/api/attendance';

    useEffect(() => {
        const fetchStudents = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/eligible-students`);
                if (!response.ok) throw new Error('Failed to fetch students');
                setStudents(await response.json());
            } catch (err) { setError(err.message); } 
            finally { setIsLoading(false); }
        };
        fetchStudents();
    }, []);

    const handleTogglePresence = (studentId) => {
        const newSet = new Set(presentStudents);
        if (newSet.has(studentId)) {
            newSet.delete(studentId);
        } else {
            newSet.add(studentId);
        }
        setPresentStudents(newSet);
    };

    const handleSaveAttendance = async () => {
        const payload = {
            date: attendanceDate,
            meal_type: mealType,
            present_student_ids: Array.from(presentStudents)
        };
        
        if (payload.present_student_ids.length === 0) {
            if (!window.confirm('You have not marked any students as present. Do you want to continue?')) return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to save attendance');
            alert(result.message);
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };
    
    const filteredStudents = useMemo(() => {
        if (!searchTerm) return students;
        return students.filter(s =>
            s.Student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.Student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.Student.student_reg_no.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [students, searchTerm]);

    if (isLoading) return <div className="p-8 text-center">Loading student list...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Mess Attendance</h1>
            
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-bold mb-1">Date</label>
                        <input type="date" value={attendanceDate} onChange={e => setAttendanceDate(e.target.value)} className="shadow border rounded w-full py-2 px-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Meal</label>
                        <select value={mealType} onChange={e => setMealType(e.target.value)} className="shadow border rounded w-full py-2 px-3">
                            <option>Breakfast</option>
                            <option>Lunch</option>
                            <option>Dinner</option>
                        </select>
                    </div>
                    <button
                        onClick={handleSaveAttendance}
                        className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-md h-10"
                    >
                        Save Attendance ({presentStudents.size} marked)
                    </button>
                </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
                <input
                    type="text"
                    placeholder="Search by name or registration no..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="shadow border rounded w-full py-2 px-3 mb-4"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredStudents.map(enrollment => {
                        const student = enrollment.Student;
                        const isPresent = presentStudents.has(student.student_id);
                        return (
                            <div
                                key={student.student_id}
                                onClick={() => handleTogglePresence(student.student_id)}
                                className={`p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                                    isPresent
                                        ? 'bg-green-500 text-white shadow-lg transform scale-105'
                                        : 'bg-gray-100 hover:bg-gray-200'
                                }`}
                            >
                                <p className="font-semibold">{student.first_name} {student.last_name}</p>
                                <p className="text-xs">{student.student_reg_no}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MessAttendance;
