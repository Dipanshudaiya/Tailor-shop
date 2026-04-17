import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import banner1 from '../../assets/banner_1.png';
import banner2 from '../../assets/banner_2.png';
import banner3 from '../../assets/banner_3.png';
import banner4 from '../../assets/banner_4.png';

const BANNER_IMAGES = [
    {
        url: banner1,
        title: "Bespoke Excellence",
        subtitle: "Crafted for Perfection"
    },
    {
        url: banner2,
        title: "Masterful Precision",
        subtitle: "Every Stitch Matters"
    },
    {
        url: banner3,
        title: "Timeless Style",
        subtitle: "The Art of Elegant Tailoring"
    },
    {
        url: banner4,
        title: "Premium Fabrics",
        subtitle: "Sourced from the Finest Mills"
    }
];

const BannerCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % BANNER_IMAGES.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="absolute inset-0 z-0">
            <AnimatePresence>
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 0.3, scale: 1.05 }}
                    exit={{ opacity: 0, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    <img 
                        src={BANNER_IMAGES[currentIndex].url} 
                        className="w-full h-full object-cover"
                        alt={BANNER_IMAGES[currentIndex].title}
                    />
                </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent" />
            
            {/* Indicators */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20">
                {BANNER_IMAGES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        className={`h-1 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-12 bg-primary' : 'w-4 bg-white/20'}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default BannerCarousel;
