/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react'; // Ensure this is imported

// Define variants for the container (the main section)
const containerVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
      duration: 0.8,
      ease: [0.2, 0.6, 0.4, 0.9],
    },
  },
};

// Define variants for each child element (h2, p)
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

// --- UPDATED: Specific variants for the jumping arrow to be smaller and more subtle ---
const arrowVariants = {
  hidden: { opacity: 0, y: -10 }, // Start a little higher, hidden
  visible: {
    opacity: 1,
    y: [0, 6, 0],       // Smaller, more gentle jump (e.g., 6px down)
    scale: [1, 1.02, 1], // Very subtle scale (e.g., 2% larger)
    transition: {
      duration: 1.2,     // Slightly faster for a quicker, less "bouncy" feel
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    },
  },
};

const HeroSection = ({ setActiveTab }) => {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      // Option 3 Colors: Dark Teal to almost Black (retained)
      className="relative overflow-hidden bg-gradient-to-br from-teal-800 to-gray-900 rounded-3xl p-10 sm:p-16 text-white text-center shadow-2xl border border-teal-600 transform transition-all duration-500 hover:shadow-3xl hover:scale-[1.005] m-auto"
    >
      {/* Subtle Background Overlay */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900/50 via-gray-900/50 to-teal-900/50 mix-blend-overlay opacity-60"></div>

      <div className="relative z-10 flex flex-col items-center justify-center">

        {/* Main Heading */}
        <motion.h2
          variants={itemVariants}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tight leading-tight drop-shadow-md"
        >
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-white">Your Campus.</span>
          <span className="block mt-2 text-white">Unleashed.</span>
        </motion.h2>

        {/* Descriptive Paragraph */}
        <motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto font-light leading-relaxed"
        >
          Dive into real-time updates, discover thriving societies, and never miss a beat. All your college life, simplified.
        </motion.p>

        {/* --- UPDATED: "Jumping Arrow" Call to Action --- */}
        <motion.div
          variants={arrowVariants}
          className="mt-6 mb-4 cursor-pointer" // Adjusted top margin to bring it down, added bottom margin
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight, // Scrolls to roughly the height of the viewport
              behavior: 'smooth'
            });
          }}
        >
          <ChevronDown className="w-12 h-12 text-teal-300 drop-shadow-lg mx-auto" /> {/* Smaller icon size */}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;