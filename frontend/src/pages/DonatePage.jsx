import { useState } from 'react';
import { Heart, Loader, IndianRupee, User, Mail, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

const API_URL = import.meta.env.MODE === 'development' ? 'http://localhost:3000/route' : '/route';

const PRESET_AMOUNTS = [100, 500, 1000, 2000, 5000];

const DonatePage = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handlePreset = (val) => setAmount(String(val));

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const loadRazorpayScript = () =>
        new Promise((resolve) => {
            if (document.getElementById('razorpay-script')) return resolve(true);
            const script = document.createElement('script');
            script.id = 'razorpay-script';
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });

    const handleDonate = async (e) => {
        e.preventDefault();
        if (!amount || Number(amount) < 1) {
            toast.error('Please enter a valid amount');
            return;
        }

        setIsLoading(true);
        try {
            const loaded = await loadRazorpayScript();
            if (!loaded) {
                toast.error('Failed to load payment gateway. Check your connection.');
                setIsLoading(false);
                return;
            }

            const { data } = await axios.post(`${API_URL}/donation/create-order`, {
                amount: Number(amount),
                name: form.name,
                email: form.email,
                message: form.message,
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: data.currency,
                name: 'DTU Hub',
                description: 'Donation to DTU Hub',
                order_id: data.orderId,
                handler: async (response) => {
                    try {
                        await axios.post(`${API_URL}/donation/verify`, {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        });
                        toast.success('Thank you for your donation!');
                        setForm({ name: '', email: '', message: '' });
                        setAmount('');
                    } catch {
                        toast.error('Payment verification failed. Contact support.');
                    }
                },
                prefill: { name: form.name, email: form.email },
                theme: { color: '#6366f1' },
                modal: { ondismiss: () => toast('Payment cancelled') },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        } finally {
            setIsLoading(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.08 } },
    };
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 12 } },
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Header activeTab="donate" />

            <main className="max-w-2xl mx-auto pt-[150px] pb-20 px-4 sm:px-6">
                <motion.div
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                >
                    {/* Header banner */}
                    <motion.div
                        className="bg-gradient-to-r from-blue-500 to-purple-600 px-8 py-10 text-white text-center"
                        variants={itemVariants}
                    >
                        <Heart className="w-12 h-12 mx-auto mb-3 fill-white" />
                        <h1 className="text-3xl font-extrabold mb-2">Support DTU Hub</h1>
                        <p className="text-blue-100 text-sm">
                            Your contribution helps us keep the platform running and growing for all DTU students.
                        </p>
                    </motion.div>

                    <form onSubmit={handleDonate} className="p-8 space-y-6">
                        {/* Preset amounts */}
                        <motion.div variants={itemVariants}>
                            <p className="text-sm font-semibold text-gray-600 mb-3">Select Amount (₹)</p>
                            <div className="flex flex-wrap gap-2">
                                {PRESET_AMOUNTS.map((val) => (
                                    <button
                                        key={val}
                                        type="button"
                                        onClick={() => handlePreset(val)}
                                        className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                                            amount === String(val)
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-md'
                                                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400'
                                        }`}
                                    >
                                        ₹{val}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Custom amount */}
                        <motion.div variants={itemVariants} className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="number"
                                placeholder="Or enter custom amount"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                min="1"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                            />
                        </motion.div>

                        {/* Name */}
                        <motion.div variants={itemVariants} className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                            />
                        </motion.div>

                        {/* Email */}
                        <motion.div variants={itemVariants} className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="email"
                                name="email"
                                placeholder="Email (optional)"
                                value={form.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
                            />
                        </motion.div>

                        {/* Message */}
                        <motion.div variants={itemVariants} className="relative">
                            <MessageSquare className="absolute left-3 top-4 text-gray-400 w-5 h-5" />
                            <textarea
                                name="message"
                                placeholder="Leave a message (optional)"
                                value={form.message}
                                onChange={handleChange}
                                rows={3}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 resize-none"
                            />
                        </motion.div>

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <Loader className="animate-spin" size={22} />
                            ) : (
                                <>
                                    <Heart className="w-5 h-5 fill-white" /> Donate Now
                                </>
                            )}
                        </motion.button>

                        <motion.p variants={itemVariants} className="text-xs text-center text-gray-400">
                            Secured by Razorpay. Supports UPI, Cards, Net Banking & Wallets.
                        </motion.p>
                    </form>
                </motion.div>
            </main>

            <Footer />
        </div>
    );
};

export default DonatePage;
