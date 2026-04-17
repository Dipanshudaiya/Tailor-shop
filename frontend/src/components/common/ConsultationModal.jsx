import React, { useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import { HiOutlineUser, HiOutlinePhone, HiOutlineCalendar } from 'react-icons/hi';
import { validatePhone } from '../../utils/validators';
import { toast } from 'react-hot-toast';
import inquiryService from '../../services/inquiryService';

const ConsultationModal = ({ isOpen, onClose, type = 'consultation', category = 'none' }) => {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) setErrors({ ...errors, [name]: null });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.mobile) newErrors.mobile = 'Mobile number is required';
        else if (!validatePhone(formData.mobile)) newErrors.mobile = 'Must be exactly 10 digits';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);
        try {
            await inquiryService.createInquiry({
                ...formData,
                type: type,
                category: category,
            });
            toast.success('Request sent! Our master tailor will call you back soon.', {
                duration: 5000,
                icon: '📞',
            });
            setFormData({ name: '', mobile: '' });
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Book a Consultation"
        >
            <div className="space-y-6">
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <HiOutlineCalendar size={24} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-white">Arrange a Call Back</h4>
                        <p className="text-xs text-slate-400">Our master tailor will contact you shortly.</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Your Name"
                        name="name"
                        placeholder="John Doe"
                        icon={HiOutlineUser}
                        value={formData.name}
                        onChange={handleInputChange}
                        error={errors.name}
                        required
                    />
                    <Input
                        label="Mobile Number (10 Digits)"
                        name="mobile"
                        placeholder="9876543210"
                        icon={HiOutlinePhone}
                        value={formData.mobile}
                        onChange={handleInputChange}
                        error={errors.mobile}
                        required
                        inputMode="numeric"
                        maxLength={10}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 mt-4"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                            'Request Call Back'
                        )}
                    </button>
                    
                    <p className="text-[10px] text-center text-slate-500 uppercase tracking-widest pt-2">
                        Available 10:00 AM — 08:00 PM
                    </p>
                </form>
            </div>
        </Modal>
    );
};

export default ConsultationModal;
