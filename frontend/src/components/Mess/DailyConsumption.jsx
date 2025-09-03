import React, { useState, useEffect } from 'react';

const DailyConsumption = () => {
    const [allItems, setAllItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Form state
    const [consumptionDate, setConsumptionDate] = useState(new Date().toISOString().slice(0, 10));
    const [mealType, setMealType] = useState('Breakfast');
    const [lineItems, setLineItems] = useState([{ item_id: '', quantity: '' }]);

    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_URL}/items`);
                if (!response.ok) throw new Error('Failed to fetch items');
                setAllItems(await response.json());
            } catch (err) { setError(err.message); } 
            finally { setIsLoading(false); }
        };
        fetchItems();
    }, []);

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...lineItems];
        updatedItems[index][field] = value;
        setLineItems(updatedItems);
    };

    const addLineItem = () => setLineItems([...lineItems, { item_id: '', quantity: '' }]);
    const removeLineItem = (index) => setLineItems(lineItems.filter((_, i) => i !== index));
    
    const resetForm = () => {
        setLineItems([{ item_id: '', quantity: '' }]);
        // Optional: Keep date and meal type for next entry
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            date: consumptionDate,
            meal_type: mealType,
            items: lineItems.filter(item => item.item_id && item.quantity) // Filter out empty lines
        };
        
        if (payload.items.length === 0) {
            alert('Please add at least one item to record.');
            return;
        }

        try {
            const response = await fetch(`${API_URL}/consumption`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Failed to record consumption');
            
            alert('Consumption recorded successfully!');
            resetForm();
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Record Daily Consumption</h1>
            <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 border-b pb-6">
                        <div>
                            <label className="block text-sm font-bold mb-2">Consumption Date</label>
                            <input type="date" value={consumptionDate} onChange={(e) => setConsumptionDate(e.target.value)} required className="shadow border rounded w-full py-2 px-3"/>
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Meal Type</label>
                            <select value={mealType} onChange={(e) => setMealType(e.target.value)} required className="shadow border rounded w-full py-2 px-3">
                                <option>Breakfast</option>
                                <option>Lunch</option>
                                <option>Dinner</option>
                                <option>Other</option>
                            </select>
                        </div>
                    </div>
                    
                    <h3 className="font-semibold mb-2 text-lg">Consumed Items</h3>
                    <div className="space-y-3">
                        {lineItems.map((lineItem, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-center">
                                <div className="col-span-6">
                                    <select value={lineItem.item_id} onChange={(e) => handleItemChange(index, 'item_id', e.target.value)} required className="w-full shadow-sm border rounded py-2 px-2">
                                        <option value="">-- Select Item --</option>
                                        {allItems.map(i => <option key={i.item_id} value={i.item_id}>{i.item_name} ({i.UOM.uom_short_name})</option>)}
                                    </select>
                                </div>
                                <div className="col-span-4">
                                    <input type="number" step="0.01" placeholder="Quantity" value={lineItem.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} required className="w-full shadow-sm border rounded py-2 px-2" />
                                </div>
                                <div className="col-span-2 flex justify-end">
                                    {lineItems.length > 1 && <button type="button" onClick={() => removeLineItem(index)} className="text-red-500 hover:text-red-700 font-bold">Remove</button>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button type="button" onClick={addLineItem} className="text-sm text-blue-600 hover:text-blue-800 mt-4">+ Add Another Item</button>

                    <div className="flex justify-end mt-8 border-t pt-6">
                        <button type="submit" className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-6 rounded-lg shadow-md">
                            Record Consumption
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DailyConsumption;
