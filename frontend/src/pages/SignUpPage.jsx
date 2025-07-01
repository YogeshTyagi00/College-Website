/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Input from "../components/InputField.jsx"; // Ensure InputField is updated
import { User, BadgeCheck, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const SignUpPage = () => {
    const [name, setName] = useState("");
    const [rollNo, setRollNo] = useState("");

    const { signup, isLoading, error: authError, clearError } = useAuthStore();

    const navigate = useNavigate();

    const handleSignUp = async (e) => {
        e.preventDefault();
        console.log("Attempting to register with:", { name, rollNo });

        try {
            await signup(name, rollNo);
            toast.success("Registration successful!");
            console.log("Registration successful!");
            navigate("/");
        } catch (err) {
            console.error("Registration failed:", err);
            toast.error("Registration failed! Please check your details.");
        }
    };

    useEffect(() => {
        if (clearError)
            clearError();
    }, [clearError]);

    // Framer Motion Variants for staggered children animation
    const containerVariants = {
        hidden: { opacity: 0, y: 50 }, // Start a bit lower
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delayChildren: 0.05, // Slightly less delay for children start
                staggerChildren: 0.1 // Stagger each child animation
            }
        }
    };

    // Variants for individual items to fade in and slide up
    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 120, // Slightly stiffer for quicker initial snap
                damping: 12,    // Less damping for less "bounciness"
                duration: 0.3 // Overall duration of the individual item animation
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4 sm:p-6 font-inter animate-gradient-shift relative overflow-hidden">
            {/* Background overlay for visual texture/depth */}
            <div className="absolute inset-0 bg-black opacity-5 z-0 pointer-events-none"></div>

            {/* Main card container - now a motion.div */}
            <motion.div
                className='max-w-md w-full bg-white bg-opacity-90 backdrop-filter backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative z-10'
                initial="hidden" // Start with hidden state
                animate="visible" // Animate to visible state on mount
                variants={containerVariants} // Apply container variants
                whileHover={{ scale: 1.005, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }} // Framer Motion hover effect
                transition={{ duration: 0.3, ease: "easeOut" }} // Transition for card hover
            >
                <div className='p-8 sm:p-10'>
                    {/* Heading - now a motion.h2 */}
                    <motion.h2
                        className='text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-700 to-purple-700 text-transparent bg-clip-text drop-shadow-sm'
                        variants={itemVariants} // Apply item variants
                    >
                        Join DTU Hub!
                    </motion.h2>

                    <form onSubmit={handleSignUp}>
                        {/* Full Name Input - now correctly receives variants */}
                        <Input
                            icon={User}
                            type='text'
                            placeholder='Full Name'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            variants={itemVariants} // Pass item variants directly
                        />
                        {/* Roll No Input - now correctly receives variants */}
                        <Input
                            icon={BadgeCheck}
                            type='text'
                            placeholder='Roll No'
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value.toUpperCase())}
                            required
                            variants={itemVariants} // Pass item variants directly
                        />

                        {/* Display error from auth store - now a motion.p */}
                        {authError && (
                            <motion.p
                                className='text-red-600 font-medium text-sm mt-3 mb-4 text-center'
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                // exit prop requires <AnimatePresence> from Framer Motion
                                // If you want exit animation for error, wrap your form with AnimatePresence
                                // <AnimatePresence> {authError && <motion.p>...</motion.p>} </AnimatePresence>
                                transition={{ duration: 0.3 }}
                            >
                                {authError}
                            </motion.p>
                        )}

                        {/* Register Button - now a motion.button, correctly receives variants */}
                        <motion.button
                            className='mt-8 w-full py-3.5 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white
                            font-bold rounded-xl shadow-lg hover:from-blue-600
                            hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                            focus:ring-offset-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                            type='submit'
                            disabled={isLoading}
                            variants={itemVariants} // Pass item variants directly
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : "Register"}
                        </motion.button>
                    </form>
                </div>

                {/* Login Link - now a motion.div wrapper, correctly receives variants */}
                <motion.div
                    className='px-8 py-5 bg-gray-50 bg-opacity-80 flex justify-center border-t border-gray-100'
                    variants={itemVariants} // Pass item variants directly
                >
                    <p className='text-sm text-gray-700'>
                        Already have an account?{" "}
                        <Link to={"/login"} className='text-blue-600 hover:underline hover:text-blue-700 transition-colors duration-200'>
                            Login
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SignUpPage;