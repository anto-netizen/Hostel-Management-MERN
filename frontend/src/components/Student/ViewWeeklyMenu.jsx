import React, { useState, useEffect } from 'react';

const ViewWeeklyMenu = () => {
    const [schedule, setSchedule] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:5000/api/schedule';
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const MEALS = ['Breakfast', 'Lunch', 'Dinner'];

    useEffect(() => {
        const fetchSchedule = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Failed to fetch the weekly menu');
                const scheduleData = await response.json();

                // Transform the flat array from the API into a nested object for easy table rendering.
                // This is the same logic used on the Mess Manager's schedule screen.
                const scheduleObject = {};
                scheduleData.forEach(item => {
                    if (!scheduleObject[item.day_of_week]) {
                        scheduleObject[item.day_of_week] = {};
                    }
                    scheduleObject[item.day_of_week][item.meal_type] = item.Menu.menu_name;
                });
                setSchedule(scheduleObject);
                
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchSchedule();
    }, []);

    if (isLoading) return <div className="p-8 text-center">Loading weekly menu...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Weekly Mess Menu</h1>

                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                                <th className="py-3 px-6 text-left">Day</th>
                                <th className="py-3 px-6 text-center">Breakfast</th>
                                <th className="py-3 px-6 text-center">Lunch</th>
                                <th className="py-3 px-6 text-center">Dinner</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-700 text-sm">
                            {DAYS.map(day => (
                                <tr key={day} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-4 px-6 font-semibold">{day}</td>
                                    {MEALS.map(meal => (
                                        <td key={meal} className="py-4 px-6 text-center">
                                            {schedule[day]?.[meal] || <span className="text-gray-400 italic">Not Set</span>}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViewWeeklyMenu;
