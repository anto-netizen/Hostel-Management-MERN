import React, { useState, useEffect } from 'react';

const SupplierModal = ({ supplier, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        supplier_name: '',
        contact_person: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        if (supplier) {
            setFormData({
                supplier_name: supplier.supplier_name || '',
                contact_person: supplier.contact_person || '',
                phone: supplier.phone || '',
                email: supplier.email || ''
            });
        }
    }, [supplier]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">{supplier ? 'Edit Supplier' : 'Add New Supplier'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-bold mb-2">Supplier Name</label>
                        <input type="text" name="supplier_name" value={formData.supplier_name} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Contact Person</label>
                            <input type="text" name="contact_person" value={formData.contact_person} onChange={handleChange} className="shadow border rounded w-full py-2 px-3" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-bold mb-2">Phone</label>
                            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3" />
                        </div>
                    </div>
                    <div className="mb-6">
                        <label className="block text-sm font-bold mb-2">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="shadow border rounded w-full py-2 px-3" />
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


const SupplierManagement = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState(null);

    const API_URL = 'http://localhost:5000/api/suppliers';

    const fetchSuppliers = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(API_URL);
            if (!response.ok) throw new Error('Failed to fetch suppliers');
            const data = await response.json();
            setSuppliers(data);
        } catch (err) { setError(err.message); } 
        finally { setIsLoading(false); }
    };

    useEffect(() => {
        fetchSuppliers();
    }, []);

    const handleSave = async (supplierData) => {
        const method = currentSupplier ? 'PUT' : 'POST';
        const url = currentSupplier ? `${API_URL}/${currentSupplier.supplier_id}` : API_URL;

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(supplierData)
            });
            if (!response.ok) throw new Error('Failed to save supplier');
            fetchSuppliers();
            handleCloseModal();
        } catch (err) { setError(err.message); }
    };

    const handleDelete = async (supplierId) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            try {
                const response = await fetch(`${API_URL}/${supplierId}`, { method: 'DELETE' });
                if (!response.ok) throw new Error('Failed to delete supplier');
                fetchSuppliers();
            } catch (err) { setError(err.message); }
        }
    };

    const handleOpenModal = (supplier = null) => {
        setCurrentSupplier(supplier);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => setIsModalOpen(false);

    if (isLoading) return <div className="p-8 text-center">Loading suppliers...</div>;
    if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Supplier Management</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md"
                >
                    + Add New Supplier
                </button>
            </div>
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr className="bg-gray-200 text-gray-600 uppercase text-sm">
                            <th className="py-3 px-6 text-left">Supplier Name</th>
                            <th className="py-3 px-6 text-left">Contact Person</th>
                            <th className="py-3 px-6 text-left">Phone</th>
                            <th className="py-3 px-6 text-left">Email</th>
                            <th className="py-3 px-6 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                        {suppliers.map(supplier => (
                            <tr key={supplier.supplier_id} className="border-b border-gray-200 hover:bg-gray-100">
                                <td className="py-3 px-6 font-semibold">{supplier.supplier_name}</td>
                                <td className="py-3 px-6">{supplier.contact_person || 'N/A'}</td>
                                <td className="py-3 px-6">{supplier.phone}</td>
                                <td className="py-3 px-6">{supplier.email || 'N/A'}</td>
                                <td className="py-3 px-6 text-center">
                                    <div className="flex item-center justify-center space-x-2">
                                        <button onClick={() => handleOpenModal(supplier)} className="w-8 h-8 text-blue-600 hover:text-blue-900">
                                            {/* Edit Icon */}
                                        </button>
                                        <button onClick={() => handleDelete(supplier.supplier_id)} className="w-8 h-8 text-red-600 hover:text-red-900">
                                            {/* Delete Icon */}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {isModalOpen && <SupplierModal supplier={currentSupplier} onClose={handleCloseModal} onSave={handleSave} />}
        </div>
    );
};

export default SupplierManagement;
