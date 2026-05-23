import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import productService from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import ProductGrid from '../components/product/ProductGrid';
import Loader from '../components/common/Loader';
import Button from '../components/ui/Button';
import { HiOutlineFilter, HiChevronDown } from 'react-icons/hi';
import ConsultationModal from '../components/common/ConsultationModal';
import SoftAurora from '../components/ui/SoftAurora';

const SareesPage = () => {
    const { type: urlType } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState(50000);
    const [type, setType] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');
    const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

    useEffect(() => {
        if (urlType) {
            // Capitalize first letter to match internal state/database case if necessary
            // Or just use the value as is if the backend/DB is flexible
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
                const data = await productService.getProducts({ category: 'sarees' });
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
            (p.type && p.type.toLowerCase() === searchType) ||
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
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pb-24"
        >
            <header className="bg-white/3 pt-32 pb-16 overflow-hidden relative">
                {/* WebGL Aurora Background */}
                <div className="absolute inset-0 z-0 pointer-events-auto">
                    <SoftAurora 
                        color1="#1e1b4b" 
                        color2="#4c1d95" 
                        brightness={1.2}
                        speed={0.4}
                        enableMouseInteraction={true}
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-dark/40 via-dark/20 to-dark pointer-events-none"></div>
                </div>
                
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="container mx-auto px-4 text-center space-y-4 relative z-10"
                >
                    <span className="text-primary font-bold tracking-[0.4em] uppercase text-xs block mb-2">
                        Traditional Elegance
                    </span>
                    <h1 className="text-5xl md:text-6xl font-display font-bold capitalize drop-shadow-lg">
                        Premium <span className="text-primary">Sarees</span>
                    </h1>
                    
                    {/* Tailor-Themed Divider */}
                    <div className="flex items-center justify-center gap-4 pt-4">
                        <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-primary"></div>
                        <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
                        </svg>
                        <div className="w-16 h-[1px] bg-gradient-to-l from-transparent via-primary/50 to-primary"></div>
                    </div>
                </motion.div>
            </header>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Filters Sidebar */}
                    <div className="w-full lg:w-72 space-y-12">
                        <div className="space-y-6">
                            <div className="flex items-center gap-2 text-white font-bold">
                                <HiOutlineFilter />
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
                                {/* Mobile Dropdown */}
                                <div className="block lg:hidden relative group">
                                    <select 
                                        value={type} 
                                        onChange={(e) => {
                                            const t = e.target.value;
                                            setType(t);
                                            navigate(t === 'All' ? '/sarees' : `/sarees/${t.toLowerCase()}`);
                                        }}
                                        className="w-full bg-dark/50 border border-slate-700 rounded-xl py-3 px-4 focus:outline-none focus:border-primary transition-all text-white appearance-none cursor-pointer"
                                    >
                                        {['All', 'Silk', 'Cotton', 'Chiffon', 'Georgette', 'Banarasi', 'Kanjeevaram', 'Net', 'Designer'].map(t => (
                                            <option key={t} value={t} className="bg-dark text-white">{t}</option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>
                                </div>

                                {/* Desktop List */}
                                <div className="hidden lg:block space-y-2">
                                    {['All', 'Silk', 'Cotton', 'Chiffon', 'Georgette', 'Banarasi', 'Kanjeevaram', 'Net', 'Designer'].map(t => (
                                        <button
                                            key={t}
                                            onClick={() => {
                                                setType(t);
                                                navigate(t === 'All' ? '/sarees' : `/sarees/${t.toLowerCase()}`);
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
                            <h4 className="font-bold text-white tracking-tight">Custom Saree Work?</h4>
                            <p className="text-xs text-slate-400 leading-relaxed">We specialize in personalized embroidery and border work.</p>
                            <Button variant="accent" size="sm" className="w-full" onClick={() => setIsEnquiryOpen(true)}>Enquire Now</Button>
                        </div>
                    </div>

                    <ConsultationModal 
                        isOpen={isEnquiryOpen} 
                        onClose={() => setIsEnquiryOpen(false)} 
                        type="enquiry"
                        category="sarees"
                    />

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
                            <ProductGrid className="lg:grid-cols-2 xl:grid-cols-3">
                                {filteredProducts.map(p => <ProductCard key={p._id} product={p} />)}
                            </ProductGrid>
                        ) : (
                            <div className="text-center py-32 space-y-4">
                                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-500">
                                    <HiOutlineFilter size={40} />
                                </div>
                                <h3 className="text-xl font-display font-bold">No sarees found</h3>
                                <p className="text-slate-400 max-w-xs mx-auto">Try adjusting your filters or contact us for custom designs.</p>
                                <Button variant="outline" onClick={() => { setPriceRange(50000); setType('All'); setSortBy('Newest'); }}>Reset Filters</Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default SareesPage;
