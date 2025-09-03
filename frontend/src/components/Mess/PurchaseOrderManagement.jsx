import React, { useState, useEffect, useMemo } from 'react';

// This is a complex modal for creating a PO
const CreatePOModal = ({ suppliers, items, onClose, onSave }) => {
    const [supplierId, setSupplierId] = useState('');
    const [lineItems, setLineItems] = useState([{ item_id: '', quantity: '', price: '' }]);
    
    const handleItemChange = (index, field, value) => {
        const updatedItems = [...lineItems];
        updatedItems[index][field] = value;
        setLineItems(updatedItems);
    };

    const addLineItem = () => setLineItems([...lineItems, { item_id: '', quantity: '', price: '' }]);
    const removeLineItem = (index) => setLineItems(lineItems.filter((_, i) => i !== index));
    
    const totalAmount = useMemo(() => {
        return lineItems.reduce((sum, item) => sum + (Number(item.quantity) * Number(item.price)), 0);
    }, [lineItems]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ supplier_id: supplierId, items: lineItems });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl">
                <h2 className="text-2xl font-bold mb-4">Create Purchase Order</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Supplier</label>
                        <select value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required className="shadow border rounded w-full py-2 px-3">
                            <option value="">-- Select Supplier --</option>
                            {suppliers.map(s => <option key={s.supplier_id} value={s.supplier_id}>{s.supplier_name}</option>)}
                        </select>
                    </div>
                    
                    {/* Line Items */}
                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-2">Items</h3>
                        {lineItems.map((lineItem, index) => (
                            <div key={index} className="grid grid-cols-10 gap-2 mb-2 items-center">
                                <select value={lineItem.item_id} onChange={(e) => handleItemChange(index, 'item_id', e.target.value)} required className="col-span-4 shadow border rounded py-1 px-2">
                                    <option value="">-- Select Item --</option>
                                    {items.map(i => <option key={i.item_id} value={i.item_id}>{i.item_name}</option>)}
                                </select>
                                <input type="number" placeholder="Qty" value={lineItem.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} required className="col-span-2 shadow border rounded py-1 px-2" />
                                <input type="number" step="0.01" placeholder="Price/Unit" value={lineItem.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} required className="col-span-2 shadow border rounded py-1 px-2" />
                                <div className="col-span-2 flex justify-end">
                                    {lineItems.length > 1 && <button type="button" onClick={() => removeLineItem(index)} className="text-red-500 font-bold">Remove</button>}
                                </div>
                            </div>
                        ))}
                        <button type="button" onClick={addLineItem} className="text-sm text-blue-600 hover:text-blue-800 mt-2">+ Add Another Item</button>
                    </div>

                    <div className="border-t mt-4 pt-4 flex justify-between items-center">
                        <div className="text-xl font-bold">Total: ${totalAmount.toFixed(2)}</div>
                        <div className="flex space-x-2">
                            <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create PO</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};


const PurchaseOrderManagement = () => {
    const [pos, setPOs] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const API_URL = 'http://localhost:5000/api';

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [poRes, supRes, itemRes] = await Promise.all([
                fetch(`${API_URL}/pos`), fetch(`${API_URL}/suppliers`), fetch(`${API_URL}/items`)
            ]);
            if (!poRes.ok || !supRes.ok || !itemRes.ok) throw new Error('Failed to fetch data');
            setPOs(await poRes.json());
            setSuppliers(await supRes.json());
            setItems(await itemRes.json());
        } catch (err) { setError(err.message); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSavePO = async (poData) => {
        try {
            const response = await fetch(`${API_URL}/pos`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(poData)
            });
            if (!response.ok) throw new Error('Failed to create PO');
            fetchData();
            setIsModalOpen(false);
        } catch (err) { setError(err.message); }
    };

    if (isLoading) return <div className="p-8 text-center">Loading Purchase Orders...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Purchase Order Management</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                >
                    + Create New PO
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                            <th className="py-3 px-6 text-left">PO ID</th>
                            <th className="py-3 px-6 text-left">Supplier</th>
                            <th className="py-3 px-6 text-left">Order Date</th>
                            <th className="py-3 px-6 text-right">Total Amount</th>
                            <th className="py-3 px-6 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {pos.map(po => (
                            <tr key={po.po_id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 font-semibold">PO-{po.po_id}</td>
                                <td className="py-3 px-6">{po.Supplier.supplier_name}</td>
                                <td className="py-3 px-6">{new Date(po.order_date).toLocaleDateString()}</td>
                                <td className="py-3 px-6 text-right">${parseFloat(po.total_amount).toFixed(2)}</td>
                                <td className="py-3 px-6 text-center">{po.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <CreatePOModal suppliers={suppliers} items={items} onClose={() => setIsModalOpen(false)} onSave={handleSavePO} />}
        </div>
    );
};

export default PurchaseOrderManagement;
