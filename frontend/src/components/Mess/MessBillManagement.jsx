import React, { useState, useEffect } from 'react';

const MessBillManagement = () => {
    const [bills, setBills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);

    // Default to the previous month for generation
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const [year, setYear] = useState(lastMonth.getFullYear());
    const [month, setMonth] = useState(lastMonth.getMonth() + 1); // 1-12

    const API_URL = 'http://localhost:5000/api/mess-bills';

    const fetchBills = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch bills');
            setBills(await response.json());
        } catch (err) { setError(err.message); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchBills(); }, []);

    const handleGenerate = async () => {
        if (!window.confirm(`Generate mess bills for ${month}/${year}? This will overwrite existing bills for this period.`)) return;

        setIsGenerating(true);
        setError(null);
        try {
            const response = await fetch(`${API_URL}/generate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ month: parseInt(month), year: parseInt(year) })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Bill generation failed');
            alert(result.message);
            fetchBills(); // Refresh the list
        } catch (err) { setError(err.message); }
        finally { setIsGenerating(false); }
    };

    const monthNames = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Mess Bill Management</h1>
            
            <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                <h2 className="text-xl font-semibold mb-3">Generate Monthly Bills</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-sm font-bold mb-1">Year</label>
                        <input type="number" value={year} onChange={e => setYear(e.target.value)} className="shadow border rounded w-full py-2 px-3" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-1">Month</label>
                        <select value={month} onChange={e => setMonth(e.target.value)} className="shadow border rounded w-full py-2 px-3">
                            {monthNames.map((name, index) => index > 0 && <option key={index} value={index}>{name}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded-lg shadow-md h-10 disabled:bg-gray-400"
                    >
                        {isGenerating ? 'Generating...' : 'Generate Bills'}
                    </button>
                </div>
                {error && <p className="text-red-500 mt-2">{error}</p>}
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <h2 className="text-xl p-4 font-semibold border-b">Generated Bills</h2>
                {isLoading ? <p className="p-4">Loading bills...</p> : (
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                                <th className="py-3 px-6 text-left">Period</th>
                                <th className="py-3 px-6 text-left">Student</th>
                                <th className="py-3 px-6 text-right">Total Diets</th>
                                <th className="py-3 px-6 text-right">Amount</th>
                                <th className="py-3 px-6 text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {bills.map(bill => (
                                <tr key={bill.bill_id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-6 font-semibold">{monthNames[bill.month]} {bill.year}</td>
                                    <td className="py-3 px-6">{bill.Student.first_name} {bill.Student.last_name} ({bill.Student.student_reg_no})</td>
                                    <td className="py-3 px-6 text-right">{bill.total_diets}</td>
                                    <td className="py-3 px-6 text-right font-bold">${parseFloat(bill.amount).toFixed(2)}</td>
                                    <td className="py-3 px-6 text-center">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bill.status === 'Paid' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>
                                            {bill.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default MessBillManagement;
