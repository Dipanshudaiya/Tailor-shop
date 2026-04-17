import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineSearch, HiOutlineTag } from 'react-icons/hi';
import productService from '../services/productService';
import ProductCard from '../components/product/ProductCard';
import ProductGrid from '../components/product/ProductGrid';
import Input from '../components/ui/Input';

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const isDiscountOnly = searchParams.get('discount') === 'true';
    
    const [keyword, setKeyword] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInitialResults = async () => {
            if (isDiscountOnly) {
                setLoading(true);
                try {
                    const data = await productService.getProducts({ discount: 'true' });
                    setResults(data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchInitialResults();
    }, [isDiscountOnly]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (keyword.length > 2) {
                setLoading(true);
                try {
                    const params = { keyword };
                    if (isDiscountOnly) params.discount = 'true';
                    const data = await productService.getProducts(params);
                    setResults(data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setLoading(false);
                }
            } else if (!isDiscountOnly) {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [keyword, isDiscountOnly]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-24 min-h-screen"
        >
            <div className="container mx-auto px-4 space-y-16">
                <div className="max-w-3xl mx-auto space-y-8 text-center">
                    <h1 className="text-5xl font-display font-bold">Search <span className="text-primary italic">Shop</span></h1>
                    <div className="relative group max-w-2xl mx-auto">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-primary-light rounded-[2rem] blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center bg-dark border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                            <div className="pl-6 text-slate-400 group-focus-within:text-primary transition-colors">
                                <HiOutlineSearch size={28} />
                            </div>
                            <input 
                                type="text"
                                placeholder="Search for designs, fabrics, or categories..."
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className="w-full bg-transparent px-6 py-6 text-lg text-white placeholder-slate-500 outline-none"
                            />
                            {loading && (
                                <div className="pr-6">
                                    <div className="w-6 h-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-3">
                        {['Saree', 'Blouse', 'Suit', 'Raymond', 'Silk'].map(tag => (
                            <button 
                                key={tag} 
                                onClick={() => setKeyword(tag)}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-slate-400 hover:border-primary hover:text-white transition-all flex items-center gap-2"
                            >
                                <HiOutlineTag /> {tag}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5">
                    {results.length > 0 ? (
                        <div className="space-y-8">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                Search Results <span className="text-primary">({results.length})</span>
                            </h2>
                            <ProductGrid>
                                {results.map(p => <ProductCard key={p._id} product={p} />)}
                            </ProductGrid>
                        </div>
                    ) : (
                        keyword.length > 2 && !loading ? (
                            <div className="text-center py-20 text-slate-500">
                                <p className="text-lg">No results found for "{keyword}"</p>
                            </div>
                        ) : (
                            <div className="text-center py-20 text-slate-600">
                                <p className="text-sm font-bold tracking-[0.2em] uppercase">Start typing to search our collection</p>
                            </div>
                        )
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default SearchPage;
