import { useNavigate } from "react-router-dom"
import { TrendingUp, Users, Newspaper, LogOut } from 'lucide-react';
import { useAuthStore } from "../store/authStore.js";

const Header = ({ activeTab }) => {
    const navigate = useNavigate();
    const {logout} = useAuthStore();

    const handleLogout = () => {
            logout();
            navigate('/signup'); 
            console.log('User logged out successfully!');
        }
    return (
        <div>
            <header className="fixed top-0 left-0 right-0 bg-white shadow-lg border-b border-gray-100 py-6 px-4 sm:px-6 lg:px-8 z-50">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 flex items-center">
                        DTU <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 ml-2">Hub!</span>
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        {/* Navigation Tabs */}
                        <nav className="flex space-x-3 sm:space-x-4">
                            <button
                                onClick={() => navigate('/')}
                                className={`flex items-center px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-md transform ${activeTab === 'dashboard'
                                        ? 'bg-gradient-to-r from-blue-400 to-purple-400 text-white scale-105 shadow-xl'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-lg border border-gray-200'
                                    }`}
                            >
                                <TrendingUp className="w-5 h-5 mr-2" /> Overview
                            </button>

                            <button
                                onClick={() => navigate('/news')}
                                className={`flex items-center px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-md transform ${activeTab === 'news'
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-105 shadow-xl'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-lg border border-gray-200'
                                    }`}
                            >
                                <Newspaper className="w-5 h-5 mr-2" /> News
                            </button>

                            <button
                                onClick={() => navigate('/society')}
                                className={`flex items-center px-6 py-3 rounded-full text-lg font-semibold transition-all duration-300 shadow-md transform ${activeTab === 'societies'
                                        ? 'bg-gradient-to-r from-teal-500 to-green-500 text-white scale-105 shadow-xl'
                                        : 'bg-white text-gray-700 hover:bg-gray-100 hover:shadow-lg border border-gray-200'
                                    }`}
                            >
                                <Users className="w-5 h-5 mr-2" /> Societies
                            </button>
                            
                        </nav>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-6 py-3 rounded-full bg-red-600 text-white text-lg font-semibold hover:bg-red-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <LogOut className="w-5 h-5 mr-2" /> Logout
                        </button>
                    </div>
                </div>
            </header>
        </div>
    )
}

export default Header