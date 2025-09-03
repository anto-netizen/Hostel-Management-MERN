import React, { useState, useEffect } from 'react';

const MenuScheduleManagement = () => {
    const [schedule, setSchedule] = useState({});
    const [allMenus, setAllMenus] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:5000/api';
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const MEALS = ['Breakfast', 'Lunch', 'Dinner'];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [scheduleRes, menuRes] = await Promise.all([
                fetch(`${API_URL}/schedule`),
                fetch(`${API_URL}/menus`)
            ]);
            if (!scheduleRes.ok || !menuRes.ok) throw new Error('Failed to fetch data');
            
            const scheduleData = await scheduleRes.json();
            const menusData = await menuRes.json();
            setAllMenus(menusData);

            // Convert array from API into a 2D object for easy table rendering
            const scheduleObject = {};
            scheduleData.forEach(item => {
                if (!scheduleObject[item.day_of_week]) {
                    scheduleObject[item.day_of_week] = {};
                }
                scheduleObject[item.day_of_week][item.meal_type] = item.menu_id;
            });
            setSchedule(scheduleObject);

        } catch (err) { setError(err.message); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleScheduleChange = (day, meal, menuId) => {
        setSchedule(prev => ({
            ...prev,
            [day]: {
                ...prev[day],
                [meal]: menuId ? parseInt(menuId) : null
            }
        }));
    };

    const handleSaveSchedule = async () => {
        // Convert the 2D object back into an array for the API
        const schedulePayload = [];
        for (const day of DAYS) {
            for (const meal of MEALS) {
                if (schedule[day] && schedule[day][meal]) {
                    schedulePayload.push({
                        day_of_week: day,
                        meal_type: meal,
                        menu_id: schedule[day][meal]
                    });
                }
            }
        }
        
        try {
            const response = await fetch(`${API_URL}/schedule`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(schedulePayload)
            });
            if (!response.ok) throw new Error('Failed to save schedule');
            alert('Schedule saved successfully!');
            fetchData(); // Refresh data
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };
    
    if (isLoading) return <div className="p-8 text-center">Loading schedule...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Weekly Menu Schedule</h1>
                <button
                    onClick={handleSaveSchedule}
                    className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                >
                    Save Schedule
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                            <th className="py-3 px-6 text-left">Day</th>
                            {MEALS.map(meal => <th key={meal} className="py-3 px-6 text-center">{meal}</th>)}
                        </tr>
                    </thead>
                    <tbody className="text-gray-700 text-sm">
                        {DAYS.map(day => (
                            <tr key={day} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-6 font-semibold">{day}</td>
                                {MEALS.map(meal => (
                                    <td key={meal} className="py-3 px-6 text-center">
                                        <select
                                            value={schedule[day]?.[meal] || ''}
                                            onChange={(e) => handleScheduleChange(day, meal, e.target.value)}
                                            className="w-full border rounded p-2"
                                        >
                                            <option value="">-- Unassigned --</option>
                                            {allMenus.map(menu => (
                                                <option key={menu.menu_id} value={menu.menu_id}>{menu.menu_name}</option>
                                            ))}
                                        </select>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MenuScheduleManagement;
