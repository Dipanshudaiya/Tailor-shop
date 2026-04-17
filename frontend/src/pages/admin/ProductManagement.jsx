import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { HiPlus, HiPencil, HiTrash, HiOutlinePhotograph } from 'react-icons/hi';
import productService from '../../services/productService';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { toast } from 'react-hot-toast';

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [activeTab, setActiveTab] = useState('all');

    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: 'men',
        subCategory: '',
        brand: '',
        image: '',
        description: '',
        discount: 0
    });

    const tabs = [
        { id: 'all', label: 'All Products' },
        { id: 'men', label: 'Men' },
        { id: 'women', label: 'Women' },
        { id: 'sarees', label: 'Sarees' },
        { id: 'fabrics', label: 'Fabrics' },
        { id: 'discounted', label: 'Discounted' },
    ];

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const data = await productService.getProducts();
            setProducts(data);
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData(product);
        setIsModalOpen(true);
    };

    const filteredProducts = products.filter(p => {
        if (activeTab === 'all') return true;
        if (activeTab === 'discounted') return p.discount > 0;
        return p.category === activeTab;
    });

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productService.deleteProduct(id);
                toast.success('Product deleted');
                fetchProducts();
            } catch (error) {
                toast.error(error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Ensure data types are correct
        const submitData = {
            ...formData,
            price: Number(formData.price),
            discount: Number(formData.discount || 0)
        };

        if (isNaN(submitData.price)) {
            toast.error('Please enter a valid price');
            return;
        }

        try {
            setLoading(true);
            if (editingProduct) {
                await productService.updateProduct(editingProduct._id, submitData);
                toast.success('Product updated successfully!');
            } else {
                await productService.createProduct(submitData);
                toast.success('Product created successfully!');
            }
            setIsModalOpen(false);
            fetchProducts();
            resetForm();
        } catch (error) {
            console.error('Submit Error:', error);
            toast.error(typeof error === 'string' ? error : 'Failed to save product');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            price: '',
            category: 'men',
            subCategory: '',
            brand: '',
            image: '',
            description: '',
            discount: 0
        });
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 pb-24 space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-dark-card border border-white/5 p-8 rounded-[2rem]">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white">Product <span className="text-primary italic">Management</span></h1>
                    <p className="text-slate-500 text-sm">Create and organize your catalog.</p>
                </div>
                <Button onClick={() => { resetForm(); setIsModalOpen(true); }}>
                    <HiPlus className="mr-2" /> Add New Product
                </Button>
            </header>

            {/* Tabs */}
            <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-2.5 rounded-xl border text-sm font-bold transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="bg-dark-card border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                <table className="w-full text-left">
                    <thead className="bg-white/3 text-slate-500 font-bold text-[10px] uppercase tracking-widest border-b border-white/5">
                        <tr>
                            <th className="p-6">Product</th>
                            <th className="p-6">Category</th>
                            <th className="p-6">Price</th>
                            <th className="p-6">Discount</th>
                            <th className="p-6 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {filteredProducts.map(p => (
                            <tr key={p._id} className="hover:bg-white/3 transition-colors group">
                                <td className="p-6">
                                    <div className="flex items-center gap-4">
                                        <img src={p.image} className="w-12 h-12 rounded-lg object-cover border border-white/10" />
                                        <div>
                                            <p className="font-bold text-white group-hover:text-primary transition-colors">{p.name}</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{p.brand || 'No Brand'}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-6 text-slate-400 capitalize text-sm">{p.category} / {p.subCategory}</td>
                                <td className="p-6 text-primary font-bold">₹{p.price}</td>
                                <td className="p-6 text-accent font-bold">{p.discount || 0}%</td>
                                <td className="p-6">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(p)} className="p-3 bg-white/5 text-slate-400 hover:text-white hover:bg-primary transition-all rounded-xl border border-white/5"><HiPencil size={18} /></button>
                                        <button onClick={() => handleDelete(p._id)} className="p-3 bg-white/5 text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all rounded-xl border border-white/5"><HiTrash size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {loading && <div className="p-20 text-center text-slate-500">Loading products...</div>}
                {!loading && products.length === 0 && <div className="p-20 text-center text-slate-500">No products found.</div>}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'Edit Product' : 'Add New Product'} maxWidth="max-w-2xl">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                    <Input label="Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    <Input label="Price (₹)" type="number" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-slate-400 pl-1">Category</label>
                        <select 
                            value={formData.category} 
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary text-white"
                        >
                            <option value="men">Men</option>
                            <option value="women">Women</option>
                            <option value="sarees">Sarees</option>
                            <option value="fabrics">Fabrics</option>
                        </select>
                    </div>
                    <Input label="Sub Category" value={formData.subCategory} onChange={(e) => setFormData({...formData, subCategory: e.target.value})} placeholder="Shirt, Saree, etc." required />
                    <Input label="Brand" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})} placeholder="Only for Fabrics" />
                    <Input label="Discount (%)" type="number" value={formData.discount} onChange={(e) => setFormData({...formData, discount: e.target.value})} placeholder="e.g. 10" />
                    <Input label="Image URL" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} icon={HiOutlinePhotograph} required />
                    <div className="md:col-span-2 space-y-1.5">
                        <label className="block text-sm font-medium text-slate-400 pl-1">Description</label>
                        <textarea 
                            value={formData.description} 
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary text-white resize-none"
                            rows={3} 
                        />
                    </div>
                    <Button type="submit" className="md:col-span-2 py-4">{editingProduct ? 'Update Product' : 'Create Product'}</Button>
                </form>
            </Modal>
        </motion.div>
    );
};

export default ProductManagement;
