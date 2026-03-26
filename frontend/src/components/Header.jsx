import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Users, Newspaper, LogOut, Calendar, Heart, Menu, X } from 'lucide-react';
import { useAuthStore } from "../store/authStore.js";

const navItems = [
  { label: 'Overview', icon: TrendingUp, path: '/', tab: 'dashboard', color: 'from-blue-400 to-purple-400' },
  { label: 'News', icon: Newspaper, path: '/news', tab: 'news', color: 'from-teal-300 to-blue-400' },
  { label: 'Events', icon: Calendar, path: '/events', tab: 'events', color: 'from-yellow-300 to-amber-600' },
  { label: 'Societies', icon: Users, path: '/society', tab: 'societies', color: 'from-teal-400 to-green-400' },
  { label: 'Donate', icon: Heart, path: '/donate', tab: 'donate', color: 'from-pink-400 to-red-400' },
];

const Header = ({ activeTab }) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/signup');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-lg border-b border-gray-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 flex items-center">
          DTU <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 ml-1">Hub!</span>
        </h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map(({ label, icon: Icon, path, tab, color }) => (
            <button
              key={tab}
              onClick={() => navigate(path)}
              className={`flex items-center px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeTab === tab
                  ? `bg-gradient-to-r ${color} text-white shadow-md`
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon className="w-4 h-4 mr-1.5" /> {label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 rounded-full bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors ml-2"
          >
            <LogOut className="w-4 h-4 mr-1.5" /> Logout
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 flex flex-col gap-2">
          {navItems.map(({ label, icon: Icon, path, tab, color }) => (
            <button
              key={tab}
              onClick={() => { navigate(path); setMenuOpen(false); }}
              className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab
                  ? `bg-gradient-to-r ${color} text-white`
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" /> {label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-3 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
          >
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
