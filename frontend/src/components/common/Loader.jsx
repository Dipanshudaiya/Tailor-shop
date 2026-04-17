import React from 'react';

const Loader = () => {
    return (
        <div className="fixed inset-0 z-[9999] bg-dark flex flex-col items-center justify-center p-4">
            <div className="relative w-24 h-24">
                {/* Outer ring */}
                <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                {/* Spinning ring */}
                <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                
                {/* Center dot */}
                <div className="absolute inset-[35%] bg-primary rounded-full animate-pulse shadow-xl shadow-primary/50"></div>
            </div>
            
            <div className="mt-8 flex flex-col items-center gap-2">
                <span className="font-display font-bold text-2xl tracking-widest text-white animate-pulse">
                    TAILOR<span className="text-primary">SHOP</span>
                </span>
                <span className="text-slate-500 text-xs font-semibold tracking-[0.3em] uppercase">
                    Loading Experience
                </span>
            </div>
            
            {/* Background effects */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] animation-delay-2000 animate-pulse"></div>
            </div>
        </div>
    );
};

export default Loader;
