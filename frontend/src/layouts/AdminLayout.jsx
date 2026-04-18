import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { HiOutlineChartBar, HiOutlineShoppingBag, HiOutlineUsers, HiOutlineLogout, HiOutlineViewGrid, HiOutlineMail, HiMenu, HiX } from 'react-icons/hi';
import { AnimatePresence, motion } from 'framer-motion';
import useAuthStore from '../store/authStore';

const AdminLayout = () => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const sidebarLinks = [
        { title: 'Dashboard', path: '/admin', icon: HiOutlineViewGrid },
        { title: 'Products', path: '/admin/products', icon: HiOutlineChartBar },
        { title: 'Orders', path: '/admin/orders', icon: HiOutlineShoppingBag },
        { title: 'Users', path: '/admin/users', icon: HiOutlineUsers },
        { title: 'Inquiries', path: '/admin/inquiries', icon: HiOutlineMail },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full justify-between p-6">
            <div className="space-y-8">
                <div className="space-y-4">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] pl-4">Admin Portal</p>
                    <nav className="space-y-1">
                        {sidebarLinks.map((link) => (
                            <NavLink
                                key={link.title}
                                to={link.path}
                                end={link.path === '/admin'}
                                onClick={() => setIsSidebarOpen(false)}
                                className={({ isActive }) => `
                                    flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all font-medium
                                    ${isActive ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}
                                `}
                            >
                                <link.icon size={20} />
                                {link.title}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </div>

            <button 
                onClick={handleLogout}
                className="flex items-center gap-4 px-4 py-3.5 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all font-medium border border-transparent hover:border-red-500/20"
            >
                <HiOutlineLogout size={20} />
                Logout
            </button>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-dark">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-dark-card border-b border-white/5 sticky top-0 z-40">
                <span className="font-display font-bold text-lg">Admin Panel</span>
                <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-slate-300 hover:text-white bg-white/5 rounded-lg"
                >
                    {isSidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
                </button>
            </div>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex w-72 bg-dark-card/50 border-r border-white/5 shrink-0 sticky top-20 h-[calc(100vh-80px)]">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        />
                        <motion.aside 
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'tween', duration: 0.3 }}
                            className="fixed inset-y-0 left-0 w-72 bg-dark-card z-50 lg:hidden border-r border-white/10"
                        >
                            <SidebarContent />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-grow p-4 md:p-8 lg:p-12 overflow-x-hidden">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
