import React, { useState, useEffect } from 'react';

const ViewMessBills = () => {
    const loggedInStudentId = 1; // From auth context

    const [bills, setBills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBills = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/api/mess-bills/student/${loggedInStudentId}`);
                if (!response.ok) throw new Error('Failed to fetch your mess bills');
                setBills(await response.json());
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchBills();
    }, [loggedInStudentId]);

    const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    if (isLoading) return <div className="p-8 text-center">Loading your bill history...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">My Mess Bill History</h1>
                
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                                <th className="py-3 px-6 text-left">Period</th>
                                <th className="py-3 px-6 text-right">Total Meals</th>
                                <th className="py-3 px-6 text-right">Rate per Meal</th>
                                <th className="py-3 px-6 text-right">Total Amount</th>
                                <th className="py-3 px-6 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {bills.length > 0 ? bills.map(bill => (
                                <tr key={bill.bill_id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-4 px-6 font-semibold">
                                        {monthNames[bill.month]} {bill.year}
                                    </td>
                                    <td className="py-4 px-6 text-right">{bill.total_diets}</td>
                                    <td className="py-4 px-6 text-right">${parseFloat(bill.diet_rate).toFixed(2)}</td>
                                    <td className="py-4 px-6 text-right font-bold text-base">${parseFloat(bill.amount).toFixed(2)}</td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            bill.status === 'Paid' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                                        }`}>
                                            {bill.status}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-10 text-gray-500">
                                        You have no mess bills yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ViewMessBills;
