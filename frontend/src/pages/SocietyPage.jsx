/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, ChevronRight, BookOpen, Users, Trophy, Beaker, Clock, Code, Zap, X, ArrowLeft, MapPin, Mail, Phone, Star, Check, UserPlus, Heart, Music, Camera, Palette, Globe, TrendingUp, Newspaper, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore.js';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';

const SocietyPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [registeredSocieties, setRegisteredSocieties] = useState(new Set()); // Keep if you still want to track registration status
  const [activeTab, setActiveTab] = useState('societies'); // Set initial active tab to 'societies' as this is the Societies page


  const navigate = useNavigate();



  const { societiesinfo: societiesData, fetchSocieties } = useAuthStore();
  useEffect(() => {
    fetchSocieties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(societiesData);

  // Handle society click
  const handleSocietyClick = (society) => {
    setSelectedSociety(society);
    document.body.style.overflow = 'hidden';
  };

  // Close society modal
  const closeSociety = () => {
    setSelectedSociety(null);
    document.body.style.overflow = 'unset';
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedSociety) {
        closeSociety();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedSociety]);

  // Filter and search functionality
  const filteredSocieties = societiesData.filter(society => {
    const matchesCategory = selectedCategory === 'all' || society.category === selectedCategory;
    const matchesSearch = society.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      society.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (society.activities && society.activities.some(activity => activity.toLowerCase().includes(searchTerm.toLowerCase()))); // Added check for activities
    return matchesCategory && matchesSearch;
  });

  const featuredSocieties = filteredSocieties.filter(society => society.featured);
  const regularSocieties = filteredSocieties.filter(society => !society.featured);

  // Categories
  const categories = [
    { id: 'all', name: 'All Societies', icon: Users },
    { id: 'technical', name: 'Technical', icon: Code },
    { id: 'cultural', name: 'Cultural', icon: Music },
    { id: 'business', name: 'Business', icon: Zap },
    { id: 'creative', name: 'Creative', icon: Palette },
    { id: 'social', name: 'Social Impact', icon: Heart },
    { id: 'academic', name: 'Academic', icon: BookOpen }
  ];

  // Get image for category
  const getImageForCategory = (category) => {
    const images = {
      'sports': 'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=800&h=400&fit=crop',
      'technical': 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop',
      'cultural': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
      'business': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
      'creative': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop',
      'social': 'https://images.unsplash.com/photo-1532629391-a67b5f152f20?w=800&h=400&fit=crop',
      'academic': 'https://images.unsplash.com/photo-1513258814515-d36c2e3612d3?w=800&h=400&fit=crop',
      'all': 'https://images.unsplash.com/photo-1478147493297-c0f5855d0124?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    };
    return images[category] || 'https://images.unsplash.com/photo-1478147493297-c0f5855d0124?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Default image
  };

  const SocietyCard = ({ society, onSocietyClick, isRegistered }) => {
    const isRegistrationLinkAvailable = !!society.registrationLink;
    const isDisabled = !isRegistrationLinkAvailable || isRegistered;

    return (
      <div
        className="group cursor-pointer transition-all duration-300 hover:transform hover:scale-[1.02]"
        onClick={() => onSocietyClick(society)}
      >
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full">
          <div className="relative overflow-hidden">
            <img
              src={getImageForCategory(society.category)}
              alt={society.name}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {society.featured && (
              <div className="absolute top-4 left-4">
                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  <Trophy className="w-4 h-4 mr-1 inline-block" /> Featured
                </span>
              </div>
            )}
            <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="p-6 flex flex-col justify-between flex-grow">
            <div>
              <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 text-xl leading-tight">
                {society.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                {society.description}
              </p>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
              <span className="text-sm font-medium text-blue-600 capitalize">
                <Users className="w-4 h-4 mr-1 inline-block" /> {society.category.replace('-', ' ')}
              </span>
              <a
                href={isRegistrationLinkAvailable ? society.registrationLink : '#'} // Conditional href
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center px-4 py-2 rounded-full text-white text-sm font-medium transition-all duration-200 shadow-md ${isDisabled
                    ? 'bg-gray-400 cursor-not-allowed pointer-events-none' // Added pointer-events-none
                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault(); // Prevent navigation if disabled
                  }
                }}
              >
                {isRegistered ? <><Check className="w-4 h-4 mr-1" /> Registered</> :
                  !isRegistrationLinkAvailable ? "Registration Not Started" :
                    <><UserPlus className="w-4 h-4 mr-1" /> Register</>}
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const SocietyModal = ({ society, onClose, isRegistered }) => {
    if (!society) return null;

    const registrationEndDate = new Date(society.registrationDeadline);
    const isRegistrationOpen = society.registrationOpen && (registrationEndDate > new Date());
    const isRegistrationLinkAvailable = !!society.registrationLink; // Check if link exists
    const isDisabled = !isRegistrationOpen || isRegistered || !isRegistrationLinkAvailable;

    const daysLeft = Math.ceil((registrationEndDate - new Date()) / (1000 * 60 * 60 * 24));

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="relative">
              <img
                src={getImageForCategory(society.category)}
                alt={society.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Back button */}
              <button
                onClick={onClose}
                className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all flex items-center"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>

              {/* Category and Featured badges */}
              <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize shadow-lg">
                  {society.category.replace('-', ' ')}
                </span>
                {society.featured && (
                  <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                    ⭐ Featured
                  </span>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto max-h-[60vh]">
              <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                {society.name}
              </h1>

              <p className="text-gray-700 leading-relaxed text-lg mb-6 whitespace-pre-wrap">
                {society.fullDescription}
              </p>

              {/* Meta information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-semibold text-gray-700">Category:</span> <span className="capitalize ml-1">{society.category.replace('-', ' ')}</span>
                </div>
                {society.seats && (
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2 text-green-600" />
                    <span className="font-semibold text-gray-700">Seats:</span> <span className="ml-1">{society.seats}</span>
                  </div>
                )}
                {society.location && (
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-red-600" />
                    <span className="font-semibold text-gray-700">Location:</span> <span className="ml-1">{society.location}</span>
                  </div>
                )}
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                  <span className="font-semibold text-gray-700">Registration Deadline:</span> <span className="ml-1">{new Date(society.registrationDeadline).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                {isRegistrationOpen ? (
                  <div className="flex items-center text-green-600 font-semibold">
                    <Check className="w-4 h-4 mr-2" /> Registration Open ({daysLeft} days left)
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 font-semibold">
                    <X className="w-4 h-4 mr-2" /> Registration Closed
                  </div>
                )}
              </div>

              {/* Contact and Social Media */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Connect with Us</h3>
                <div className="flex flex-wrap gap-x-6 gap-y-3 mb-4">
                  {society.contact.whatsappLink && (
                    <a href={society.contact.whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                      <Phone className="w-5 h-5 mr-2" /> WhatsApp Group
                    </a>
                  )}
                  {society.contact.email && (
                    <a href={`mailto:${society.contact.email}`} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                      <Mail className="w-5 h-5 mr-2" /> {society.contact.email}
                    </a>
                  )}
                  {society.contact.phone && (
                    <a href={`tel:${society.contact.phone}`} className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                      <Phone className="w-5 h-5 mr-2" /> {society.contact.phone}
                    </a>
                  )}
                  {society.socialMedia && society.socialMedia.instagram && (
                    <a href={`https://instagram.com/${society.socialMedia.instagram.substring(1)}`} target="_blank" rel="noopener noreferrer" className="flex items-center text-pink-600 hover:text-pink-800 transition-colors">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Instagram_icon.png" alt="Instagram" className="w-5 h-5 mr-2" /> Instagram
                    </a>
                  )}
                </div>
              </div>

              {/* Registration Button - Now linking to external URL */}
              <div className="mt-6 flex justify-end">
                <a
                  href={isRegistrationLinkAvailable ? society.registrationLink : '#'} // Conditional href
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center shadow-md ${isDisabled
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed pointer-events-none' // Added pointer-events-none
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg transform hover:scale-105 hover:from-blue-700 hover:to-purple-700'
                    }`}
                  onClick={(e) => {
                    if (isDisabled) {
                      e.preventDefault(); // Prevent navigation if disabled
                    }
                  }}
                >
                  {isRegistered ? <><Check className="w-5 h-5 mr-2" /> Already Registered</> :
                    !isRegistrationLinkAvailable ? "Registration Not Started" :
                      <><UserPlus className="w-5 h-5 mr-2" /> Register Now</>}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Header - Moved here from SocietyCard */}
      <Header activeTab={activeTab} />
      {/* Added padding to prevent content from being hidden by fixed header */}
      <div className="pt-32">
        {/* Header (Societies Page Specific) */}
        <div className="bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-8 lg:mb-0">
                <h1 className="text-5xl font-bold text-gray-900 mb-3">
                  Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-green-500">Societies</span>
                </h1>
                <p className="text-gray-600 text-xl">Discover and join vibrant student communities</p>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search societies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all shadow-sm hover:shadow-md text-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Category Filter */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-700 mb-4">Explore by Category</h2>
            <div className="flex flex-wrap gap-3">
              {categories.map(category => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center px-5 py-3 rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow-md ${selectedCategory === category.id
                        ? 'bg-gradient-to-r from-teal-600 to-green-600 text-white shadow-lg transform scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {category.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Counter */}
          <div className="mb-8">
            <p className="text-gray-600">
              Showing {filteredSocieties.length} societ{filteredSocieties.length !== 1 ? 'ies' : 'y'}
              {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>

          {/* Featured Societies */}
          {featuredSocieties.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <div className="flex items-center">
                  <Star className="w-7 h-7 mr-3 text-yellow-500" />
                  <h2 className="text-3xl font-bold text-gray-900">Featured Societies</h2>
                </div>
                <div className="ml-4 h-px bg-gradient-to-r from-yellow-400 to-transparent flex-1"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredSocieties.map(society => (
                  <SocietyCard
                    key={society._id}
                    society={society}
                    onSocietyClick={handleSocietyClick}
                    isRegistered={registeredSocieties.has(society._id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Regular Societies */}
          {regularSocieties.length > 0 ? (
            <div>
              <div className="flex items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">All Societies</h2>
                <div className="ml-4 h-px bg-gradient-to-r from-blue-400 to-transparent flex-1"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularSocieties.map(society => (
                  <SocietyCard
                    key={society._id}
                    society={society}
                    onSocietyClick={handleSocietyClick}
                    isRegistered={registeredSocieties.has(society._id)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <Users className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No societies found</h3>
                <p className="text-gray-600 leading-relaxed">
                  Try adjusting your search terms or filter criteria to find what you're looking for.
                </p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                  }}
                  className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Society Modal */}
      {selectedSociety && (
        <SocietyModal
          society={selectedSociety}
          onClose={closeSociety}
          isRegistered={registeredSocieties.has(selectedSociety._id)}
        />
      )}
      <Footer />
    </div>
  );
};

export default SocietyPage;