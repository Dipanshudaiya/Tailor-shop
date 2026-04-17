import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import orderService from '../services/orderService';
import Loader from '../components/common/Loader';
import { HiOutlineUser, HiOutlineMail, HiOutlineLocationMarker, HiOutlinePhone, HiOutlineShoppingBag, HiArrowRight } from 'react-icons/hi';
import defaultAvatar from '../assets/react.svg'; // Placeholder just in case

const ProfilePage = () => {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [latestAddress, setLatestAddress] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            if (user && user.role !== 'admin') {
                try {
                    const data = await orderService.getMyOrders();
                    setOrders(data);
                    if (data && data.length > 0) {
                        setLatestAddress(data[0].shippingAddress);
                    }
                } catch (error) {
                    console.error("Failed to fetch orders", error);
                }
            }
            setLoading(false);
        };
        fetchOrders();
    }, [user]);

    if (loading) return <Loader />;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-24 min-h-[80vh]"
        >
            <div className="container mx-auto px-4 max-w-4xl space-y-12">
                <header className="text-center space-y-4">
                    <h1 className="text-5xl font-display font-bold">My <span className="text-primary">Profile</span></h1>
                    <p className="text-slate-400">Manage your account details and view your history.</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* User Details Card */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-dark-card border border-white/5 rounded-[2rem] p-8 text-center space-y-6 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-primary/20 to-transparent" />
                            <div className="w-32 h-32 mx-auto bg-dark border-4 border-dark rounded-full relative z-10 overflow-hidden shadow-xl">
                                {/* Placeholder user image */}
                                <div className="w-full h-full bg-primary/20 flex items-center justify-center text-primary text-5xl font-bold uppercase">
                                    {user?.name.charAt(0)}
                                </div>
                            </div>
                            <div className="space-y-2 relative z-10">
                                <h3 className="text-2xl font-bold text-white tracking-tight">{user?.name}</h3>
                                <div className="inline-block px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs font-bold text-primary uppercase tracking-widest">
                                    {user?.role}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/5 space-y-4 text-left">
                                <div className="flex items-center gap-3 text-slate-400">
                                    <HiOutlineMail className="text-primary" size={20} />
                                    <span className="text-sm truncate">{user?.email}</span>
                                </div>
                                {user?.role === 'user' && (
                                    <>
                                        <div className="flex items-start gap-3 text-slate-400">
                                            <HiOutlinePhone className="text-primary mt-1" size={20} />
                                            <span className="text-sm">{latestAddress?.phone || 'Not Provided'}</span>
                                        </div>
                                        <div className="flex items-start gap-3 text-slate-400">
                                            <HiOutlineLocationMarker className="text-primary mt-1 flex-shrink-0" size={20} />
                                            <span className="text-sm line-clamp-2">
                                                {latestAddress ? `${latestAddress.street}, ${latestAddress.city}, ${latestAddress.state} - ${latestAddress.zip}` : 'No address on file'}
                                            </span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Orders Session */}
                    <div className="md:col-span-2 space-y-6">
                        {user?.role === 'admin' ? (
                            <div className="bg-dark-card border border-white/5 rounded-[2rem] p-8 h-full flex flex-col items-center justify-center text-center space-y-6 shadow-2xl">
                                <HiOutlineUser size={48} className="text-primary/50" />
                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-white">Administrator Account</h3>
                                    <p className="text-slate-400 text-sm max-w-sm mx-auto">
                                        You are logged in as an Admin. Use the Admin Dashboard to manage products, orders, and clients.
                                    </p>
                                </div>
                                <Link 
                                    to="/admin" 
                                    className="flex items-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 hover:scale-105 transition-all shadow-lg shadow-primary/20"
                                >
                                    Go to Admin Panel <HiArrowRight />
                                </Link>
                            </div>
                        ) : (
                            <div className="bg-dark-card border border-white/5 rounded-[2rem] p-8 shadow-2xl space-y-8">
                                <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                                    <HiOutlineShoppingBag className="text-primary" size={28} />
                                    <h3 className="text-2xl font-display font-bold text-white">Recent Shopping Details</h3>
                                </div>

                                {orders.length === 0 ? (
                                    <div className="text-center py-12 space-y-4 text-slate-500">
                                        <p>You haven't placed any orders yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        {orders.map((order) => (
                                            <div key={order._id} className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 hover:border-primary/30 transition-colors">
                                                <div className="flex flex-wrap justify-between items-start gap-4 border-b border-white/5 pb-4">
                                                    <div>
                                                        <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Order ID</p>
                                                        <p className="font-mono text-sm text-slate-300">{order._id.substring(0, 10)}...</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Date</p>
                                                        <p className="text-sm text-slate-300">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Status</p>
                                                        <span className={`inline-block px-2 py-1 text-xs font-bold rounded mt-1 uppercase tracking-wider ${
                                                            order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                                                            order.status === 'cancelled' ? 'bg-red-500/20 text-red-400' :
                                                            'bg-yellow-500/20 text-yellow-500'
                                                        }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Total Amount</p>
                                                        <p className="text-lg font-bold text-primary">₹{order.totalPrice}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-4">
                                                            <div className="w-12 h-12 rounded-lg bg-dark overflow-hidden flex-shrink-0 border border-white/5">
                                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                            </div>
                                                            <div className="flex-grow">
                                                                <h4 className="text-sm font-bold text-white line-clamp-1">{item.name}</h4>
                                                                <p className="text-xs text-slate-400">Qty: {item.qty} × ₹{item.price}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfilePage;
