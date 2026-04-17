import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from 'react-icons/hi';
import useAuthStore from '../../store/authStore';
import { validateEmail, validateNumericPassword } from '../../utils/validators';
import { toast } from 'react-hot-toast';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, register, loading } = useAuthStore();

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: null });
    };

    const validate = () => {
        const newErrors = {};
        if (!isLogin && !formData.name) newErrors.name = 'Name is required';
        if (!formData.email) newErrors.email = 'Email is required';
        else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
        
        if (!formData.password) newErrors.password = 'Password is required';
        else if (!validateNumericPassword(formData.password)) newErrors.password = 'Must be 6+ digits';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            if (isLogin) {
                await login(formData.email, formData.password);
                toast.success('Welcome back!');
            } else {
                await register(formData.name, formData.email, formData.password);
                toast.success('Registration successful!');
            }
            onClose();
        } catch (error) {
            toast.error(error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isLogin ? 'Welcome Back' : 'Create Account'}
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                    <Input
                        label="Full Name"
                        name="name"
                        placeholder="John Doe"
                        icon={HiOutlineUser}
                        value={formData.name}
                        onChange={handleInputChange}
                        error={errors.name}
                        required
                    />
                )}
                <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    icon={HiOutlineMail}
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    required
                />
                <Input
                    label="Password (6+ Digits)"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    icon={HiOutlineLockClosed}
                    value={formData.password}
                    onChange={handleInputChange}
                    error={errors.password}
                    required
                    inputMode="numeric"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full btn-primary py-3.5 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        isLogin ? 'Login to Shop' : 'Join Tailor Shop'
                    )}
                </button>

                <div className="text-center">
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setErrors({});
                        }}
                        className="text-slate-400 hover:text-white transition-colors text-sm"
                    >
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <span className="text-primary font-bold">{isLogin ? 'Sign Up' : 'Login'}</span>
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default AuthModal;
