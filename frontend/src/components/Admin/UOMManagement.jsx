import React, { useState, useEffect } from 'react';

const UOMModal = ({ uom, onClose, onSave }) => {
    const [formData, setFormData] = useState({ uom_name: '', uom_short_name: '' });

    useEffect(() => {
        if (uom) {
            setFormData({
                uom_name: uom.uom_name || '',
                uom_short_name: uom.uom_short_name || ''
            });
        }
    }, [uom]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{uom ? 'Edit Unit' : 'Add New Unit'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Unit Name (e.g., Kilogram)</label>
                        <input type="text" name="uom_name" value={formData.uom_name} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3" />
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-bold mb-2">Short Name (e.g., Kg)</label>
                        <input type="text" name="uom_short_name" value={formData.uom_short_name} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3" />
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


const UOMManagement = () => {
    const [uoms, setUoms] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentUOM, setCurrentUOM] = useState(null);

    const API_URL = 'http://localhost:5000/api/uoms';

    const fetchUOMs = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch UOMs');
            const data = await response.json();
            setUoms(data);
        } catch (err) { setError(err.message); } 
        finally { setIsLoading(false); }
    };

    useEffect(() => { fetchUOMs(); }, []);

    const handleSave = async (uomData) => {
        const method = currentUOM ? 'PUT' : 'POST';
        const url = currentUOM ? `${API_URL}/${currentUOM.uom_id}` : API_URL;
        try {
            const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(uomData) });
            if (!response.ok) throw new Error('Failed to save UOM');
            fetchUOMs();
            handleCloseModal();
        } catch (err) { setError(err.message); }
    };

    const handleDelete = async (uomId) => {
        if (window.confirm('Are you sure? Deleting a UOM may affect existing items.')) {
            try {
                await fetch(`${API_URL}/${uomId}`, { method: 'DELETE' });
                fetchUOMs();
            } catch (err) { setError(err.message); }
        }
    };

    const handleOpenModal = (uom = null) => {
        setCurrentUOM(uom);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => setIsModalOpen(false);

    if (isLoading) return <div className="p-8 text-center">Loading units...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Unit of Measurement</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                >
                    + Add New Unit
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                            <th className="py-3 px-6 text-left">Unit Name</th>
                            <th className="py-3 px-6 text-left">Short Name</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {uoms.map(uom => (
                            <tr key={uom.uom_id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 font-semibold">{uom.uom_name}</td>
                                <td className="py-3 px-6">{uom.uom_short_name}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center space-x-2">
                                        <button onClick={() => handleOpenModal(uom)} className="w-8 h-8 text-blue-600 hover:text-blue-900">{/* Edit Icon */}</button>
                                        <button onClick={() => handleDelete(uom.uom_id)} className="w-8 h-8 text-red-600 hover:text-red-900">{/* Delete Icon */}</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <UOMModal uom={currentUOM} onClose={handleCloseModal} onSave={handleSave} />}
        </div>
    );
};

export default UOMManagement;
