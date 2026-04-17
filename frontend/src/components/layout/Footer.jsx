import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter, FaPinterestP } from 'react-icons/fa';
import { useState } from 'react';
import inquiryService from '../../services/inquiryService';
import { toast } from 'react-hot-toast';

const Footer = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleNewsletterSubmit = async (e) => {
        e.preventDefault();
        if (!email) return;
        
        setLoading(true);
        try {
            await inquiryService.createInquiry({
                name: 'Newsletter Subscriber',
                email: email,
                mobile: '0000000000',
                message: 'Subscribed to newsletter from footer',
                type: 'newsletter'
            });
            toast.success('Successfully subscribed!', {
                icon: '📩',
                style: {
                    background: '#1E293B',
                    color: '#fff',
                    borderRadius: '10px'
                }
            });
            setEmail('');
        } catch (error) {
            toast.error('Failed to subscribe. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    return (
        <footer className="bg-dark/50 border-t border-white/5 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-2xl tracking-tighter text-white">
                                As You Like <span className="text-primary">TAILOR</span>
                            </span>
                        </div>
                        <p className="text-slate-400 leading-relaxed max-w-xs">
                            Crafting perfect fits for every occasion. Our master tailors ensure every stitch tells a story of elegance and quality.
                        </p>
                        <div className="flex items-center gap-4">
                            {[
                                { Icon: FaFacebookF, url: 'https://facebook.com' },
                                { Icon: FaInstagram, url: 'https://instagram.com' },
                                { Icon: FaTwitter, url: 'https://twitter.com' },
                                { Icon: FaPinterestP, url: 'https://pinterest.com' }
                            ].map((social, idx) => (
                                <a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all">
                                    <social.Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="font-display text-white font-bold text-lg mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            {[
                                { title: 'Collections', path: '/search' },
                                { title: 'Men\'s Wear', path: '/mens' },
                                { title: 'Women\'s Wear', path: '/womens' },
                                { title: 'Saree Shop', path: '/sarees' },
                                { title: 'Contact Us', path: '/contact' }
                            ].map((item) => (
                                <li key={item.title}>
                                    <Link to={item.path} className="text-slate-400 hover:text-primary transition-colors hover:translate-x-1 inline-block transform">
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Category */}
                    <div>
                        <h4 className="font-display text-white font-bold text-lg mb-6">Categories</h4>
                        <ul className="space-y-4">
                            {[
                                { title: 'Men\'s Wear', path: '/mens' },
                                { title: 'Women\'s Wear', path: '/womens' },
                                { title: 'Saree Collection', path: '/sarees' },
                                { title: 'Premium Fabrics', path: '/fabrics' },
                                { title: 'Alterations', path: '/services/alterations' }
                            ].map((item) => (
                                <li key={item.title}>
                                    <Link to={item.path} className="text-slate-400 hover:text-primary transition-colors hover:translate-x-1 inline-block transform">
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-display text-white font-bold text-lg mb-6">Newsletter</h4>
                        <p className="text-slate-400 mb-6">Subscribe for exclusive offers and style tips.</p>
                        <form onSubmit={handleNewsletterSubmit} className="relative">
                            <input
                                type="email"
                                placeholder="Your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                            />
                            <button 
                                type="submit"
                                disabled={loading}
                                className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-bold disabled:opacity-50"
                            >
                                {loading ? '...' : 'JOIN'}
                            </button>
                        </form>
                    </div>
                </div>

                <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-sm">
                    <p>© 2024 As You Like Tailors. All rights reserved.</p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-slate-300">Privacy Policy</a>
                        <a href="#" className="hover:text-slate-300">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
