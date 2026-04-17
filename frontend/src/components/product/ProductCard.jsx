import React from 'react';
import { HiOutlineShoppingBag, HiArrowRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import useCartStore from '../../store/cartStore';
import { toast } from 'react-hot-toast';

const ProductCard = ({ product }) => {
    const { addItem } = useCartStore();

    const navigate = useNavigate();

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
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

    const handleBuyNow = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem(product);
        navigate('/cart');
    };

    return (
        <div className="card-premium group">
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden">
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-dark/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Quick Add Button */}
                <button
                    onClick={handleAddToCart}
                    className="absolute bottom-4 right-4 w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center 
                               transform translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 
                               transition-all duration-300 shadow-xl hover:bg-primary-dark"
                >
                    <HiOutlineShoppingBag size={24} />
                </button>

                {/* Tag */}
                {product.category && (
                    <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-dark/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/10">
                            {product.category}
                        </span>
                    </div>
                )}
                {/* Discount Tag */}
                {product.discount > 0 && (
                    <div className="absolute top-4 right-4">
                        <span className="px-3 py-1 bg-accent text-white text-[10px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                            {product.discount}% OFF
                        </span>
                    </div>
                )}
            </div>

            {/* Content - Clickable to Detail Page */}
            <div 
                onClick={() => navigate(`/product/${product._id}`)}
                className="p-5 space-y-3 cursor-pointer"
            >
                <div className="flex justify-between items-start gap-2">
                    <h3 className="font-display font-bold text-lg text-white group-hover:text-primary transition-colors leading-tight">
                        {product.name}
                    </h3>
                    <div className="text-right">
                        {product.discount > 0 ? (
                            <>
                                <p className="text-[10px] text-slate-500 line-through text-right">₹{product.price}</p>
                                <p className="font-bold text-primary">₹{Math.floor(product.price * (1 - product.discount / 100))}</p>
                            </>
                        ) : (
                            <span className="font-bold text-primary">₹{product.price}</span>
                        )}
                    </div>
                </div>
                
                <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                    {product.description}
                </p>

                <div className="pt-2 flex items-center justify-between border-t border-white/5 gap-2">
                    <button 
                        onClick={handleAddToCart}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-white text-xs font-bold py-2.5 rounded-lg border border-white/10 transition-colors tracking-widest text-center">
                        ADD TO CART
                    </button>
                    <button 
                        onClick={handleBuyNow}
                        className="flex-1 bg-primary hover:bg-primary-light text-white text-xs font-bold py-2.5 rounded-lg transition-colors tracking-widest text-center shadow-lg shadow-primary/20">
                        BUY NOW
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
