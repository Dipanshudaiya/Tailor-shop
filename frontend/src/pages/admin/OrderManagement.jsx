import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineTruck, HiCheckCircle, HiXCircle, HiOutlineEye, HiX, HiOutlineLocationMarker, HiOutlineCreditCard, HiOutlineCash, HiOutlinePhone, HiOutlineMail, HiOutlineUser, HiTrash, HiOutlineClock } from 'react-icons/hi';
import orderService from '../../services/orderService';
import { toast } from 'react-hot-toast';

const paymentMethodLabel = (method) => {
    switch (method) {
        case 'cod': return 'Cash on Delivery';
        case 'upi': return 'UPI / PhonePe / GPay';
        case 'card': return 'Credit / Debit Card';
        default: return method || 'N/A';
    }
};

const paymentMethodIcon = (method) => {
    switch (method) {
        case 'cod': return '💵';
        case 'upi': return '📱';
        case 'card': return '💳';
        default: return '💰';
    }
};

const paymentStatusBadge = (status) => {
    switch (status) {
        case 'paid':
            return 'border-green-500 text-green-500 bg-green-500/5';
        case 'unpaid':
            return 'border-red-500 text-red-500 bg-red-500/5';
        case 'refund':
            return 'border-purple-500 text-purple-500 bg-purple-500/5';
        case 'cancelled':
            return 'border-red-500 text-red-500 bg-red-500/5';
        default:
            return 'border-slate-500 text-slate-500 bg-slate-500/5';
    }
};

const orderStatusBadge = (status) => {
    switch (status) {
        case 'confirmed':
            return 'border-green-500 text-green-500 bg-green-500/5';
        case 'pending':
            return 'border-yellow-500 text-yellow-500 bg-yellow-500/5';
        case 'delivered':
            return 'border-blue-500 text-blue-500 bg-blue-500/5';
        case 'cancelled':
            return 'border-red-500 text-red-500 bg-red-500/5';
        default:
            return 'border-slate-500 text-slate-500 bg-slate-500/5';
    }
};

/* ─── Order Details Modal ────────────────────────────────────── */
const OrderDetailsModal = ({ order, onClose, onStatusUpdate, onPaymentUpdate }) => {
    if (!order) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Backdrop */}
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="relative bg-dark-card border border-white/10 rounded-[2rem] w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl custom-scrollbar"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-dark-card/95 backdrop-blur-md border-b border-white/5 p-6 flex items-center justify-between rounded-t-[2rem]">
                        <div>
                            <h2 className="text-2xl font-display font-bold text-white">Order <span className="text-primary">Details</span></h2>
                            <p className="text-xs text-slate-500 font-mono mt-1">#{order._id}</p>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-400 hover:text-white">
                            <HiX size={24} />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Customer & Status Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Customer Info */}
                            <div className="bg-white/3 border border-white/5 rounded-2xl p-5 space-y-3">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Customer Info</h3>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                                        <HiOutlineUser className="text-primary" size={18} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">{order.user?.name || 'Guest'}</p>
                                        <p className="text-xs text-slate-500 flex items-center gap-1">
                                            <HiOutlineMail size={12} /> {order.user?.email || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <HiOutlinePhone size={14} /> {order.shippingAddress?.phone || 'N/A'}
                                </div>
                            </div>

                            {/* Status Cards */}
                            <div className="bg-white/3 border border-white/5 rounded-2xl p-5 space-y-3">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Order Status</h3>
                                <div className="flex flex-wrap gap-2">
                                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${orderStatusBadge(order.status)}`}>
                                        {order.status}
                                    </span>
                                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${paymentStatusBadge(order.paymentStatus)}`}>
                                        {order.paymentStatus}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-400">
                                    <span>{paymentMethodIcon(order.paymentMethod)}</span>
                                    <span>{paymentMethodLabel(order.paymentMethod)}</span>
                                </div>
                                <p className="text-xs text-slate-500">
                                    Ordered: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white/3 border border-white/5 rounded-2xl p-5 space-y-3">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <HiOutlineLocationMarker size={14} /> Shipping Address
                            </h3>
                            <p className="text-white text-sm leading-relaxed">
                                {order.shippingAddress?.street}<br />
                                {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.zip}<br />
                                <span className="text-slate-400">Phone: {order.shippingAddress?.phone}</span>
                            </p>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white/3 border border-white/5 rounded-2xl p-5 space-y-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Items ({order.items?.length || 0})</h3>
                            <div className="space-y-3">
                                {order.items?.map((item, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 bg-white/3 rounded-xl border border-white/5">
                                        <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover border border-white/10" />
                                        <div className="flex-grow min-w-0">
                                            <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-wider">Qty: {item.qty} × ₹{item.price}</p>
                                        </div>
                                        <span className="text-sm font-bold text-primary whitespace-nowrap">₹{item.qty * item.price}</span>
                                    </div>
                                ))}
                            </div>
                            {/* Total */}
                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Amount</span>
                                <span className="text-xl font-bold text-primary">₹{order.totalPrice}</span>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white/3 border border-white/5 rounded-2xl p-5 space-y-4">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Quick Actions</h3>
                            
                            {/* Order Status Actions */}
                            <div className="space-y-2">
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Order Status</p>
                                <div className="flex flex-wrap gap-2">
                                    {['pending', 'confirmed', 'delivered', 'cancelled'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => onStatusUpdate(order._id, s)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all hover:scale-105 ${
                                                order.status === s
                                                    ? orderStatusBadge(s).replace('/5', '/20')
                                                    : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Status Actions */}
                            <div className="space-y-2">
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Payment Status</p>
                                <div className="flex flex-wrap gap-2">
                                    {['paid', 'unpaid', 'refund', 'cancelled'].map(s => (
                                        <button
                                            key={s}
                                            onClick={() => onPaymentUpdate(order._id, s)}
                                            className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all hover:scale-105 ${
                                                order.paymentStatus === s
                                                    ? paymentStatusBadge(s).replace('/5', '/20')
                                                    : 'border-white/10 text-slate-500 hover:border-white/20 hover:text-slate-300'
                                            }`}
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

/* ─── Main Order Management Component ────────────────────────── */
const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterTab, setFilterTab] = useState('All');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            console.log('Fetching orders...');
            const data = await orderService.getOrders();
            setOrders(Array.isArray(data) ? data : []);
            console.log('Orders fetched successfully');
        } catch (error) {
            console.error('Fetch Orders Error:', error);
            toast.error(typeof error === 'string' ? error : 'Failed to fetch orders');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            const order = orders.find(o => o._id === id);
            if (!order) return;

            await orderService.updateOrderStatus(id, status);
            
            // Automation Logic based on new requirements
            let autoPaymentStatus = null;
            
            if (status === 'delivered') {
                autoPaymentStatus = 'paid';
            } else if (status === 'confirmed') {
                if (order.paymentMethod === 'cod') {
                    autoPaymentStatus = 'unpaid';
                } else {
                    autoPaymentStatus = 'paid';
                }
            } else if (status === 'pending') {
                autoPaymentStatus = 'unpaid';
            } else if (status === 'cancelled') {
                if (order.paymentMethod === 'cod') {
                    autoPaymentStatus = 'cancelled';
                } else if (order.paymentMethod === 'upi' || order.paymentMethod === 'card') {
                    autoPaymentStatus = 'refund';
                }
            }

            if (autoPaymentStatus) {
                await orderService.updatePaymentStatus(id, autoPaymentStatus);
            }
            
            toast.success(`Order set to ${status}${autoPaymentStatus ? ` and payment to ${autoPaymentStatus}` : ''}`);
            fetchOrders();
            // update the modal order if open
            if (selectedOrder && selectedOrder._id === id) {
                setSelectedOrder(prev => ({ 
                    ...prev, 
                    status,
                    paymentStatus: autoPaymentStatus || prev.paymentStatus 
                }));
            }
        } catch (error) {
            console.error('Status Update Error:', error);
            toast.error(typeof error === 'string' ? error : 'Failed to update status');
        }
    };

    const handlePaymentUpdate = async (id, paymentStatus) => {
        try {
            await orderService.updatePaymentStatus(id, paymentStatus);
            toast.success(`Payment set to ${paymentStatus}`);
            fetchOrders();
            if (selectedOrder && selectedOrder._id === id) {
                setSelectedOrder(prev => ({ ...prev, paymentStatus }));
            }
        } catch (error) {
            toast.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) return;
        try {
            await orderService.deleteOrder(id);
            toast.success('Order deleted successfully');
            fetchOrders();
            if (selectedOrder && selectedOrder._id === id) {
                setSelectedOrder(null);
            }
        } catch (error) {
            console.error('Delete Error:', error);
            toast.error(typeof error === 'string' ? error : 'Failed to delete order');
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 pb-24 space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-dark-card border border-white/5 p-8 rounded-[2rem]">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white">Order <span className="text-primary italic">Fulfillment</span></h1>
                    <p className="text-slate-500 text-sm">Manage customer bookings, payments and tailoring status.</p>
                </div>
                <button 
                    onClick={fetchOrders}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-slate-300 hover:text-white transition-all"
                    disabled={loading}
                >
                    <HiOutlineClock className={loading ? 'animate-spin' : ''} size={18} />
                    Refresh Data
                </button>
            </header>

            {/* Filters Row */}
            <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
                {/* Search Bar */}
                <div className="relative w-full max-w-md group">
                    <HiOutlineEye className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search by customer name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-dark-card border border-white/5 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-slate-600 shadow-xl"
                    />
                </div>


                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 p-1.5 bg-dark-card border border-white/5 rounded-2xl overflow-x-auto shadow-xl">
                    {['All', 'Delivered', 'Paid', 'Unpaid', 'Refund', 'Cancelled'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setFilterTab(tab)}
                            className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                                filterTab === tab 
                                    ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-dark-card border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1200px]">
                        <thead className="bg-white/3 text-slate-500 font-bold text-[10px] uppercase tracking-widest border-b border-white/5">
                            <tr>
                                <th className="p-4">Order ID</th>
                                <th className="p-4">Customer</th>
                                <th className="p-4 text-center">Items</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Address</th>
                                <th className="p-4">Payment</th>
                                <th className="p-4">Pay Status</th>
                                <th className="p-4 text-center">View</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {orders
                                .filter(o => {
                                    const matchesName = o.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                                       o.shippingAddress?.phone?.includes(searchQuery);
                                    
                                    const matchesTab = filterTab === 'All' || 
                                                      (filterTab === 'Delivered' && o.status === 'delivered') ||
                                                      (filterTab === 'Paid' && o.paymentStatus === 'paid') ||
                                                      (filterTab === 'Unpaid' && o.paymentStatus === 'unpaid') ||
                                                      (filterTab === 'Refund' && o.paymentStatus === 'refund') ||
                                                      (filterTab === 'Cancelled' && o.paymentStatus === 'cancelled');
                                    
                                    return matchesName && matchesTab;
                                })
                                .map(o => (
                                <tr key={o._id} className="hover:bg-white/3 transition-colors group">
                                    {/* ORDER ID */}
                                    <td className="p-4 text-xs text-slate-500 font-mono">#{o._id.slice(-8)}</td>

                                    {/* CUSTOMER NAME */}
                                    <td className="p-4">
                                        <p className="font-bold text-white group-hover:text-primary transition-colors text-sm">{o.user?.name || 'Guest'}</p>
                                        <p className="text-[10px] text-slate-500">{o.user?.email || o.shippingAddress?.phone}</p>
                                    </td>

                                    {/* ITEMS */}
                                    <td className="p-4 text-center text-slate-400 text-xs font-medium">{o.items.length}</td>

                                    {/* TOTAL */}
                                    <td className="p-4 text-primary font-bold text-sm">₹{o.totalPrice}</td>

                                    {/* ORDER DATE */}
                                    <td className="p-4 text-slate-400 text-xs">
                                        {new Date(o.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                    </td>

                                    {/* STATUS */}
                                    <td className="p-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-widest border ${orderStatusBadge(o.status)}`}>
                                            {o.status}
                                        </span>
                                    </td>

                                    {/* ADDRESS */}
                                    <td className="p-4 max-w-[180px]">
                                        <p className="text-[11px] text-white font-medium leading-tight">{o.shippingAddress?.city}, {o.shippingAddress?.state}</p>
                                        <p className="text-[10px] text-slate-500 mt-0.5">{o.shippingAddress?.zip}</p>
                                    </td>

                                    {/* PAYMENT METHOD */}
                                    <td className="p-4">
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-sm grayscale group-hover:grayscale-0 transition-all">{paymentMethodIcon(o.paymentMethod)}</span>
                                            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">{o.paymentMethod}</span>
                                        </div>
                                    </td>

                                    {/* PAYMENT STATUS */}
                                    <td className="p-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${paymentStatusBadge(o.paymentStatus)}`}>
                                            {o.paymentStatus}
                                        </span>
                                    </td>

                                    {/* ORDER DETAILS BUTTON */}
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => setSelectedOrder(o)}
                                            className="p-2 bg-primary/5 text-primary hover:bg-primary hover:text-white rounded-lg border border-primary/10 transition-all"
                                            title="View Details"
                                        >
                                            <HiOutlineEye size={18} />
                                        </button>
                                    </td>

                                    {/* ACTIONS */}
                                    <td className="p-5">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleStatusUpdate(o._id, 'confirmed')} title="Confirm" className="p-2 bg-white/5 text-green-500 hover:bg-green-500 hover:text-white rounded-lg border border-green-500/20 transition-all hover:scale-110"><HiCheckCircle size={16} /></button>
                                            <button onClick={() => handleStatusUpdate(o._id, 'delivered')} title="Deliver" className="p-2 bg-white/5 text-primary hover:bg-primary hover:text-white rounded-lg border border-primary/20 transition-all hover:scale-110"><HiOutlineTruck size={16} /></button>
                                            <button onClick={() => handleStatusUpdate(o._id, 'cancelled')} title="Cancel" className="p-2 bg-white/5 text-red-500 hover:bg-red-500 hover:text-white rounded-lg border border-red-500/20 transition-all hover:scale-110"><HiXCircle size={16} /></button>
                                            <button onClick={() => handleDelete(o._id)} title="Delete" className="p-2 bg-white/5 text-slate-400 hover:bg-red-600 hover:text-white rounded-lg border border-white/5 transition-all hover:scale-110"><HiTrash size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {loading && <div className="p-20 text-center text-slate-500">Loading orders...</div>}
                {!loading && orders.length === 0 && <div className="p-20 text-center text-slate-500">No bookings yet.</div>}
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusUpdate={handleStatusUpdate}
                    onPaymentUpdate={handlePaymentUpdate}
                />
            )}
        </motion.div>
    );
};

export default OrderManagement;
