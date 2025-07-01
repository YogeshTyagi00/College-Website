/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, Clock, Users, Trophy, Beaker, Code, X, ArrowLeft, BookOpen, Sparkles, Tag, Mic } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';
import getImageForCategory from '../components/Image.jsx';

const EventsPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [visibleEvents, setVisibleEvents] = useState(6);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [activeTab, setActiveTab] = useState('events');

    const { eventsinfo: eventData, fetchEvents } = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log("Fetched Event Data:", eventData);

    // Extract ID for React keys (handle both string and object formats)
    const getEventId = (event) => {
        return typeof event._id === 'string' ? event._id : event._id.$oid;
    };

    // Format date for event display (e.g., "January 25, 2024")
    const formatEventDate = (dateObj) => {
        const dateString = typeof dateObj === 'string' ? dateObj : dateObj.$date;
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Handle event card click
    const handleEventClick = (event) => {
        setSelectedEvent(event);
        document.body.style.overflow = 'hidden';
    };

    // Close event modal
    const closeEvent = () => {
        setSelectedEvent(null);
        document.body.style.overflow = 'unset';
    };

    // Handle escape key to close modal
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && selectedEvent) {
                closeEvent();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [selectedEvent]);

    // Filter and search functionality for events
    const filteredEvents = eventData.filter(event => {
        const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (event.organizer && event.organizer.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

   
    const featuredEvents = filteredEvents.filter(event => event.featured === true);
    const upcomingEvents = filteredEvents.filter(event => !event.featured); 

    // Categories for events
    const categories = [
        { id: 'all', name: 'All Events', icon: BookOpen },
        { id: 'competitionE', name: 'Competition', icon: Code },
        { id: 'sportsE', name: 'Sports', icon: Trophy },
        { id: 'internshipE', name: 'Internship', icon: Beaker },
        { id: 'culturalE', name: 'Cultural', icon: Users },
        { id: 'workshopE', name: 'Workshop', icon: Sparkles },
        {id: 'seminar', name: 'Seminars', icon: Mic},
    ];

    const EventCard = ({ event, featured = false }) => (
        <div
            className={`group cursor-pointer transition-all duration-300 hover:transform hover:scale-[1.02] ${featured ? 'lg:col-span-2' : ''
                }`}
            onClick={() => handleEventClick(event)}
        >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
                <div className="relative overflow-hidden">
                    <img
                        src={getImageForCategory(event.category)}
                        alt={event.title}
                        className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${featured ? 'h-72' : 'h-48'
                            }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize shadow-lg">
                            {event.category}
                        </span>
                    </div>
                    {event.featured && ( // Now directly checking event.featured
                        <div className="absolute top-4 right-4">
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                ⭐ Featured
                            </span>
                        </div>
                    )}
                </div>

                <div className="p-6">
                    <h3 className={`font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 ${featured ? 'text-2xl leading-tight' : 'text-lg'
                        }`}>
                        {event.title}
                    </h3>

                    <p className="text-gray-600 mb-4 leading-relaxed">
                        {event.description?.substring(0, 150) + (event.description?.length > 150 ? '...' : '')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-sm text-gray-500 mt-4 border-t border-gray-100 pt-4">
                        <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-3" />
                                {formatEventDate(event.date)}
                            </div>
                            {event.time && (
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-3" />
                                    {event.time}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center text-blue-600">
                            {event.location && (
                                <div className="flex items-center mr-3">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    <span className="font-medium">{event.location}</span>
                                </div>
                            )}
                            <ArrowLeft className="w-5 h-5 group-hover:translate-x-1 transition-transform text-blue-600 rotate-180" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const EventModal = ({ event, onClose }) => (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={onClose}
            ></div>

            <div className="relative min-h-screen flex items-center justify-center p-4">
                <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    <div className="relative">
                        <img
                            src={getImageForCategory(event.category)}
                            alt={event.title}
                            className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <button
                            onClick={onClose}
                            className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all flex items-center"
                        >
                            <ArrowLeft className="w-6 h-6" />
                        </button>

                        <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize shadow-lg">
                                {event.category}
                            </span>
                            {event.featured && ( // Now directly checking event.featured
                                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                                    ⭐ Featured
                                </span>
                            )}
                        </div>
                    </div>

                    <div className="p-8 overflow-y-auto max-h-[60vh]">
                        <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
                            {event.title}
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
                            <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {formatEventDate(event.date)}
                            </div>
                            {event.time && (
                                <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-2" />
                                    {event.time}
                                </div>
                            )}
                            {event.location && (
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    {event.location}
                                </div>
                            )}
                            {event.organizer && (
                                <div className="flex items-center">
                                    <Users className="w-4 h-4 mr-2" />
                                    Organized by: {event.organizer}
                                </div>
                            )}
                        </div>

                        <div className="prose prose-lg max-w-none">
                            <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                                {event.description}
                            </p>
                        </div>

                        {event.registrationLink && (
                            <div className="mt-8 text-center">
                                <a
                                    href={event.registrationLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                >
                                    <Tag className="w-5 h-5 mr-3" />
                                    Register Now
                                </a>
                            </div>
                        )}
                        {event.registrationDeadline && new Date(event.registrationDeadline.$date) < new Date() && (
                            <div className="mt-4 text-center text-red-500 font-semibold">
                                Registration for this event has closed on {formatEventDate(event.registrationDeadline)}.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <Header activeTab={activeTab} />

            <div className="pt-32">
                <div className="bg-white shadow-sm border-b border-gray-100 ">
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                            <div className="mb-8 lg:mb-0">
                                <h1 className="text-5xl font-bold text-gray-900 mb-3">
                                    Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-700">Events</span>
                                </h1>
                                <p className="text-gray-600 text-xl">Discover and join exciting events happening around campus!</p>
                            </div>

                            <div className="relative max-w-md w-full">
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    placeholder="Search events by title, description, or location..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md text-gray-700"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 py-10">
                    <div className="mb-10">
                        <h2 className="text-lg font-semibold text-gray-700 mb-4">Filter by Category</h2>
                        <div className="flex flex-wrap gap-3">
                            {categories.map(category => {
                                const Icon = category.icon;
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`flex items-center px-5 py-3 rounded-full font-medium transition-all duration-200 shadow-sm hover:shadow-md ${selectedCategory === category.id
                                            ? 'bg-gradient-to-r from-yellow-500 to-amber-800 text-white shadow-lg transform scale-105'
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

                    <div className="mb-8">
                        <p className="text-gray-600">
                            Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
                            {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
                            {searchTerm && ` matching "${searchTerm}"`}
                        </p>
                    </div>

                    {featuredEvents.length > 0 && (
                        <div className="mb-16">
                            <div className="flex items-center mb-8">
                                <div className="flex items-center">
                                    <Trophy className="w-7 h-7 mr-3 text-yellow-500" />
                                    <h2 className="text-3xl font-bold text-gray-900">Featured Events</h2>
                                </div>
                                <div className="ml-4 h-px bg-gradient-to-r from-yellow-400 to-transparent flex-1"></div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                {featuredEvents.map(event => (
                                    <EventCard key={getEventId(event)} event={event} featured={true} />
                                ))}
                            </div>
                        </div>
                    )}

                    {upcomingEvents.length > 0 ? (
                        <div>
                            <div className="flex items-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
                                <div className="ml-4 h-px bg-gradient-to-r from-blue-400 to-transparent flex-1"></div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {upcomingEvents.slice(0, visibleEvents).map(event => (
                                    <EventCard key={getEventId(event)} event={event} />
                                ))}
                            </div>

                            {upcomingEvents.length > visibleEvents && (
                                <div className="text-center mt-12">
                                    <button
                                        onClick={() => setVisibleEvents(prev => prev + 6)}
                                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:from-blue-700 hover:to-purple-700"
                                    >
                                        Load More Events
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                                <Calendar className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No events found</h3>
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

            {selectedEvent && (
                <EventModal event={selectedEvent} onClose={closeEvent} />
            )}
            <Footer />
        </div>
    );
};

export default EventsPage;