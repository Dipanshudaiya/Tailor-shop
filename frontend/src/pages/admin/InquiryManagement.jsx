import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMail, HiOutlinePhone, HiOutlineUser, HiOutlineClock, HiOutlineFilter, HiOutlineExternalLink, HiCheck, HiTrash } from 'react-icons/hi';
import inquiryService from '../../services/inquiryService';
import { toast } from 'react-hot-toast';

const InquiryManagement = () => {
    const [inquiries, setInquiries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'mens-fitting', label: 'Custom Fitting (Men)' },
        { id: 'womens-fitting', label: 'Custom Fitting (Women)' },
        { id: 'sarees-enquiry', label: 'Enquire Now (Sarees)' },
        { id: 'fabrics-advice', label: 'Expert Advice (Fabrics)' },
        { id: 'messages', label: 'Other Messages' },
    ];

    useEffect(() => {
        fetchInquiries();
    }, []);

    const fetchInquiries = async () => {
        setLoading(true);
        try {
            const data = await inquiryService.getInquiries();
            setInquiries(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to fetch inquiries');
            setInquiries([]);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await inquiryService.updateInquiryStatus(id, status);
            toast.success('Status updated');
            fetchInquiries();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this inquiry?')) return;
        try {
            await inquiryService.deleteInquiry(id);
            toast.success('Inquiry deleted successfully');
            fetchInquiries();
        } catch (error) {
            toast.error('Failed to delete inquiry');
        }
    };

    const filteredInquiries = inquiries?.filter(i => {
        if (activeTab === 'all') return true;
        if (activeTab === 'mens-fitting')    return i.category === 'men';
        if (activeTab === 'womens-fitting')  return i.category === 'women';
        if (activeTab === 'sarees-enquiry')  return i.category === 'sarees';
        if (activeTab === 'fabrics-advice')  return i.category === 'fabrics';
        if (activeTab === 'messages')        return i.type === 'contact';
        return false;
    }) || [];


    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <header>
                    <h1 className="text-3xl font-display font-bold text-white">Customer Inquiries</h1>
                    <p className="text-slate-400">Manage all customer requests and consultations from one place.</p>
                </header>
                <button 
                    onClick={fetchInquiries}
                    className="btn-secondary flex items-center gap-2"
                >
                    <HiOutlineClock className={loading ? 'animate-spin' : ''} />
                    Refresh Data
                </button>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-2.5 rounded-xl border text-sm font-bold transition-all whitespace-nowrap ${
                            activeTab === tab.id 
                                ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="glass-panel overflow-hidden">
                {loading ? (
                    <div className="p-20 flex flex-col items-center justify-center space-y-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-slate-400 animate-pulse">Loading inquiries...</p>
                    </div>
                ) : filteredInquiries.length === 0 ? (
                    <div className="p-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-600">
                            <HiOutlineMail size={40} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">No inquiries found</h3>
                            <p className="text-slate-400">Requests will appear here as customers fill out forms.</p>
                        </div>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-white">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-white">Customer</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-white">Type</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-white">Message / Details</th>
                                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-white text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-white">
                                {filteredInquiries.map((inquiry) => (
                                    <tr key={inquiry._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium">
                                                {new Date(inquiry.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="text-[10px] text-slate-500">
                                                {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                                    {inquiry.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="text-sm font-bold">{inquiry.name}</div>
                                                    <div className="text-xs text-slate-400 flex items-center gap-1">
                                                        <HiOutlinePhone className="text-primary" /> {inquiry.mobile}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                                inquiry.type === 'consultation' ? 'bg-blue-500/20 text-blue-400' :
                                                inquiry.type === 'fitting' ? 'bg-purple-500/20 text-purple-400' :
                                                inquiry.type === 'contact' ? 'bg-green-500/20 text-green-400' :
                                                inquiry.type === 'enquiry' ? 'bg-orange-500/20 text-orange-400' :
                                                inquiry.type === 'advice' ? 'bg-cyan-500/20 text-cyan-400' :
                                                'bg-yellow-500/20 text-yellow-500'
                                            }`}>
                                                {inquiry.type}
                                            </span>
                                            {inquiry.category && inquiry.category !== 'none' && (
                                                <span className="ml-2 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/5 text-slate-400 border border-white/10">
                                                    {inquiry.category}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-slate-400 max-w-xs truncate group-hover:whitespace-normal group-hover:overflow-visible group-hover:max-w-none transition-all">
                                                {inquiry.message || inquiry.email || 'Request for callback'}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {inquiry.status === 'pending' ? (
                                                    <button 
                                                        onClick={() => handleStatusUpdate(inquiry._id, 'read')}
                                                        className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-all"
                                                        title="Mark as Read"
                                                    >
                                                        <HiCheck size={18} />
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] text-slate-500 font-bold uppercase px-2">Read</span>
                                                )}
                                                <button 
                                                    onClick={() => handleDelete(inquiry._id)}
                                                    className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <HiTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InquiryManagement;
