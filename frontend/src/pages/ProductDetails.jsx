import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineShoppingBag, HiArrowLeft, HiOutlineShieldCheck, HiOutlineTruck, HiOutlineRefresh } from 'react-icons/hi';
import productService from '../services/productService';
import useCartStore from '../store/cartStore';
import Loader from '../components/common/Loader';
import Button from '../components/ui/Button';
import { toast } from 'react-hot-toast';
import ConsultationModal from '../components/common/ConsultationModal';
import { HiOutlineChatAlt2 } from 'react-icons/hi';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addItem } = useCartStore();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('enquiry');

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const data = await productService.getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error(error);
                toast.error('Product not found! (The database might have reset, please return to catalog)');
                setTimeout(() => navigate('/search'), 2000);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, navigate]);

    if (loading) return <Loader />;
    if (!product) return null;

    const discountedPrice = product.discount > 0 
        ? Math.floor(product.price * (1 - product.discount / 100)) 
        : product.price;

    const handleAddToCart = () => {
        addItem(product);
        toast.success(`${product.name} added to cart!`, {
            icon: '🛍️',
            style: {
                borderRadius: '10px',
                background: '#1E293B',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)'
            },
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-32 pb-24 min-h-screen"
        >
            <div className="container mx-auto px-4">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors mb-8 group"
                >
                    <HiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    Back to Gallery
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                    {/* Left: Image Container */}
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative rounded-[2.5rem] overflow-hidden bg-dark-card border border-white/5 shadow-2xl group"
                    >
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className="w-full aspect-[4/5] object-cover"
                        />
                        {product.discount > 0 && (
                            <div className="absolute top-8 right-8">
                                <span className="px-6 py-2 bg-accent text-dark font-bold rounded-full shadow-2xl scale-110">
                                    {product.discount}% OFF
                                </span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </motion.div>

                    {/* Right: Info Container */}
                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-10"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="px-4 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">
                                    {product.category} Collection
                                </span>
                                {product.brand && (
                                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                        Brand: {product.brand}
                                    </span>
                                )}
                            </div>
                            <h1 className="text-5xl md:text-6xl font-display font-bold leading-tight">
                                {product.name}
                            </h1>
                            <div className="flex items-end gap-6 pt-2">
                                <div className="space-y-1">
                                    <p className="text-4xl font-display font-bold text-primary">₹{discountedPrice}</p>
                                    {product.discount > 0 && (
                                        <p className="text-lg text-slate-500 line-through">₹{product.price}</p>
                                    )}
                                </div>
                                <span className="mb-2 text-xs text-slate-500 font-medium">Inclusive of all taxes</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Design Description</h3>
                            <p className="text-lg text-slate-400 leading-relaxed max-w-xl">
                                {product.description || "Experience the pinnacle of bespoke tailoring. This masterpiece is crafted with precision using premium materials and hand-finished details to ensure a perfect fit that exudes elegance."}
                            </p>
                        </div>

                        {/* Features */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8 border-y border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/5 rounded-lg text-primary"><HiOutlineShieldCheck size={24} /></div>
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Premium Quality</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/5 rounded-lg text-accent"><HiOutlineTruck size={24} /></div>
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Fast Tailoring</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/5 rounded-lg text-green-500"><HiOutlineRefresh size={24} /></div>
                                <span className="text-xs font-bold text-white uppercase tracking-wider">Easy Refit</span>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button size="lg" className="flex-1 max-w-xs h-16 text-lg group" onClick={handleAddToCart}>
                                <HiOutlineShoppingBag className="group-hover:scale-110 transition-transform" />
                                Add to Cart
                            </Button>
                            <Button variant="outline" size="lg" className="flex-1 max-w-xs h-16 text-lg" onClick={() => { handleAddToCart(); navigate('/cart'); }}>
                                Buy Now
                            </Button>
                        </div>
                        
                        <div className="pt-6 border-t border-white/5">
                            <button 
                                onClick={() => { setModalType('advice'); setIsModalOpen(true); }}
                                className="flex items-center gap-3 text-primary hover:text-white transition-colors font-bold group"
                            >
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-all">
                                    <HiOutlineChatAlt2 size={20} />
                                </div>
                                <div className="text-left">
                                    <p className="text-sm">Need styling advice?</p>
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500">Chat with expert master ji</p>
                                </div>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </div>

            <ConsultationModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                type={modalType}
            />
        </motion.div>
    );
};

export default ProductDetails;
