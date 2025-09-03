import React, { useState, useEffect } from 'react';

// Modal for receiving items against a selected PO
const ReceiveStockModal = ({ po, onClose, onSave }) => {
    // Initialize state with quantities from the PO, but allow edits
    const [receivedItems, setReceivedItems] = useState([]);

    useEffect(() => {
        if (po && po.PurchaseOrderItems) {
            setReceivedItems(po.PurchaseOrderItems.map(item => ({
                item_id: item.item_id,
                item_name: item.Item.item_name,
                ordered_quantity: item.quantity,
                quantity_purchased: item.quantity // Default to ordered quantity
            })));
        }
    }, [po]);
    
    const handleQuantityChange = (index, value) => {
        const updatedItems = [...receivedItems];
        updatedItems[index].quantity_purchased = value;
        setReceivedItems(updatedItems);
    };

    const handleSubmit = () => {
        const itemsToSave = receivedItems.map(({ item_id, quantity_purchased }) => ({ item_id, quantity_purchased }));
        onSave({
            po_id: po.po_id,
            supplier_id: po.supplier_id,
            items: itemsToSave
        });
    };

    if (!po) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-2">Receive Stock for PO-{po.po_id}</h2>
                <p className="text-gray-600 mb-4">Supplier: {po.Supplier.supplier_name}</p>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                    {receivedItems.map((item, index) => (
                        <div key={item.item_id} className="grid grid-cols-3 gap-4 items-center">
                            <span className="font-semibold">{item.item_name}</span>
                            <span>Ordered: {item.ordered_quantity}</span>
                            <div>
                                <label className="text-sm mr-2">Received:</label>
                                <input 
                                    type="number" 
                                    value={item.quantity_purchased}
                                    onChange={(e) => handleQuantityChange(index, e.target.value)}
                                    className="shadow-inner border rounded py-1 px-2 w-24"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-end space-x-2 mt-6">
                    <button onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                    <button onClick={handleSubmit} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Confirm & Update Stock</button>
                </div>
            </div>
        </div>
    );
};

const StockInward = () => {
    const [pendingPOs, setPendingPOs] = useState([]);
    const [selectedPO, setSelectedPO] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:5000/api';

    const fetchPendingPOs = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/stock/pending-pos`);
            if (!response.ok) throw new Error('Failed to fetch pending POs');
            setPendingPOs(await response.json());
        } catch (err) { setError(err.message); } 
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchPendingPOs(); }, []);

    const handleOpenModal = async (poId) => {
        // Fetch full PO details to get line items
        try {
            const response = await fetch(`${API_URL}/pos/${poId}`);
            if (!response.ok) throw new Error('Could not fetch PO details');
            setSelectedPO(await response.json());
        } catch (err) { setError(err.message); }
    };

    const handleReceiveStock = async (stockData) => {
        try {
            const response = await fetch(`${API_URL}/stock/receive`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(stockData)
            });
            if (!response.ok) throw new Error('Failed to update stock');
            setSelectedPO(null); // Close modal
            fetchPendingPOs(); // Refresh the list
        } catch (err) { setError(err.message); }
    };
    
    if (isLoading) return <div className="p-8 text-center">Loading...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Stock Inward (Goods Received)</h1>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <h2 className="text-xl p-4 font-semibold border-b">Pending Purchase Orders</h2>
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm">
                            <th className="py-3 px-6 text-left">PO ID</th>
                            <th className="py-3 px-6 text-left">Supplier</th>
                            <th className="py-3 px-6 text-left">Order Date</th>
                            <th className="py-3 px-6 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {pendingPOs.length > 0 ? pendingPOs.map(po => (
                            <tr key={po.po_id} className="border-b border-gray-200 hover:bg-gray-50">
                                <td className="py-3 px-6 font-semibold">PO-{po.po_id}</td>
                                <td className="py-3 px-6">{po.Supplier.supplier_name}</td>
                                <td className="py-3 px-6">{new Date(po.order_date).toLocaleDateString()}</td>
                                <td className="py-3 px-6 text-center">
                                    <button
                                        onClick={() => handleOpenModal(po.po_id)}
                                        className="bg-green-500 hover:bg-green-700 text-white text-xs font-bold py-1 px-3 rounded"
                                    >
                                        Receive Stock
                                    </button>
                                </td>
                            </tr>
                        )) : (
                            <tr><td colSpan="4" className="text-center py-4 text-gray-500">No pending purchase orders.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {selectedPO && <ReceiveStockModal po={selectedPO} onClose={() => setSelectedPO(null)} onSave={handleReceiveStock} />}
        </div>
    );
};

export default StockInward;
