import React, { useState, useEffect } from 'react';

const ItemModal = ({ item, categories, uoms, onClose, onSave }) => {
    const [formData, setFormData] = useState({ item_name: '', category_id: '', uom_id: '' });

    useEffect(() => {
        if (item) setFormData(item);
    }, [item]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{item ? 'Edit Item' : 'Add New Item'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Item Name</label>
                        <input type="text" name="item_name" value={formData.item_name} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3" />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Category</label>
                        <select name="category_id" value={formData.category_id} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3">
                            <option value="">-- Select a Category --</option>
                            {categories.map(cat => <option key={cat.category_id} value={cat.category_id}>{cat.category_name}</option>)}
                        </select>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-bold mb-2">Unit of Measurement</label>
                        <select name="uom_id" value={formData.uom_id} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3">
                            <option value="">-- Select a Unit --</option>
                            {uoms.map(uom => <option key={uom.uom_id} value={uom.uom_id}>{uom.uom_name} ({uom.uom_short_name})</option>)}
                        </select>
                    </div>
                    <div className="flex items-center justify-end space-x-2">
                        <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ItemManagement = () => {
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [uoms, setUoms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const API_URL = 'http://localhost:5000/api';

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [itemRes, catRes, uomRes] = await Promise.all([
                fetch(`${API_URL}/items`),
                fetch(`${API_URL}/itemcategories`),
                fetch(`${API_URL}/uoms`)
            ]);
            if (!itemRes.ok || !catRes.ok || !uomRes.ok) throw new Error('Failed to fetch initial data');
            const itemData = await itemRes.json();
            const catData = await catRes.json();
            const uomData = await uomRes.json();
            setItems(itemData);
            setCategories(catData);
            setUoms(uomData);
        } catch (err) { setError(err.message); } 
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSave = async (itemData) => {
        const method = currentItem ? 'PUT' : 'POST';
        const url = currentItem ? `${API_URL}/items/${currentItem.item_id}` : `${API_URL}/items`;
        try {
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(itemData) });
            if (!response.ok) throw new Error('Failed to save item');
            fetchData(); // Refetch all data to keep lists consistent
            handleCloseModal();
        } catch (err) { setError(err.message); }
    };
    
    const handleDelete = async (itemId) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                const response = await fetch(`${API_URL}/items/${itemId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete item');
                fetchData();
            } catch (err) { setError(err.message); }
        }
    };

    const handleOpenModal = (item = null) => {
        setCurrentItem(item);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    if (isLoading) return <div className="p-8 text-center">Loading items...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Item Master List</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                >
                    + Add New Item
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                            <th className="py-3 px-6 text-left">Item Name</th>
                            <th className="py-3 px-6 text-left">Category</th>
                            <th className="py-3 px-6 text-left">Unit</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {items.map(item => (
                            <tr key={item.item_id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 font-semibold">{item.item_name}</td>
                                <td className="py-3 px-6">{item.ItemCategory.category_name}</td>
                                <td className="py-3 px-6">{item.UOM.uom_short_name}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center space-x-2">
                                        <button onClick={() => handleOpenModal(item)} className="w-8 h-8 text-blue-600 hover:text-blue-900">{/* Edit Icon */}</button>
                                        <button onClick={() => handleDelete(item.item_id)} className="w-8 h-8 text-red-600 hover:text-red-900">{/* Delete Icon */}</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <ItemModal item={currentItem} categories={categories} uoms={uoms} onClose={handleCloseModal} onSave={handleSave} />}
        </div>
    );
};

export default ItemManagement;
