/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion'; // Import motion

// Accept Framer Motion props directly
const InputField = ({ icon: Icon, type, placeholder, value, onChange, required, iconClassName, ...framerProps }) => {
  return (
    // Use motion.div directly and spread framerProps to it
    <motion.div className="relative mb-6 group input-field-wrapper" {...framerProps}>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full py-3 px-4 pl-12 border border-gray-300 rounded-xl focus:outline-none focus:border-transparent
                   text-gray-800 placeholder-gray-500 transition-all duration-200 ease-in-out shadow-sm
                   bg-gray-50 hover:bg-white focus:bg-white"
      />
      {Icon && (
        <motion.div
          className={`absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200 ${iconClassName || ''}`}
          initial={{ scale: 1 }}
          whileFocus={{ scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon size={20} />
        </motion.div>
      )}
    </motion.div>
  );
};

export default InputField;