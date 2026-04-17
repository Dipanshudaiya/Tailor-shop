import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import productService from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import ProductGrid from '../components/product/ProductGrid';
import Loader from '../components/common/Loader';
import { HiOutlineFilter } from 'react-icons/hi';
import Button from '../components/ui/Button';
import ConsultationModal from '../components/common/ConsultationModal';

const FabricsPage = () => {
    const { type: urlType } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState(50000);
    const [type, setType] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');
    const [selectedBrand, setSelectedBrand] = useState('All');
    const [isAdviceOpen, setIsAdviceOpen] = useState(false);

    useEffect(() => {
        if (urlType) {
            const formattedType = urlType.charAt(0).toUpperCase() + urlType.slice(1);
            setType(formattedType);
        } else {
            setType('All');
        }
    }, [urlType]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const data = await productService.getProducts({ category: 'fabrics' });
                setProducts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Dynamically get all brands from products, preserving preferred order
    const preferredBrands = ['Raymond', 'Siyaram', 'Grado'];
    const availableBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];
    const brands = [...new Set([...preferredBrands, ...availableBrands])];
    
    // Add a virtual brand for products without one
    if (products.some(p => !p.brand)) {
        brands.push('Bespoke Collection');
    }

    const filteredProducts = [...products].filter(p => {
        const matchesPrice = p.price <= priceRange;
        const searchType = type.toLowerCase();
        const matchesType = type === 'All' || 
            (p.type && p.type.toLowerCase() === searchType) || 
            (p.subCategory && p.subCategory.toLowerCase() === searchType) ||
            (p.name && p.name.toLowerCase().includes(searchType)) || 
            (p.description && p.description.toLowerCase().includes(searchType));
        const matchesBrand = selectedBrand === 'All' || 
            (selectedBrand === 'Bespoke Collection' ? !p.brand : p.brand === selectedBrand);
        return matchesPrice && matchesType && matchesBrand;
    }).sort((a, b) => {
        if (sortBy === 'Lowest Price') return a.price - b.price;
        if (sortBy === 'Highest Price') return b.price - a.price;
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0); // Newest
    });

    if (loading) return <Loader />;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pb-24"
        >
            <header className="bg-white/3 pt-32 pb-16">
                <div className="container mx-auto px-4 text-center space-y-4">
                    <span className="text-primary font-bold tracking-[0.4em] uppercase text-xs">
                        Luxury Materials
                    </span>
                    <h1 className="text-6xl font-display font-bold">
                        Premium <span className="text-primary">Fabrics</span>
                    </h1>
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
                                <span className="text-sm text-slate-400 font-bold uppercase">FABRIC TYPE</span>
                                <div className="space-y-2">
                                    {['All', 'Cotton', 'Silk', 'Linen', 'Velvet', 'Satin', 'Chiffon', 'Rayon', 'Wool'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => {
                                                setType(t);
                                                navigate(t === 'All' ? '/fabrics' : `/fabrics/${t.toLowerCase()}`);
                                            }}
                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${type === t ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Brand Filter */}
                            <div className="space-y-4">
                                <span className="text-sm text-slate-400 font-bold uppercase">BRAND</span>
                                <div className="space-y-2">
                                    {['All', ...brands].map(b => (
                                        <button
                                            key={b}
                                            onClick={() => setSelectedBrand(b)}
                                            className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${selectedBrand === b ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                        >
                                            {b}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl space-y-4">
                            <h4 className="font-bold text-white tracking-tight">Need Recommendations?</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">Our master tailors can help you choose the best fabric.</p>
                            <Button variant="accent" size="sm" className="w-full" onClick={() => setIsAdviceOpen(true)}>Get Expert Advice</Button>
                        </div>
                    </div>

                    <ConsultationModal 
                        isOpen={isAdviceOpen} 
                        onClose={() => setIsAdviceOpen(false)} 
                        type="advice"
                        category="fabrics"
                    />

                    {/* Results Grid */}
                    <div className="flex-grow space-y-8">
                        <div className="flex justify-between items-center pb-6 border-b border-white/5">
                            <p className="text-slate-400 text-sm">Showing <span className="text-white font-bold">{filteredProducts.length}</span> stunning fabrics</p>
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

                        <div className="space-y-32">
                            {brands.filter(b => selectedBrand === 'All' || b === selectedBrand).map((brand) => {
                                const brandProducts = filteredProducts.filter(p => 
                                    brand === 'Bespoke Collection' ? !p.brand : p.brand === brand
                                );
                                if (brandProducts.length === 0) return null;

                                return (
                                    <section key={brand} className="space-y-12">
                                        <div className="flex items-center gap-8">
                                            <h2 className="text-3xl font-display font-bold text-white tracking-tight">{brand}</h2>
                                            <div className="flex-grow h-px bg-white/10" />
                                            <span className="text-slate-500 font-bold tracking-widest text-xs uppercase">
                                                {brandProducts.length} Selections
                                            </span>
                                        </div>

                                        <ProductGrid>
                                            {brandProducts.map(p => <ProductCard key={p._id} product={p} />)}
                                        </ProductGrid>
                                    </section>
                                );
                            })}
                            
                            {filteredProducts.length === 0 && (
                                <div className="text-center py-20 space-y-4">
                                    <p className="text-slate-400 text-xl font-display">No fabrics found for these filters.</p>
                                    <button className="px-6 py-2 border border-white/20 rounded-full text-white hover:bg-white/10 transition" onClick={() => { setPriceRange(50000); setSortBy('Newest'); }}>Reset Filters</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default FabricsPage;
