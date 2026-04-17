import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCheck, HiOutlineCreditCard, HiOutlineTruck, HiOutlineShieldCheck } from 'react-icons/hi';
import useCartStore from '../store/cartStore';
import useAuthStore from '../store/authStore';
import orderService from '../services/orderService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { toast } from 'react-hot-toast';

const CheckoutPage = () => {
    const { items, getTotalPrice, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        zip: '',
        phone: '',
    });

    const [payment, setPayment] = useState('cod');

    const handleAddressChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleBooking = async () => {
        const validItems = items.filter(item => item && item.product);
        
        if (validItems.length === 0) {
            toast.error('Your cart contains invalid items. Please re-add products to cart.');
            return;
        }

        setLoading(true);
        try {
            const order = {
                items: validItems,
                shippingAddress: address,
                paymentMethod: payment,
                totalPrice: getTotalPrice(),
            };
            await orderService.createOrder(order);
            clearCart();
            navigate('/success');
        } catch (error) {
            toast.error(error);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, title: 'Shipping', icon: HiOutlineTruck },
        { id: 2, title: 'Payment', icon: HiOutlineCreditCard },
        { id: 3, title: 'Confirmation', icon: HiOutlineShieldCheck },
    ];

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pt-32 pb-24"
        >
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Stepper */}
                <div className="mb-16 relative w-full max-w-lg mx-auto">
                    <div className="absolute h-px bg-white/10 left-[15%] right-[15%] sm:left-1/4 sm:right-1/4 top-6 -z-10" />
                    <div className="flex items-center justify-between px-2 sm:px-0 sm:justify-center sm:gap-16">
                        {steps.map((s) => (
                            <div key={s.id} className="flex flex-col items-center gap-3 w-1/3 sm:w-auto">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step >= s.id ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-dark-card border-white/10 text-slate-500'}`}>
                                    {step > s.id ? <HiOutlineCheck size={24} /> : <s.icon size={20} />}
                                </div>
                                <span className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-center ${step >= s.id ? 'text-primary' : 'text-slate-500'}`}>{s.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Form Area */}
                    <div className="lg:col-span-2">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-dark-card border border-white/5 p-8 rounded-[2rem] space-y-8"
                                >
                                    <h2 className="text-3xl font-display font-bold text-white">Shipping Details</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <Input label="Street Address" name="street" value={address.street} onChange={handleAddressChange} placeholder="Enter full address" />
                                        </div>
                                        <Input label="City" name="city" value={address.city} onChange={handleAddressChange} placeholder="Mumbai" />
                                        <Input label="State" name="state" value={address.state} onChange={handleAddressChange} placeholder="Maharashtra" />
                                        <Input label="Zip Code" name="zip" value={address.zip} onChange={handleAddressChange} placeholder="400001" />
                                        <Input label="Phone Number" name="phone" value={address.phone} onChange={handleAddressChange} placeholder="9876543210" />
                                    </div>
                                    <Button className="w-full py-4 text-lg" onClick={() => setStep(2)}>Continue to Payment</Button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-dark-card border border-white/5 p-8 rounded-[2rem] space-y-8"
                                >
                                    <h2 className="text-3xl font-display font-bold text-white">Payment Method</h2>
                                    <div className="space-y-4">
                                        {[
                                            { id: 'cod', title: 'Cash on Delivery / After Consultation', description: 'Pay after measurement & final pricing confirmation' },
                                            { id: 'upi', title: 'UPI / PhonePe / GPay', description: 'Instant payment at checkout' },
                                            { id: 'card', title: 'Credit / Debit Card', description: 'Secure transaction via Stripe/Razorpay' }
                                        ].map((p) => (
                                            <div 
                                                key={p.id}
                                                onClick={() => setPayment(p.id)}
                                                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${payment === p.id ? 'border-primary bg-primary/5' : 'border-white/5 bg-white/3'}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${payment === p.id ? 'border-primary' : 'border-slate-600'}`}>
                                                        {payment === p.id && <div className="w-3 h-3 bg-primary rounded-full" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-white tracking-tight">{p.title}</h4>
                                                        <p className="text-xs text-slate-400">{p.description}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-4">
                                        <Button variant="outline" className="flex-grow py-4" onClick={() => setStep(1)}>Back</Button>
                                        <Button className="flex-[2] py-4" onClick={() => setStep(3)}>Continue to Confirmation</Button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="bg-dark-card border border-white/5 p-8 rounded-[2rem] space-y-8"
                                >
                                    <h2 className="text-3xl font-display font-bold text-white">Confirm Booking</h2>
                                    <div className="space-y-6">
                                        <div className="p-6 bg-white/3 rounded-2xl space-y-4 text-sm text-slate-400 border border-white/5">
                                            <div className="flex justify-between">
                                                <span>Ship to:</span>
                                                <span className="text-white font-medium text-right">{address.street}, {address.city}, {address.state}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Payment:</span>
                                                <span className="text-white font-medium uppercase">{payment}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Contact:</span>
                                                <span className="text-white font-medium">{address.phone}</span>
                                            </div>
                                        </div>

                                        <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl text-center">
                                            <p className="text-slate-300">By confirming, you agree that our master tailor will visit/call you for final measurements within 24 hours.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <Button variant="outline" className="flex-grow py-4" onClick={() => setStep(2)}>Back</Button>
                                        <Button loading={loading} className="flex-[2] py-4" onClick={handleBooking}>Confirm & Place Order</Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Order Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-32 p-8 bg-dark-card border border-white/5 rounded-[2rem] space-y-6 shadow-2xl">
                             <h3 className="text-xl font-display font-bold text-white">Order Items</h3>
                             <div className="space-y-4 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar border-b border-white/5 pb-6">
                                 {items.map(item => {
                                     const discountedPrice = Math.floor(item.price * (1 - item.discount / 100));
                                     return (
                                         <div key={item.product} className="flex gap-4 items-center">
                                             <img src={item.image} className="w-12 h-12 rounded-lg object-cover" />
                                             <div className="flex-grow">
                                                 <h4 className="text-sm font-bold text-white line-clamp-1">{item.name}</h4>
                                                 <p className="text-[10px] text-slate-500">
                                                     Qty: {item.qty} × ₹{discountedPrice}
                                                     {item.discount > 0 && <span className="ml-2 text-green-500">({item.discount}% Off)</span>}
                                                 </p>
                                             </div>
                                             <span className="text-sm font-bold text-white">₹{discountedPrice * item.qty}</span>
                                         </div>
                                     );
                                 })}
                             </div>
                             <div className="pt-4 space-y-3">
                                 <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                     <span>Original Subtotal</span>
                                     <span>₹{useCartStore.getState().getSubtotal()}</span>
                                 </div>
                                 {useCartStore.getState().getDiscountTotal() > 0 && (
                                     <div className="flex justify-between text-[10px] text-green-500 uppercase tracking-widest font-bold">
                                         <span>Offer Discount</span>
                                         <span>- ₹{useCartStore.getState().getDiscountTotal()}</span>
                                     </div>
                                 )}
                                 <div className="flex justify-between text-xs text-white uppercase tracking-widest font-bold pt-2 border-t border-white/5">
                                     <span>FINAL TOTAL DUE</span>
                                     <span className="text-lg text-primary">₹{getTotalPrice()}</span>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CheckoutPage;
