import { Link } from 'react-router-dom';
import { Instagram, Linkedin, Github, Facebook, Twitter } from 'lucide-react';

const Footer = () => {
    return (
        <div>
            <footer className="bg-gray-800 text-white py-8 px-4 sm:px-6 lg:px-8 mt-auto">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Section 1: Brand/About */}
                    <div className="flex flex-col items-center md:items-start text-center md:text-left">
                        <h3 className="text-2xl font-extrabold mb-4 flex items-center">
                            DTU <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 ml-2">Hub!</span>
                        </h3>
                        <p className="text-gray-300 text-sm mb-2">Your central platform for all college activities, news, and societies.</p>
                        <p className="text-gray-400 text-xs">&copy; {new Date().getFullYear()} DTU Hub. All rights reserved.</p>
                    </div>

                    {/* Section 2: Quick Links */}
                    <div className="text-center md:text-left">
                        <h4 className="text-lg font-semibold mb-3">Quick Links</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/news"
                                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm">
                                    News 
                                </Link>
                            </li>
                            <li>
                                <Link to="/society"
                                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                                >
                                    Societies
                                </Link>
                            </li>
                            <li>
                                <Link to="/events"
                                    className="text-gray-300 hover:text-white transition-colors duration-200 text-sm"
                                >
                                    Events
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Section 3: Connect With Us */}
                    <div className="text-center md:text-left">
                        <h4 className="text-lg font-semibold mb-4">Developed & Maintained by Yogesh</h4>
                        <ul className="space-y-3">
                            
                            <li>
                                <a href="https://www.instagram.com/tyagii_anmol?igsh=N2t6NTduMGY0a28=" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center">
                                    <Instagram className="w-4 h-4 mr-2" /> 
                                    Instagram
                                </a>
                            </li>
                            <li>
                                <a href="https://www.linkedin.com/in/yogesh-tyagi-25277731b" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center">
                                    <Linkedin className="w-4 h-4 mr-2" /> 
                                    LinkedIn
                                </a>
                            </li>
                            <li>
                                <a href="https://github.com/YogeshTyagi00" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm flex items-center">
                                    <Github className="w-4 h-4 mr-2" />
                                    GitHub
                                </a>
                            </li>
                            
                        </ul>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Footer;