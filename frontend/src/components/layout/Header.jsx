import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineShoppingBag, HiOutlineSearch, HiOutlineUser,
    HiChevronDown, HiOutlineLogout, HiMenu, HiX,
    HiOutlineHome, HiOutlineSparkles, HiOutlineTag,
    HiOutlineColorSwatch, HiOutlineMail
} from 'react-icons/hi';
import { NAV_LINKS } from '../../utils/constants';
import useAuthStore from '../../store/authStore';
import useCartStore from '../../store/cartStore';
import ConsultationModal from '../common/ConsultationModal';

const MOBILE_NAV = [
    { title: 'Home',     path: '/',        icon: <HiOutlineHome size={20} /> },
    { title: "Men's",    path: '/mens',    icon: <HiOutlineUser size={20} /> },
    { title: "Women's",  path: '/womens',  icon: <HiOutlineSparkles size={20} /> },
    { title: 'Sarees',   path: '/sarees',  icon: <HiOutlineTag size={20} /> },
    { title: 'Fabrics',  path: '/fabrics', icon: <HiOutlineColorSwatch size={20} /> },
    { title: 'Contact',  path: '/contact', icon: <HiOutlineMail size={20} /> },
];

const Header = () => {
    const { user, logout } = useAuthStore();
    const { items } = useCartStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [consultationModal, setConsultationModal] = useState({
        isOpen: false, type: 'consultation', category: 'none', title: ''
    });

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const closeSidebar = () => setIsMobileMenuOpen(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMobileMenuOpen]);

    /* ─── sidebar styles (all inline to avoid Tailwind color issues) ─── */
    const sidebarStyle = {
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: '280px', maxWidth: '80vw',
        backgroundColor: '#111827',
        borderRight: '1px solid rgba(255,255,255,0.08)',
        zIndex: 200,
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
    };
    const navLinkBase = (active) => ({
        display: 'flex', alignItems: 'center', gap: '14px',
        padding: '13px 18px', borderRadius: '10px',
        fontWeight: '600', fontSize: '15px',
        color: active ? '#a78bfa' : '#e2e8f0',
        backgroundColor: active ? 'rgba(167,139,250,0.1)' : 'transparent',
        textDecoration: 'none',
        marginBottom: '4px',
        transition: 'background 0.15s',
    });

    return (
        <header className="sticky top-0 z-50 bg-dark/80 backdrop-blur-lg border-b border-white/10">
            <div className="container mx-auto px-4 h-20 grid grid-cols-[1fr_auto_1fr] lg:flex items-center lg:justify-between">

                {/* Mobile burger (left) */}
                <div className="flex lg:hidden items-center">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 text-white"
                        aria-label="Open menu"
                    >
                        <HiMenu size={28} />
                    </button>
                </div>

                {/* Logo */}
                <div className="flex justify-center lg:justify-start">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center overflow-hidden rounded-lg">
                            <img src="/logo.png" alt="As You Like Tailors Logo" className="w-full h-full object-cover" />
                        </div>
                        <span className="font-display font-bold text-lg md:text-2xl tracking-tighter group-hover:text-primary transition-colors whitespace-nowrap">
                            As You Like<span className="text-primary ml-1">TAILOR'S</span>
                        </span>
                    </Link>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-4">
                    {(user?.role === 'admin' || user?.email === 'admin@tailorshop.com') && (
                        <Link
                            to="/admin"
                            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary border border-primary text-white font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-primary transition-all shadow-lg shadow-primary/40 animate-pulse"
                        >
                            Admin Dashboard
                        </Link>
                    )}
                    {NAV_LINKS.map((link) => (
                        <div
                            key={link.title}
                            className="relative group"
                            onMouseEnter={() => setActiveDropdown(link.submenu ? link.title : null)}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <Link
                                to={link.path}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 font-bold text-xs uppercase tracking-wider text-slate-300 hover:text-white hover:bg-primary/20 hover:border-primary/50 transition-all"
                            >
                                {link.title}
                                {link.submenu && <HiChevronDown className={`transition-transform ${activeDropdown === link.title ? 'rotate-180' : ''}`} />}
                            </Link>
                            {link.submenu && (
                                <div className={`absolute left-0 top-full pt-2 transition-all duration-200 ${activeDropdown === link.title ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                                    <div className="glass-panel w-48 p-2 shadow-2xl">
                                        {link.submenu.map((sub) => (
                                            <Link key={sub.title} to={sub.path} className="block px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                                                {sub.title}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Right icons */}
                <div className="flex items-center justify-end gap-2 md:gap-4">
                    <button onClick={() => navigate('/search')} className="p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-full border border-white/10 transition-all">
                        <HiOutlineSearch size={22} />
                    </button>
                    {user ? (
                        <div className="flex items-center gap-2 md:gap-4 pl-2 md:pl-4 border-l border-white/10">
                            <Link to="/profile" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/50 flex items-center justify-center relative">
                                    <span className="text-primary font-bold text-xs uppercase">{user.name.charAt(0)}</span>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-dark" />
                                </div>
                                <span className="hidden md:block text-sm font-medium text-slate-300 group-hover:text-white">{user.name.split(' ')[0]}</span>
                            </Link>
                            <button onClick={handleLogout} className="hidden md:block p-2 text-slate-400 hover:text-red-400 transition-colors">
                                <HiOutlineLogout size={22} />
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-primary/50 hover:bg-primary/5 transition-all">
                            <div className="w-2 h-2 rounded-full bg-red-500" />
                            <span className="text-sm font-medium text-slate-300">Login</span>
                        </Link>
                    )}
                    <Link to="/cart" className="relative p-2 text-slate-300 hover:text-white hover:bg-white/5 rounded-full border border-white/10 transition-all">
                        <HiOutlineShoppingBag size={22} />
                        {items.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-dark">
                                {items.length}
                            </span>
                        )}
                    </Link>
                </div>
            </div>

            {/* ════════ MOBILE SIDEBAR ════════ */}
            {typeof document !== 'undefined' && document.body && 
                createPortal(
                    <AnimatePresence>
                        {isMobileMenuOpen && (
                            <>
                                {/* Backdrop */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={closeSidebar}
                                    style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1999 }}
                                />

                                {/* Sidebar panel */}
                                <motion.div
                                    initial={{ x: -280 }}
                                    animate={{ x: 0 }}
                                    exit={{ x: -280 }}
                                    transition={{ type: 'tween', duration: 0.25 }}
                                    style={{...sidebarStyle, zIndex: 2000}}
                                >
                                    {/* Header */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 18px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                                        <Link to="/" onClick={closeSidebar} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                                <img src="/logo.png" alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            </div>
                                            <div>
                                                <div style={{ color: '#fff', fontWeight: '800', fontSize: '13px', letterSpacing: '0.1em' }}>AS YOU LIKE</div>
                                                <div style={{ color: '#7c3aed', fontWeight: '700', fontSize: '9px', letterSpacing: '0.2em' }}>TAILOR'S</div>
                                            </div>
                                        </Link>
                                        <button onClick={closeSidebar} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '50%', padding: '8px', cursor: 'pointer', color: '#94a3b8', display: 'flex' }}>
                                            <HiX size={20} />
                                        </button>
                                    </div>

                                    {/* Nav list */}
                                    <nav style={{ padding: '12px 12px', flex: 1 }}>
                                        <p style={{ color: '#64748b', fontSize: '10px', fontWeight: '700', letterSpacing: '0.15em', padding: '4px 8px 10px', textTransform: 'uppercase' }}>Navigation</p>
                                        {MOBILE_NAV.map((link) => {
                                            const active = location.pathname === link.path;
                                            return (
                                                <Link key={link.path} to={link.path} onClick={closeSidebar} style={navLinkBase(active)}>
                                                    <span style={{ color: active ? '#a78bfa' : '#64748b', flexShrink: 0 }}>{link.icon}</span>
                                                    <span>{link.title}</span>
                                                </Link>
                                            );
                                        })}

                                        {/* Divider */}
                                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '12px 6px' }} />

                                        {/* Cart */}
                                        <Link to="/cart" onClick={closeSidebar} style={navLinkBase(location.pathname === '/cart')}>
                                            <span style={{ color: '#64748b', flexShrink: 0 }}><HiOutlineShoppingBag size={20} /></span>
                                            <span>Cart</span>
                                            {items.length > 0 && (
                                                <span style={{ marginLeft: 'auto', minWidth: '22px', height: '22px', background: '#7c3aed', color: '#fff', fontSize: '10px', fontWeight: '700', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    {items.length}
                                                </span>
                                            )}
                                        </Link>

                                        {/* Admin Dashboard (Mobile) */}
                                        {(user?.role === 'admin' || user?.email === 'admin@tailorshop.com') && (
                                            <>
                                                <Link to="/admin" onClick={closeSidebar} style={navLinkBase(location.pathname === '/admin')}>
                                                    <span style={{ color: '#a78bfa', flexShrink: 0 }}><HiOutlineSparkles size={20} /></span>
                                                    <span style={{ color: '#a78bfa', fontWeight: '800' }}>Admin Dashboard</span>
                                                </Link>
                                                <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '12px 6px' }} />
                                            </>
                                        )}

                                        {/* User section */}
                                        {user ? (
                                            <>
                                                <Link to="/profile" onClick={closeSidebar} style={navLinkBase(false)}>
                                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(124,58,237,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#a78bfa', fontWeight: '700', fontSize: '12px', flexShrink: 0 }}>
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span>{user.name}</span>
                                                </Link>
                                                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '13px 18px', borderRadius: '10px', fontWeight: '600', fontSize: '15px', color: '#f87171', background: 'transparent', border: 'none', width: '100%', cursor: 'pointer', marginBottom: '4px' }}>
                                                    <HiOutlineLogout size={20} />
                                                    <span>Logout</span>
                                                </button>
                                            </>
                                        ) : (
                                            <Link to="/login" onClick={closeSidebar} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: '10px', fontWeight: '700', fontSize: '14px', color: '#fff', background: '#7c3aed', textDecoration: 'none' }}>
                                                <HiOutlineUser size={18} />
                                                <span>Login / Sign Up</span>
                                            </Link>
                                        )}
                                    </nav>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>,
                    document.body
                )
            }

            <ConsultationModal
                isOpen={consultationModal.isOpen}
                onClose={() => setConsultationModal({ ...consultationModal, isOpen: false })}
                type={consultationModal.type}
                category={consultationModal.category}
                title={consultationModal.title}
            />
        </header>
    );
};

export default Header;
