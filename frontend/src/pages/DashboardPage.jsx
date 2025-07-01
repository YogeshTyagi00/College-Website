/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { LogOut, Newspaper, Users, ArrowRight, Bell, Calendar, TrendingUp, Award, Clock, Star, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import SocietyPage from './SocietyPage';
import NewsPage from './NewsPage';
import { useAuthStore } from '../store/authStore.js';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import HeroSection from '../components/HeroSection.jsx';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const { newsinfo: newsData, fetchNews, societiesinfo: societiesData, fetchSocieties } = useAuthStore();
  useEffect(() => {
    fetchNews();
    fetchSocieties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const navigate = useNavigate();


  // Simplified Mock Data for Dashboard sections (replace with actual data fetching if available)
  // For demo purposes, we'll slice from the fetched data or provide placeholders
  const featuredNews = (newsData || []).filter(article => article.featured).slice(0, 2); // Show 2 featured news
  const latestNews = (newsData || []).filter(article => !article.featured).slice(0, 4); // Show 4 latest news

  // Dummy data for events and announcements as they weren't in useAuthStore previously
  const mockEvents = [
    {
      id: 'event1',
      title: 'Annual Tech Fest: InnovateX',
      date: '2025-07-28T10:00:00Z',
      location: 'College Auditorium',
      description: 'A grand celebration of technology and innovation, featuring hackathons, workshops, and expert talks.',
      imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&h=400&fit=crop',
      category: 'tech-fest',
    },
    {
      id: 'event2',
      title: 'Cultural Night: Fusion Fiesta',
      date: '2025-08-10T18:00:00Z',
      location: 'Open Air Theatre',
      description: 'An evening showcasing diverse cultural performances including dance, music, and drama.',
      imageUrl: 'https://images.unsplash.com/photo-1541530342-9905953046a7?q=80&w=800&h=400&fit=crop',
      category: 'cultural',
    },
    {
      id: 'event3',
      title: 'Sports Day: Inter-College Tournament',
      date: '2025-08-25T09:00:00Z',
      location: 'College Sports Ground',
      description: 'Annual sports day with various competitions for students across different colleges.',
      imageUrl: 'https://images.unsplash.com/photo-1549476461-a0833a6473e0?q=80&w=800&h=400&fit=crop',
      category: 'sports',
    },
  ];
  const upcomingEvents = mockEvents.slice(0, 3); // Show 3 upcoming events

  const popularSocieties = (societiesData || []).slice(0, 4); // Show 4 popular societies

  const mockAnnouncements = [
    {
      id: 'annc1',
      title: 'Urgent: Exam Schedule Changes',
      content: 'Please check the revised examination schedule on the student portal. Some changes have been made to accommodate new policies. This is a critical update.',
      priority: 'high',
      date: '2025-06-25T09:00:00Z',
    },
    {
      id: 'annc2',
      title: 'Important: Internship Application Deadline Extended',
      content: 'The deadline for all summer internship applications has been extended to July 5th, 2025. Submit your applications promptly.',
      priority: 'high', // Setting to high for demonstration
      date: '2025-06-20T14:00:00Z',
    },
  ];
  const urgentAnnouncements = mockAnnouncements.filter(announcement => announcement.priority === 'high');

  // Helper to get image for category (reused from CollegeNewsPage)
  const getImageForCategory = (category) => {
    const images = {
      'tech-fest': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
      'sports': 'https://images.unsplash.com/photo-1593013820725-ca0b6076576f?w=800&h=400&fit=crop',
      'academic': 'https://images.unsplash.com/photo-1537495329792-41ae41ad3bf0?w=800&h=400&fit=crop',
      'campus': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
      'event': 'https://plus.unsplash.com/premium_photo-1661306437817-8ab34be91e0c??w=800&h=400&fit=crop',
      'technical': 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop',
      'cultural': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop',
      'business': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
      'creative': 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop',
      'social': 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=400&fit=crop',
      'all': 'https://images.unsplash.com/photo-1478147493297-c0f5855d0124?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    };
    return images[category] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop';
  };

  // Simplified NewsCard for Dashboard view
  const DashboardNewsCard = ({ article, featured = false }) => {
    const rawDate = article.publishedAt?.$date || article.publishedAt;
    let formattedDate = 'N/A Date'; // Default fallback

    try {
      const dateObj = new Date(rawDate);
      if (!isNaN(dateObj.getTime())) { // Check if date is valid
        formattedDate = format(dateObj, 'MMM dd, yyyy'); // Changed format string to 'yyyy'
      }
    } catch (error) {
      console.error("Error formatting date:", error, "for article:", article);
    }

    return (
      <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col h-full cursor-pointer`}
        onClick={() => navigate('/news')}> {/* Direct to news page */}
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

  // Simplified EventCard for Dashboard view
  const DashboardEventCard = ({ event }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col h-full cursor-pointer"
      onClick={() => navigate('/events')}> {/* Direct to news/events page, as events are grouped with news for now */}
      <img src={event.imageUrl} alt={event.title} className="w-full h-36 object-cover" />
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{event.title}</h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-3">{event.description}</p>
        </div>
        <div className="flex items-center text-xs text-gray-500 mt-auto">
          <Calendar className="w-3 h-3 mr-1" />
          <span>{format(new Date(event.date), 'MMM dd, yyyy, p')}</span>
          <span className="ml-auto bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium capitalize">
            {event.category.replace('-', ' ')}
          </span>
        </div>
      </div>
    </div>
  );

  // Simplified SocietyCard for Dashboard view
  const DashboardSocietyCard = ({ society }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] flex flex-col h-full cursor-pointer"
      onClick={() => navigate('/society')}> {/* Direct to societies page */}
      <img src={getImageForCategory(society.category)} alt={society.name} className="w-full h-32 object-cover" />
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">{society.name}</h3>
          <p className="text-gray-600 text-sm line-clamp-2">{society.description}</p>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500 mt-auto pt-3 border-t border-gray-100">
          <span>{society.members || 'N/A'} members</span> {/* Use 'members' or N/A */}
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
      <main className="max-w-7xl mx-auto pt-[150px] pb-10 px-4 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-15 pb-20">

            {/* Hero Section */}
            <HeroSection />

            {/* Urgent Announcements */}
            {urgentAnnouncements.length > 0 && (
              <section className="animate-fade-in mt-25">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                  <Bell className="w-6 h-6 mr-2 text-red-500" /> Urgent Announcements
                </h2>
                <div className="space-y-4">
                  {urgentAnnouncements.map((announcement) => (
                    <div key={announcement.id} className="border border-red-200 bg-red-50 text-red-800 p-4 rounded-lg flex items-start space-x-3 shadow-sm">
                      <Bell className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">{announcement.title}:</span>{' '}
                        {announcement.content}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Featured News */}
            {featuredNews.length > 0 && (
              <section className="animate-fade-in">
                <div className="flex items-center justify-between mb-6">
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
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Latest Updates</h2>
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
                    <div className="text-4xl font-bold mb-2">20+</div>
                    <div className="text-gray-200">Events</div>
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
      </main>
      <Footer />
    </div>
  );
};

export default DashboardPage;
