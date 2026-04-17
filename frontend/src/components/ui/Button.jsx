import React from 'react';

const Button = ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    className = '', 
    loading = false, 
    disabled = false, 
    ...props 
}) => {
    const variants = {
        primary: 'btn-primary',
        outline: 'btn-outline',
        ghost: 'text-slate-400 hover:text-white hover:bg-white/5',
        accent: 'bg-accent text-dark font-bold hover:bg-accent/90 transition-colors',
    };

    const sizes = {
        sm: 'px-4 py-1.5 text-sm',
        md: 'px-6 py-2.5',
        lg: 'px-8 py-4 text-lg',
    };

    return (
        <button
            className={`
                inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all
                ${variants[variant]}
                ${sizes[size]}
                ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}
                ${className}
            `}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
            )}
            {children}
        </button>
    );
};

export default Button;
