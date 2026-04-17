import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiCheckCircle, HiArrowRight } from 'react-icons/hi';
import Button from '../components/ui/Button';

const SuccessPage = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-24 min-h-[80vh] flex items-center justify-center"
        >
            <div className="container mx-auto px-4 max-w-xl text-center space-y-12 relative">
                {/* Background Decoration */}
                <div className="absolute inset-0 -z-10 bg-primary/5 blur-[100px] rounded-full scale-150 transform animate-pulse" />

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                    className="w-32 h-32 bg-primary text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-primary/40 text-6xl"
                >
                    <HiCheckCircle />
                </motion.div>

                <div className="space-y-4">
                    <h1 className="text-5xl md:text-6xl font-display font-bold">Booking <span className="text-primary italic">Confirmed</span></h1>
                    <p className="text-xl text-slate-400">Thank you for choosing TailorShop. Your bespoke journey has officially begun!</p>
                </div>

                <div className="p-8 bg-dark-card border border-white/5 rounded-[2rem] space-y-4 text-sm text-slate-400 max-w-sm mx-auto shadow-xl">
                    <p className="flex justify-between"><span>Status:</span> <span className="text-green-500 font-bold uppercase tracking-widest">SUCCESS</span></p>
                    <p className="flex justify-between"><span>Estimate:</span> <span className="text-white font-bold">₹ - Pending Consultation</span></p>
                    <div className="pt-4 border-t border-white/10">
                        <p className="text-xs leading-relaxed text-slate-500">
                             🎉 Our master tailor will call you within 24 hours to confirm your measurements and final quote.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/" className="w-full sm:w-auto">
                        <Button size="lg" className="w-full">Return Home</Button>
                    </Link>
                    <Link to="/profile" className="w-full sm:w-auto">
                        <Button variant="outline" size="lg" className="w-full">View My Orders <HiArrowRight size={20} className="ml-2" /></Button>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default SuccessPage;
