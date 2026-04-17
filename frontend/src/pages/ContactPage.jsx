import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiOutlineLocationMarker, HiOutlinePhone, HiOutlineMail, HiOutlineClock } from 'react-icons/hi';
import Button from '../components/ui/Button';
import masterTailorImg from '../assets/master_tailor.png';
import inquiryService from '../services/inquiryService';
import { toast } from 'react-hot-toast';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await inquiryService.createInquiry({
                ...formData,
                type: 'contact',
            });
            toast.success('Message sent! We will get back to you soon.');
            setFormData({ name: '', email: '', mobile: '', message: '' });
        } catch (error) {
            toast.error('Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        { icon: HiOutlineLocationMarker, title: 'Our Studio', details: '123 Tailor Street, Fashion District, Mumbai, MH 400001' },
        { icon: HiOutlinePhone, title: 'Call Us', details: '+91 98765 43210' },
        { icon: HiOutlineMail, title: 'Email Us', details: 'hello@tailorshop.com' },
        { icon: HiOutlineClock, title: 'Opening Hours', details: 'Mon - Sun: 10:00 AM - 08:00 PM' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-24"
        >
            <div className="container mx-auto px-4 space-y-24">
                <header className="text-center max-w-3xl mx-auto space-y-6">
                    <span className="text-primary font-bold tracking-[0.4em] uppercase text-xs">Get in Touch</span>
                    <h1 className="text-6xl font-display font-bold">Contact <span className="text-primary">Us</span></h1>
                    <p className="text-slate-400 text-lg">Visit our studio for a personal consultation or reach out to us for any inquiries about our bespoke services.</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Visual / Image */}
                    <div className="relative aspect-video lg:aspect-auto rounded-[2rem] overflow-hidden shadow-2xl">
                        <img 
                            src={masterTailorImg} 
                            className="w-full h-full object-cover"
                            alt="Master tailor working"
                        />
                        <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
                        <div className="absolute bottom-8 left-8 p-6 glass-panel max-w-xs space-y-2">
                            <h4 className="font-bold text-white">Shri. Master Ji</h4>
                            <p className="text-xs text-slate-300">Head Master Tailor & Founder</p>
                        </div>
                    </div>

                    {/* Contact Details */}
                    <div className="space-y-12 py-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {contactInfo.map((info, idx) => (
                                <div key={idx} className="space-y-4 group">
                                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all shadow-lg border border-white/10">
                                        <info.icon size={24} />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-white tracking-tight">{info.title}</h4>
                                        <p className="text-sm text-slate-400 leading-relaxed">{info.details}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 bg-dark-card border border-white/5 rounded-[2rem] space-y-6 shadow-2xl font-bold">
                            <h3 className="text-2xl font-display font-bold text-white">Send a Message</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Your Name" 
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                                <input 
                                    type="email" 
                                    placeholder="Your Email" 
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                                <input 
                                    type="tel" 
                                    placeholder="Your Mobile Number" 
                                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors sm:col-span-2"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    required
                                    maxLength={10}
                                />
                            </div>
                            <textarea 
                                placeholder="Tell us about your requirements..." 
                                rows={4} 
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors resize-none"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            />
                            <Button type="submit" disabled={loading} className="w-full py-4 text-white">
                                {loading ? 'Sending...' : 'Send Message'}
                            </Button>
                        </form>
                    </div>
                </div>

                {/* Map Implementation */}
                <div className="h-[400px] w-full bg-dark-card border border-white/5 rounded-[2rem] flex items-center justify-center relative overflow-hidden shadow-2xl">
                     <iframe 
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120612.01633008453!2d72.76634594212711!3d19.14441584617743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce0e056cabbf%3A0xb7a3809b4f620e7b!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1712497600000!5m2!1sen!2sin" 
                        //  src="https://www.openstreetmap.org/export/embed.html?bbox=73.25%2C28.00%2C73.35%2C28.05&layer=mapnik&marker=28.0229%2C73.3119
                        width="100%" 
                        height="100%" 
                        style={{ border: 0 }} 
                        allowFullScreen="" 
                        loading="lazy" 
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Shop Location"
                    ></iframe>
                </div>
            </div>
        </motion.div>
    );
};

export default ContactPage;
