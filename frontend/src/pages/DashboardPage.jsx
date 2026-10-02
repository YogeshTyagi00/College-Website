/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { LogOut, Newspaper, Users, ArrowRight, Bell, Calendar, TrendingUp, Award, Clock, Star, ChevronDown, Shield, Loader } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';


import SocietyPage from './SocietyPage';
import NewsPage from './NewsPage';
import { useAuthStore } from '../store/authStore.js';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import HeroSection from '../components/HeroSection.jsx';
import EventsPage from './EventsPage.jsx';
import getImageForCategory from '../components/Image.jsx';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);

  const { newsinfo: newsData, fetchNews, societiesinfo: societiesData, fetchSocieties, eventsinfo: mockEvents, fetchEvents, user, requestAdmin, isLoading } = useAuthStore();
  useEffect(() => {
    fetchNews();
    fetchSocieties();
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRequestAdmin = async () => {
    try {
      await requestAdmin();
      setShowModal(false);
    } catch {
      setShowModal(false);
    }
  };


  const navigate = useNavigate();

  const featuredNews = (newsData || []).filter(article => article.featured).slice(0, 2); // Show 2 featured news
  const latestNews = (newsData || []).filter(article => !article.featured).slice(0, 4); // Show 4 latest news

  const upcomingEvents = (mockEvents || []).slice(0, 3); // Show 3 upcoming events

  const popularSocieties = (societiesData || []).slice(0, 4); // Show 4 societies

  //NewsCard for Dashboard view
  const DashboardNewsCard = ({ article, featured = false }) => {
    const rawDate = article.publishedAt?.$date || article.publishedAt;
    let formattedDate = 'N/A Date'; // Default fallback

    try {
      const dateObj = new Date(rawDate);
      if (!isNaN(dateObj.getTime())) { // Check if date is valid
        formattedDate = format(dateObj, 'MMM dd, yyyy'); 
      }
    } catch (error) {
      console.error("Error formatting date:", error, "for article:", article);
    }

    return (
      <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col h-full cursor-pointer`}
        onClick={() => navigate('/news')}> 
        <img src={getImageForCategory(article.category)} alt={article.title} className="w-full h-36 object-cover" />
        <div className="p-4 flex flex-col justify-between flex-grow">
          <div>
            <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{article.title}</h3>
            <p className="text-gray-600 text-sm line-clamp-3">{article.excerpt}</p>
          </div>
          <div className="flex items-center text-xs text-gray-500 mt-3">
            <Calendar className="w-3 h-3 mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
    );
  };

  //EventCard for Dashboard view
  const DashboardEventCard = ({ event }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col h-full cursor-pointer"
      onClick={() => navigate('/events')}> 
      <img src={getImageForCategory(event.category)} alt={event.title} className="w-full h-36 object-cover" />
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{event.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">{event.description}</p>
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-auto">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{event.date ? format(new Date(event.date), 'MMM dd, yyyy') : 'Date TBD'}</span>
          <span className="ml-auto bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
            {event.category.replace('-', ' ')}
          </span>
        </div>
      </div>
    </div>
  );

  //SocietyCard for Dashboard view
  const DashboardSocietyCard = ({ society }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col h-full cursor-pointer"
      onClick={() => navigate('/society')}>
      <img src={getImageForCategory(society.category)} alt={society.name} className="w-full h-32 object-cover" />
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{society.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{society.description}</p>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-3 border-t border-gray-100">
          <span>{society.members || 'N/A'} members</span>
          {society.registrationOpen && (
            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">Open</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* Dashboard Header */}
      <Header activeTab={activeTab} />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto pt-20 sm:pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-15 pb-20">

            {/* Hero Section */}
            <HeroSection />

            {/* Admin Request Banner — only for regular users */}
            {user?.role === 'user' && (
              <section className="animate-fade-in mt-8">
                {user.adminRequestStatus === 'none' && (
                  <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl px-6 py-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Shield className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Want admin access?</p>
                        <p className="text-xs text-gray-500">Request admin privileges to manage content on this platform.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowModal(true)}
                      className="ml-4 shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      Request Access
                    </button>
                  </div>
                )}

                {user.adminRequestStatus === 'pending' && (
                  <div className="flex items-center gap-3 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-100 rounded-xl px-6 py-4 shadow-sm">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Request under review</p>
                      <p className="text-xs text-gray-500">Your admin request has been submitted and is awaiting SuperAdmin approval.</p>
                    </div>
                  </div>
                )}

                {user.adminRequestStatus === 'rejected' && (
                  <div className="flex items-center justify-between bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 rounded-xl px-6 py-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 p-2 rounded-full">
                        <Shield className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">Request was rejected</p>
                        <p className="text-xs text-gray-500">Your previous request was declined. You may submit a new one.</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowModal(true)}
                      className="ml-4 shrink-0 bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200"
                    >
                      Try Again
                    </button>
                  </div>
                )}
              </section>
            )}

            {/* Featured News */}
            {featuredNews.length > 0 && (
              <section className="animate-fade-in">
                <div className="flex items-center justify-between mb-6 mt-20">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Newspaper className="w-6 h-6 mr-2 text-blue-500" /> Featured News
                  </h2>
                  <button
                    onClick={() => navigate('/news')}
                    className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    View All News <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {featuredNews.map((article) => (
                    <DashboardNewsCard key={article._id?.$oid || article._id} article={article} featured />
                  ))}
                </div>
              </section>
            )}

            {/* Latest News Grid */}
            {latestNews.length > 0 && (
              <section className="animate-fade-in">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 mt-20">Latest Updates</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {latestNews.map((article) => (
                    <DashboardNewsCard key={article._id?.$oid || article._id} article={article} />
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <section className="bg-gradient-to-r from-purple-50 to-pink-50 py-12 rounded-2xl shadow-lg animate-fade-in">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                      <Calendar className="w-6 h-6 mr-2 text-purple-600" /> Upcoming Events
                    </h2>
                    <button
                      onClick={() => navigate('/events')}
                      className="flex items-center text-purple-600 hover:text-purple-800 font-medium transition-colors"
                    >
                      View All Events <ArrowRight className="ml-2 h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {upcomingEvents.map((event) => (
                      <DashboardEventCard key={event.id} event={event} />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Popular Societies */}
            {popularSocieties.length > 0 && (
              <section className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Users className="w-6 h-6 mr-2 text-teal-600" /> Active Societies
                  </h2>
                  <button
                    onClick={() => navigate('/society')}
                    className="flex items-center text-teal-600 hover:text-teal-800 font-medium transition-colors"
                  >
                    Explore All <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {popularSocieties.map((society) => (
                    <DashboardSocietyCard key={society._id} society={society} />
                  ))}
                </div>
              </section>
            )}

            {/* Statistics Section */}
            <section className="bg-gradient-to-r from-gray-700 to-gray-900 text-white py-12 rounded-2xl shadow-xl animate-fade-in">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl font-bold mb-4">College at a Glance</h2>
                <p className="text-gray-300 max-w-2xl mx-auto mb-10">
                  Discover the vibrant ecosystem of our college community through these impressive numbers
                </p>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-blue-300">
                      <Newspaper className="w-8 h-8" />
                    </div>
                    <div className="text-4xl font-bold mb-2">150+</div>
                    <div className="text-gray-200">News Articles</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-green-300">
                      <Calendar className="w-8 h-8" />
                    </div>
                    <div className="text-4xl font-bold mb-2">50+</div>
                    <div className="text-gray-200">Events & Activities</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-teal-300">
                      <Users className="w-8 h-8" />
                    </div>
                    <div className="text-4xl font-bold mb-2">30+</div>
                    <div className="text-gray-200">Active Societies</div>
                  </div>
                  <div className="text-center">
                    <div className="bg-white/10 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-yellow-300">
                      <Award className="w-8 h-8" />
                    </div>
                    <div className="text-4xl font-bold mb-2">70%</div>
                    <div className="text-gray-200">Placement Rate</div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* Conditional rendering of full pages */}
        {activeTab === 'societies' && <SocietyPage />}
        {activeTab === 'news' && <NewsPage />}
        {activeTab === 'events' && <EventsPage />}
      </main>
      <Footer />

      {/* Admin Request Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Request Admin Access</h2>
            </div>
            <p className="text-gray-600 text-sm mb-8">
              This will send a request to the SuperAdmin for admin privileges.
              You will be notified once it is reviewed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-700 font-medium py-2.5 rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleRequestAdmin}
                disabled={isLoading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                {isLoading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
