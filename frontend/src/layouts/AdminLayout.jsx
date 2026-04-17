import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { HiOutlineChartBar, HiOutlineShoppingBag, HiOutlineUsers, HiOutlineLogout, HiOutlineViewGrid, HiOutlineMail } from 'react-icons/hi';
import useAuthStore from '../store/authStore';

const AdminLayout = () => {
    const { logout } = useAuthStore();
    const navigate = useNavigate();

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

    return (
        <div className="flex min-h-[calc(100vh-80px)]">
            {/* Sidebar */}
            <aside className="w-72 bg-dark/30 border-r border-white/5 p-8 flex flex-col justify-between shrink-0">
                <div className="space-y-12">
                    <div className="space-y-4">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] pl-4">Admin Portal</p>
                        <nav className="space-y-2">
                            {sidebarLinks.map((link) => (
                                <NavLink
                                    key={link.title}
                                    to={link.path}
                                    end={link.path === '/admin'}
                                    className={({ isActive }) => `
                                        flex items-center gap-4 px-4 py-4 rounded-2xl transition-all font-medium
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
                    className="flex items-center gap-4 px-4 py-4 rounded-2xl text-slate-500 hover:text-red-500 hover:bg-red-500/10 transition-all font-medium border border-transparent hover:border-red-500/20"
                >
                    <HiOutlineLogout size={20} />
                    Logout
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-grow">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
