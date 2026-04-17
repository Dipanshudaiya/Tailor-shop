import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiArrowRight, HiOutlinePhone, HiOutlineTag } from 'react-icons/hi';
import { SERVICES, CATEGORIES } from '../utils/constants';
import Button from '../components/ui/Button';
import BannerCarousel from '../components/common/BannerCarousel';
import ConsultationModal from '../components/common/ConsultationModal';

const Home = () => {
    const [isConsultationOpen, setIsConsultationOpen] = useState(false);
    const [modalType, setModalType] = useState('consultation');
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-24 pb-24"
        >
            {/* Hero Section */}
            <section className="relative min-h-[85vh] flex items-center overflow-hidden">
                <BannerCarousel />

                <div className="container mx-auto px-4 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-3xl space-y-8"
                    >
                        <div className="space-y-4">
                            <span className="text-primary font-bold tracking-[0.4em] uppercase text-sm">
                                Premium Bespoke Tailoring
                            </span>
                            <h1 className="text-6xl md:text-8xl font-display font-bold leading-tight">
                                Crafting Perfect <br />
                                <span className="text-primary italic">Fits</span> for Every <br />
                                Occasion
                            </h1>
                        </div>
                        
                        <p className="text-xl text-slate-400 max-w-xl leading-relaxed">
                            Experience the luxury of high-end tailoring. From bridal wear to corporate suits, we transform fabrics into masterpieces of style.
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Button size="lg" className="group" onClick={() => navigate('/search')}>
                                Explore Shop <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </Button>
                            <Button variant="outline" size="lg" onClick={() => { setModalType('consultation'); setIsConsultationOpen(true); }}>
                                Book Appointment
                            </Button>
                        </div>

                        <div className="flex items-center gap-8 pt-12 border-t border-white/5 max-w-lg">
                            <div>
                                <h4 className="text-2xl font-bold text-white">5k+</h4>
                                <p className="text-xs text-slate-500 uppercase tracking-widest">Happy Clients</p>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div>
                                <h4 className="text-2xl font-bold text-white">20+</h4>
                                <p className="text-xs text-slate-500 uppercase tracking-widest">Master Tailors</p>
                            </div>
                            <div className="w-px h-10 bg-white/10" />
                            <div>
                                <h4 className="text-2xl font-bold text-white">15yr</h4>
                                <p className="text-xs text-slate-500 uppercase tracking-widest">Craft Experience</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Floating Elements / Sale Button */}
                <div className="absolute right-4 md:right-12 bottom-8 md:top-1/2 md:-translate-y-1/2 z-20">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate('/search?discount=true')}
                        className="flex items-center gap-3 bg-gradient-to-br from-primary to-accent p-1.5 md:p-6 rounded-full md:rounded-3xl shadow-2xl border border-white/20 cursor-pointer overflow-hidden group"
                    >
                        {/* Mobile Button Style */}
                        <div className="md:hidden flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-full font-bold text-xs shadow-lg group-hover:bg-dark group-hover:text-white transition-all">
                            <HiOutlineTag size={16} />
                            <span>Claim 20% Off</span>
                        </div>

                        {/* Desktop Box Style */}
                        <div className="hidden md:block">
                            <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-[40px] -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
                            <h3 className="text-white font-display font-bold text-3xl leading-tight mb-2 relative z-10 tracking-tight">
                                Exclusive <br/><span className="text-dark italic">Sale</span>
                            </h3>
                            <p className="text-white/80 text-sm font-medium mb-6 relative z-10">
                                Available on all Collections
                            </p>
                            <div className="inline-block bg-white text-primary text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-wider relative z-10 group-hover:bg-dark group-hover:text-white transition-colors shadow-lg">
                                Shop Now
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Services Section */}
            <section className="container mx-auto px-4">
                <div className="text-center space-y-4 mb-16">
                    <h2 className="text-4xl md:text-5xl font-display font-bold">Our Services</h2>
                    <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {SERVICES.map((service, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -10 }}
                            className="bg-dark-card border border-white/5 rounded-2xl overflow-hidden group hover:border-primary/50 transition-all duration-500"
                        >
                            <div className="h-48 relative overflow-hidden">
                                <img 
                                    src={service.image} 
                                    alt={service.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-dark/40 group-hover:bg-dark/10 transition-colors" />
                            </div>
                            <div className="p-6 space-y-4">
                                <h3 className="font-bold text-xl text-white group-hover:text-primary transition-colors">{service.title}</h3>
                                <ul className="space-y-2">
                                    {service.list.map((item, i) => (
                                        <li key={i} className="text-xs text-slate-400 flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-primary" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <button 
                                    onClick={() => { setModalType(service.title.toLowerCase().includes('fitting') ? 'fitting' : 'consultation'); setIsConsultationOpen(true); }}
                                    className="w-full py-2.5 rounded-lg border border-white/10 text-xs font-bold uppercase tracking-[0.2em] group-hover:bg-primary group-hover:text-white transition-all">
                                    Book Consultation
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Categories Section */}
            <section className="bg-white/3 py-24">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-display font-bold">Shop by Category</h2>
                            <p className="text-slate-400 max-w-lg">Discover our curated collection of styles, fabrics, and designs tailored for your perfect moment.</p>
                        </div>
                        <Button variant="outline" className="group" onClick={() => navigate('/search')}>
                            View All Collections <HiArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                        {CATEGORIES.map((cat, idx) => {
                            const handleCategoryClick = () => {
                                const title = cat.title.toLowerCase();
                                if (title === 'saree') {
                                    navigate('/sarees');
                                } else if (['blouse', 'kurti', 'lehenga', 'dress', 'top', 'skirt'].includes(title)) {
                                    navigate(`/womens/${title}`);
                                } else {
                                    navigate(`/search`);
                                }
                            };
                            return (
                            <motion.div
                                key={idx}
                                whileHover={{ scale: 1.05 }}
                                onClick={handleCategoryClick}
                                className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer"
                            >
                                <img 
                                    src={cat.image} 
                                    alt={cat.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />
                                <div className="absolute bottom-6 left-0 right-0 text-center">
                                    <h4 className="font-display font-bold text-lg text-white group-hover:text-primary transition-colors tracking-tight">
                                        {cat.title}
                                    </h4>
                                </div>
                            </motion.div>
                        )})}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4">
                <div className="relative rounded-[2rem] overflow-hidden bg-primary p-8 md:p-16 flex flex-col items-center text-center space-y-8">
                    {/* Abstract Decorations */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />
                    
                    <h2 className="text-5xl md:text-7xl font-display font-bold text-white tracking-tighter">
                        Ready for Your Perfect <span className="text-dark italic">Fit</span>?
                    </h2>
                    <p className="text-primary-light text-xl md:text-2xl max-w-2xl font-medium">
                        Schedule a free consultation with our master tailors today and experience true bespoke luxury.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button 
                            onClick={() => setIsConsultationOpen(true)}
                            className="px-10 py-5 bg-dark text-white font-bold rounded-2xl hover:bg-dark/90 transition-all flex items-center gap-4 text-lg shadow-2xl">
                            <HiOutlinePhone size={24} />
                            Book Appointment Now
                        </button>
                    </div>
                </div>
            </section>

            <ConsultationModal 
                isOpen={isConsultationOpen} 
                onClose={() => setIsConsultationOpen(false)} 
                type={modalType}
            />
        </motion.div>
    );
};

export default Home;
