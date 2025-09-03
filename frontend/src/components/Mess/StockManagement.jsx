import React, { useState, useEffect, useMemo } from 'react';

const StockManagement = () => {
    const [stockLevels, setStockLevels] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const API_URL = 'http://localhost:5000/api/stock/current';

    useEffect(() => {
        const fetchStock = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) throw new Error('Failed to fetch stock levels');
                const data = await response.json();
                setStockLevels(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStock();
    }, []);

    // Memoized filtering for performance
    const filteredStock = useMemo(() => {
        if (!searchTerm) return stockLevels;
        return stockLevels.filter(item => 
            item.Item.item_name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [stockLevels, searchTerm]);
    
    if (isLoading) return <div className="p-8 text-center">Loading inventory...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">Current Stock Inventory</h1>
                <div className="w-full sm:w-auto">
                    <input 
                        type="text"
                        placeholder="Search for an item..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                            <th className="py-3 px-6 text-left">Item Name</th>
                            <th className="py-3 px-6 text-left">Category</th>
                            <th className="py-3 px-6 text-right">Quantity in Stock</th>
                            <th className="py-3 px-6 text-left">Unit</th>
                            <th className="py-3 px-6 text-left">Last Updated</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {filteredStock.length > 0 ? filteredStock.map(stockItem => (
                            <tr key={stockItem.stock_id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-6 font-semibold">{stockItem.Item.item_name}</td>
                                <td className="py-3 px-6">{stockItem.Item.ItemCategory.category_name}</td>
                                <td className="py-3 px-6 text-right font-bold text-lg">{parseFloat(stockItem.quantity).toFixed(2)}</td>
                                <td className="py-3 px-6">{stockItem.Item.UOM.uom_short_name}</td>
                                <td className="py-3 px-6">{new Date(stockItem.last_updated).toLocaleString()}</td>
                            </tr>
                        )) : (
                             <tr><td colSpan="5" className="text-center py-4 text-gray-500">No items found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StockManagement;
