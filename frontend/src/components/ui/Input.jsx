import React from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, error, icon: Icon, required = false, ...props }) => {
    return (
        <div className="space-y-1.5 w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-400 pl-1">
                    {label} {required && <span className="text-primary">*</span>}
                </label>
            )}
            <div className="relative group">
                {Icon && (
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors">
                        <Icon size={18} />
                    </div>
                )}
                <input
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`
                        w-full bg-white/5 border rounded-xl transition-all duration-300 outline-none
                        py-3 ${Icon ? 'pl-11 pr-4' : 'px-4'}
                        ${error 
                            ? 'border-red-500/50 bg-red-500/5 focus:border-red-500 focus:ring-4 focus:ring-red-500/10' 
                            : 'border-white/10 focus:border-primary focus:ring-4 focus:ring-primary/10 hover:border-white/20'
                        }
                    `}
                    {...props}
                />
            </div>
            {error && <p className="text-xs text-red-500 pl-1 animate-pulse">{error}</p>}
        </div>
    );
};

export default Input;
