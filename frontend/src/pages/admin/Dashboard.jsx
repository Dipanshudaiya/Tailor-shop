import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineUsers, HiOutlineShoppingBag, HiOutlineCurrencyRupee, HiOutlineChartBar } from 'react-icons/hi';
import orderService from '../../services/orderService';
import Loader from '../../components/common/Loader';

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        revenue: 0,
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const orders = await orderService.getOrders();
                
                if (Array.isArray(orders)) {
                    // Total Revenue = Sum of all 'delivered' orders
                    const revenueOrders = orders.filter(o => o && o.status === 'delivered');
                    const totalRevenue = revenueOrders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
                    
                    // Pending Amount = Sum of all orders with status 'confirmed'
                    const pendingAmountOrders = orders.filter(o => o && o.status === 'confirmed');
                    const pendingAmount = pendingAmountOrders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);
                    
                    // Total Refund = Sum of all 'cancelled' orders with digital payment (UPI/Card)
                    const refundOrders = orders.filter(o => o && o.status === 'cancelled' && (o.paymentMethod === 'upi' || o.paymentMethod === 'card'));
                    const totalRefund = refundOrders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

                    // Pending Tasks = Orders with status pending or confirmed
                    const pendingTasks = orders.filter(o => o && (o.status === 'pending' || o.status === 'confirmed'));
                    
                    setStats({
                        totalOrders: orders.length,
                        pendingOrders: pendingTasks.length,
                        pendingAmount: pendingAmount,
                        revenue: totalRevenue,
                        refundAmount: totalRefund,
                    });
                    
                    const sortedOrders = [...orders]
                        .filter(o => o && o._id)
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setRecentOrders(sortedOrders.slice(0, 5));
                } else {
                    console.error('Orders data is not an array:', orders);
                }
            } catch (error) {
                console.error('Failed to fetch dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <Loader />;

    const cards = [
        { title: 'Total Orders', value: stats.totalOrders, icon: HiOutlineShoppingBag, color: 'text-primary', bg: 'bg-primary/10' },
        { title: 'Pending Tasks', value: stats.pendingOrders, icon: HiOutlineChartBar, color: 'text-accent', bg: 'bg-accent/10' },
        { title: 'Total Revenue', value: `₹${stats.revenue}`, icon: HiOutlineCurrencyRupee, color: 'text-green-500', bg: 'bg-green-500/10' },
        { title: 'Pending Amount', value: `₹${stats.pendingAmount}`, icon: HiOutlineCurrencyRupee, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
        { title: 'Total Refund', value: `₹${stats.refundAmount || 0}`, icon: HiOutlineCurrencyRupee, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-0 md:p-4 space-y-6 md:space-y-12"
        >
            <header className="px-4 md:px-0">
                <h1 className="text-2xl md:text-4xl font-display font-bold">Admin <span className="text-primary italic">Dashboard</span></h1>
                <p className="text-slate-500 text-sm md:text-base">Manage your shop operations and track performance.</p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-8 px-4 md:px-0">
                {cards.map((card, idx) => (
                    <div key={idx} className="p-6 md:p-8 bg-dark-card border border-white/5 rounded-2xl md:rounded-3xl space-y-4 md:space-y-6 group hover:border-primary/30 transition-all shadow-xl">
                        <div className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${card.bg} ${card.color} flex items-center justify-center transition-all group-hover:scale-110 shrink-0`}>
                            <card.icon size={24} className="md:size-[28px]" />
                        </div>
                        <div className="space-y-1 md:space-y-2">
                            <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest">{card.title}</p>
                            <h4 className="text-2xl md:text-4xl font-bold text-white tracking-tight">{card.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Orders List */}
            <section className="bg-dark-card border border-white/5 rounded-2xl md:rounded-[2rem] overflow-hidden mx-4 md:mx-0 shadow-2xl">
                <div className="p-5 md:p-8 border-b border-white/5 flex justify-between items-center bg-white/3">
                    <h3 className="text-lg md:text-xl font-display font-bold">Recent Bookings</h3>
                    <button onClick={() => navigate('/admin/orders')} className="text-primary hover:text-white transition-colors text-xs md:text-sm font-bold uppercase tracking-wider">View All</button>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                    {recentOrders.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 italic">
                            <p>Recent order summaries will appear here.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse min-w-[700px] md:min-w-full">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5 text-[10px] md:text-xs uppercase tracking-wider text-slate-400">
                                    <th className="p-4 pl-6 md:pl-8 font-medium">Order ID</th>
                                    <th className="p-4 font-medium">Date</th>
                                    <th className="p-4 font-medium">Total</th>
                                    <th className="p-4 font-medium">Delivery</th>
                                    <th className="p-4 font-medium">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {recentOrders.map((order) => (
                                    <tr key={order?._id || Math.random()} className="hover:bg-white/5 transition-colors">
                                        <td className="p-4 pl-6 md:pl-8 text-xs md:text-sm font-mono text-slate-300">#{order?._id?.slice(-8).toUpperCase()}</td>
                                        <td className="p-4 text-xs md:text-sm text-slate-400">{order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                                        <td className="p-4 text-xs md:text-sm font-bold text-white">₹{order?.totalPrice || 0}</td>
                                        <td className="p-4">
                                            {order?.status === 'delivered' ? (
                                                <span className="text-green-500 font-bold text-[10px] md:text-xs uppercase">Successful</span>
                                            ) : order?.status === 'cancelled' ? (
                                                <span className="text-red-500 font-bold text-[10px] md:text-xs uppercase">Cancelled</span>
                                            ) : (
                                                <span className="text-yellow-500 font-bold text-[10px] md:text-xs uppercase">Pending</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                order?.status === 'delivered' ? 'bg-green-500/10 text-green-500' :
                                                order?.status === 'processing' ? 'bg-blue-500/10 text-blue-500' :
                                                order?.status === 'shipped' ? 'bg-purple-500/10 text-purple-500' :
                                                order?.status === 'cancelled' ? 'bg-red-500/10 text-red-500' :
                                                'bg-yellow-500/10 text-yellow-500'
                                            }`}>
                                                {order?.status || 'Unknown'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>
        </motion.div>
    );
};

export default Dashboard;
