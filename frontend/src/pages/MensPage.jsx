import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import productService from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import ProductGrid from '../components/product/ProductGrid';
import Loader from '../components/common/Loader';
import Button from '../components/ui/Button';
import ConsultationModal from '../components/common/ConsultationModal';

const MensPage = () => {
    const { category } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState(50000);
    const [type, setType] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');
    const [isConsultationOpen, setIsConsultationOpen] = useState(false);

    useEffect(() => {
        if (category) {
            const formattedType = category.charAt(0).toUpperCase() + category.slice(1);
            setType(formattedType);
        } else {
            setType('All');
        }
    }, [category]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await productService.getProducts({ category: 'men' });
                setProducts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const filteredProducts = [...products].filter(p => {
        const matchesPrice = p.price <= priceRange;
        const searchType = type.toLowerCase();
        const matchesType = type === 'All' || 
            (p.subCategory && p.subCategory.toLowerCase() === searchType) ||
            p.name.toLowerCase().includes(searchType) ||
            (p.description && p.description.toLowerCase().includes(searchType));
        return matchesPrice && matchesType;
    }).sort((a, b) => {
        if (sortBy === 'Lowest Price') return a.price - b.price;
        if (sortBy === 'Highest Price') return b.price - a.price;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0); // Newest
    });

    if (loading) return <Loader />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-24">
            <header className="bg-white/3 pt-32 pb-16">
                <div className="container mx-auto px-4 text-center space-y-4">
                    <span className="text-primary font-bold tracking-[0.4em] uppercase text-xs">
                        Bespoke Collection
                    </span>
                    <h1 className="text-5xl md:text-6xl font-display font-bold capitalize">
                        Men's <span className="text-primary">Wear</span>
                    </h1>
                    <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
                </div>
            </header>

            <div className="container mx-auto px-4 py-20">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Filters Sidebar */}
                    <div className="w-full lg:w-72 space-y-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-white font-bold">
                                <span>FILTERS</span>
                            </div>
                            
                            {/* Price Filter */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span className="text-slate-400 font-bold">PRICE RANGE</span>
                                    <span className="text-primary">Under ₹{priceRange}</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1000" 
                                    max="50000" 
                                    step="500"
                                    value={priceRange}
                                    onChange={(e) => setPriceRange(e.target.value)}
                                    className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                            </div>

                            {/* Type Filter */}
                            <div className="space-y-4">
                                <span className="text-sm text-slate-400 font-bold uppercase">CATEGORY TYPE</span>
                                <div className="space-y-2">
                                    {['All', 'Shirt', 'Pant', 'Coat', 'Jacket', 'Suit', 'Sherwani'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => {
                                                setType(t);
                                                navigate(t === 'All' ? '/mens' : `/mens/${t.toLowerCase()}`);
                                            }}
                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${type === t ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl space-y-4">
                            <h4 className="font-bold text-white tracking-tight">Custom Stitching?</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">Book a consultation for perfectly fitted bespoke suits.</p>
                            <Button variant="accent" size="sm" className="w-full" onClick={() => setIsConsultationOpen(true)}>Book Custom Fitting</Button>
                        </div>
                    </div>

                    {/* Results Grid */}
                    <div className="flex-grow space-y-8">
                        <div className="flex justify-between items-center pb-6 border-b border-white/5">
                            <p className="text-slate-400 text-sm">Showing <span className="text-white font-bold">{filteredProducts.length}</span> stunning designs</p>
                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                <span>Sort by:</span>
                                <select 
                                    value={sortBy} 
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="bg-transparent text-white font-bold outline-none cursor-pointer p-1"
                                >
                                    <option className="bg-dark text-white" value="Newest">Newest</option>
                                    <option className="bg-dark text-white" value="Lowest Price">Lowest Price</option>
                                    <option className="bg-dark text-white" value="Highest Price">Highest Price</option>
                                </select>
                            </div>
                        </div>

                        {filteredProducts.length > 0 ? (
                            <ProductGrid>
                                {filteredProducts.map(p => <ProductCard key={p._id} product={p} />)}
                            </ProductGrid>
                        ) : (
                            <div className="text-center py-20 space-y-4">
                                <p className="text-slate-400 text-xl font-display">No men's wear found for these filters.</p>
                                <Button variant="outline" onClick={() => { setPriceRange(50000); setSortBy('Newest'); }}>Reset Filters</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} type="fitting" category="men" />
        </motion.div>
    );
};

export default MensPage;
