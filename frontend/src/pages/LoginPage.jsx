import React, { useEffect, useState } from 'react';
import Input from "../components/InputField.jsx";
import { BadgeCheck, Loader } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore.js";
import { toast } from "react-hot-toast";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion"; 

const LoginPage = () => {
    const [rollNo, setRollNo] = useState("");

    const { login, isLoading, error: authError, clearError } = useAuthStore();

    useEffect(() => {
        if(clearError)
            clearError();
    }, [clearError]);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Attempting to log in with Roll No:", rollNo);

        try {
            await login(rollNo);
            toast.success("Login successful!");
            console.log("Login successful!");
            navigate("/");
        } catch (err) {
            console.error("Login failed:", err);
            toast.error( "Login failed! Please check your Roll No.");
        }
    };

    // Framer Motion Variants for staggered children animation
    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                delayChildren: 0.05, 
                staggerChildren: 0.1 
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
                stiffness: 120, 
                damping: 12,    
                duration: 0.3 
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 p-4 sm:p-6 font-inter animate-gradient-shift relative overflow-hidden">

            <div className="absolute inset-0 bg-black opacity-5 z-0 pointer-events-none"></div>

            {/* Main card container */}
            <motion.div
                className='max-w-md w-full bg-white bg-opacity-90 backdrop-filter backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative z-10'
                initial="hidden" 
                animate="visible" 
                variants={containerVariants} 
                whileHover={{ scale: 1.005, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }} 
                transition={{ duration: 0.3, ease: "easeOut" }} 
            >
                <div className='p-8 sm:p-10'>
                    {/* Heading  */}
                    <motion.h2
                        className='text-4xl font-extrabold mb-8 text-center bg-gradient-to-r from-blue-700 to-purple-700 text-transparent bg-clip-text drop-shadow-sm'
                        variants={itemVariants} 
                    >
                        Welcome Back!
                    </motion.h2>

                    <form onSubmit={handleLogin}>
                        {/* Roll No Input Field  */}
                        <Input
                            icon={BadgeCheck}
                            type='text'
                            placeholder='Your Roll No'
                            value={rollNo}
                            onChange={(e) => setRollNo(e.target.value.toUpperCase())}
                            required
                            variants={itemVariants} 
                        />

                        {/* Display error from auth store*/}
                        {authError && (
                            <motion.p
                                className='text-red-600 font-medium text-sm mt-3 mb-4 text-center'
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                {authError}
                            </motion.p>
                        )}

                        {/* Login Button  */}
                        <motion.button
                            className='mt-8 w-full py-3.5 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white
                            font-bold rounded-xl shadow-lg hover:from-blue-600
                            hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                            focus:ring-offset-white transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                            type='submit'
                            disabled={isLoading}
                            variants={itemVariants} 
                            whileHover={{ scale: 1.02 }} 
                            whileTap={{ scale: 0.98 }} 
                        >
                            {isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : "Login"}
                        </motion.button>
                    </form>
                </div>

                {/* Link to Sign Up Page  */}
                <motion.div
                    className='px-8 py-5 bg-gray-50 bg-opacity-80 flex justify-center border-t border-gray-100'
                    variants={itemVariants} 
                >
                    <p className='text-sm text-gray-700'>
                        Don't have an account?{" "}
                        <Link to={"/signup"} className='text-blue-600 hover:underline hover:text-blue-700 transition-colors duration-200'>
                            Sign Up
                        </Link>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoginPage;