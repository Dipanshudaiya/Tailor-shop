import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineTrash, HiPlus, HiMinus, HiArrowLeft, HiOutlineShoppingBag } from 'react-icons/hi';
import useCartStore from '../store/cartStore';
import Button from '../components/ui/Button';

const CartPage = () => {
    const { items, addItem, removeItem, getTotalPrice } = useCartStore();
    const navigate = useNavigate();

    const updateQty = (item, newQty) => {
        if (newQty < 1) return;
        addItem(item, newQty);
    };

    if (items.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="pt-32 pb-24 min-h-[70vh] flex flex-col items-center justify-center space-y-8"
            >
                <div className="w-32 h-32 bg-white/5 rounded-full flex items-center justify-center text-slate-600">
                    <HiOutlineShoppingBag size={64} />
                </div>
                <div className="text-center space-y-2">
                    <h2 className="text-3xl font-display font-bold">Your cart is empty</h2>
                    <p className="text-slate-400">Looks like you haven't added any bespoke designs yet.</p>
                </div>
                <Link to="/">
                    <Button variant="outline" size="lg">Explore Collection</Button>
                </Link>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-24"
        >
            <div className="container mx-auto px-4">
                <header className="mb-12 flex items-center justify-between">
                    <h1 className="text-5xl font-display font-bold">Bespoke <span className="text-primary italic">Cart</span></h1>
                    <Link to="/" className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all text-sm">
                        <HiArrowLeft /> CONTINUE SHOPPING
                    </Link>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Items List */}
                    <div className="lg:col-span-2 space-y-6">
                        <AnimatePresence>
                            {items.map((item) => (
                                <motion.div
                                    key={item.product}
                                    layout
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="p-6 bg-dark-card border border-white/5 rounded-2xl flex flex-col sm:flex-row items-center gap-8 group hover:border-primary/30 transition-all"
                                >
                                    {/* Image */}
                                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-grow space-y-1 text-center sm:text-left">
                                        <h3 className="font-bold text-white group-hover:text-primary transition-colors">{item.name}</h3>
                                        <p className="text-xs text-slate-500 uppercase tracking-widest">{item.category} / {item.subCategory}</p>
                                        <div className="flex items-center gap-2 justify-center sm:justify-start">
                                            {item.discount > 0 ? (
                                                <>
                                                    <span className="text-primary font-bold">₹{Math.floor(item.price * (1 - item.discount / 100))}</span>
                                                    <span className="text-xs text-slate-500 line-through">₹{item.price}</span>
                                                    <span className="text-[10px] text-green-500 font-bold uppercase">{item.discount}% OFF</span>
                                                </>
                                            ) : (
                                                <span className="text-primary font-bold">₹{item.price}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Qty Controls */}
                                    <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-1">
                                        <button 
                                            onClick={() => updateQty(item, item.qty - 1)}
                                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white"
                                        >
                                            <HiMinus />
                                        </button>
                                        <span className="w-8 text-center font-bold text-white">{item.qty}</span>
                                        <button 
                                            onClick={() => updateQty(item, item.qty + 1)}
                                            className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white"
                                        >
                                            <HiPlus />
                                        </button>
                                    </div>

                                    {/* Remove */}
                                    <button 
                                        onClick={() => removeItem(item.product)}
                                        className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                                    >
                                        <HiOutlineTrash size={20} />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 p-8 bg-dark-card border border-white/5 rounded-[2rem] space-y-8 shadow-2xl overflow-hidden relative">
                            {/* Decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                            <h3 className="text-2xl font-display font-bold text-white border-b border-white/5 pb-6">Summary</h3>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between text-slate-400">
                                    <span>Subtotal ({items.length} items)</span>
                                    <span>₹{useCartStore.getState().getSubtotal()}</span>
                                </div>
                                {useCartStore.getState().getDiscountTotal() > 0 && (
                                    <div className="flex justify-between text-green-500 text-sm italic">
                                        <span>Offer Discount</span>
                                        <span>- ₹{useCartStore.getState().getDiscountTotal()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-slate-400">
                                    <span>Tailoring Estimate</span>
                                    <span className="text-green-500">Free Consultation</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                                <span className="text-slate-400 font-bold uppercase tracking-widest text-xs">Final Total</span>
                                <span className="text-3xl font-display font-bold text-primary">₹{getTotalPrice()}</span>
                            </div>

                            <Button 
                                className="w-full py-4 text-lg"
                                onClick={() => navigate('/checkout')}
                            >
                                Proceed to Checkout
                            </Button>

                            <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest leading-relaxed">
                                Our tailors will confirm exact measurements and final pricing after consultation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartPage;
