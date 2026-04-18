import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineMail, HiOutlineLockClosed, HiArrowRight } from 'react-icons/hi';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import Button from '../../components/ui/Button';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            if (data) {
                toast.success(`Welcome back, ${data.name}!`);
                if (data.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }
        } catch (error) {
            toast.error(error || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel w-full max-w-md p-8 md:p-12 space-y-8"
            >
                <div className="text-center space-y-2">
                    <h1 className="text-4xl font-display font-bold">Welcome Back</h1>
                    <p className="text-slate-400">Log in to your bespoke tailoring account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 ml-1">Email Address</label>
                        <div className="relative group">
                            <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                            <input 
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-dark/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary transition-all text-white"
                                placeholder="name@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-medium text-slate-300">Password</label>
                            <Link to="/forgot-password" size="xs" className="text-xs text-primary hover:text-white transition-colors">Forgot?</Link>
                        </div>
                        <div className="relative group">
                            <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={20} />
                            <input 
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-dark/50 border border-slate-700 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary transition-all text-white"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <Button 
                        type="submit" 
                        onClick={() => console.log('Login button clicked')}
                        className="w-full h-12 text-lg group" 
                        loading={loading}
                    >
                        Sign In <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </form>

                <div className="text-center pt-4">
                    <p className="text-slate-400">
                        Don't have an account? {' '}
                        <Link to="/signup" className="text-primary font-bold hover:text-white transition-colors">
                            Create Account
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
