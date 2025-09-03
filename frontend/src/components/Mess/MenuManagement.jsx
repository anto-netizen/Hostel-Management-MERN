import React, { useState, useEffect } from 'react';

// Modal for creating/editing a menu
const MenuModal = ({ menu, allItems, onClose, onSave }) => {
    const [menuName, setMenuName] = useState('');
    const [description, setDescription] = useState('');
    const [lineItems, setLineItems] = useState([{ item_id: '', quantity: '' }]);

    const handleItemChange = (index, field, value) => {
        const updated = [...lineItems];
        updated[index][field] = value;
        setLineItems(updated);
    };

    const addLineItem = () => setLineItems([...lineItems, { item_id: '', quantity: '' }]);
    const removeLineItem = (index) => setLineItems(lineItems.filter((_, i) => i !== index));

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ menu_name: menuName, description, items: lineItems });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">{menu ? 'Edit Menu' : 'Create New Menu'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input type="text" placeholder="Menu Name (e.g., Standard Lunch)" value={menuName} onChange={e => setMenuName(e.target.value)} required className="shadow border rounded py-2 px-3" />
                        <input type="text" placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} className="shadow border rounded py-2 px-3" />
                    </div>
                    
                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-2">Ingredients per Serving</h3>
                        {lineItems.map((line, index) => (
                            <div key={index} className="grid grid-cols-10 gap-2 mb-2 items-center">
                                <select value={line.item_id} onChange={e => handleItemChange(index, 'item_id', e.target.value)} required className="col-span-6 shadow border rounded py-1 px-2">
                                    <option value="">-- Select Item --</option>
                                    {allItems.map(i => <option key={i.item_id} value={i.item_id}>{i.item_name} ({i.UOM.uom_short_name})</option>)}
                                </select>
                                <input type="number" step="0.001" placeholder="Quantity" value={line.quantity} onChange={e => handleItemChange(index, 'quantity', e.target.value)} required className="col-span-3 shadow border rounded py-1 px-2" />
                                {lineItems.length > 1 && <button type="button" onClick={() => removeLineItem(index)} className="col-span-1 text-red-500 font-bold">X</button>}
                            </div>
                        ))}
                        <button type="button" onClick={addLineItem} className="text-sm text-blue-600 hover:text-blue-800 mt-2">+ Add Ingredient</button>
                    </div>

                    <div className="flex justify-end space-x-2 mt-6">
                        <button type="button" onClick={onClose} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded">Cancel</button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save Menu</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const MenuManagement = () => {
    const [menus, setMenus] = useState([]);
    const [allItems, setAllItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const API_URL = 'http://localhost:5000/api';

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [menuRes, itemRes] = await Promise.all([ fetch(`${API_URL}/menus`), fetch(`${API_URL}/items`) ]);
            if (!menuRes.ok || !itemRes.ok) throw new Error('Failed to fetch data');
            setMenus(await menuRes.json());
            setAllItems(await itemRes.json());
        } catch (err) { setError(err.message); }
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchData(); }, []);
    
    const handleSave = async (menuData) => {
        try {
            const response = await fetch(`${API_URL}/menus`, {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(menuData)
            });
            if (!response.ok) throw new Error('Failed to save menu');
            fetchData();
            setIsModalOpen(false);
        } catch (err) { alert(`Error: ${err.message}`); }
    };

    if (isLoading) return <div className="p-8 text-center">Loading menus...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Mess Menu Management</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                >
                    + Create New Menu
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {menus.map(menu => (
                    <div key={menu.menu_id} className="bg-white shadow-md rounded-lg p-4">
                        <h2 className="text-xl font-bold mb-2">{menu.menu_name}</h2>
                        <p className="text-gray-600 text-sm mb-4">{menu.description}</p>
                        <div className="border-t pt-2">
                            <h3 className="text-sm font-semibold text-gray-700 mb-1">Ingredients:</h3>
                            <ul className="list-disc list-inside text-sm space-y-1">
                                {menu.MenuItems.map(mi => (
                                    <li key={mi.menu_item_id}>
                                        {mi.Item.item_name}: {parseFloat(mi.quantity)} {mi.Item.UOM.uom_short_name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
            {isModalOpen && <MenuModal allItems={allItems} onClose={() => setIsModalOpen(false)} onSave={handleSave} />}
        </div>
    );
};

export default MenuManagement;


