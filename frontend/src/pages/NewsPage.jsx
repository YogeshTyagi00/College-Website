/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, ChevronRight, BookOpen, Users, Trophy, Beaker, Clock, Code, Zap, X, ArrowLeft, TrendingUp, Newspaper, LogOut } from 'lucide-react'; // Added missing icons
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Footer from '../components/Footer.jsx';
import Header from '../components/Header.jsx';

const NewsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [visibleArticles, setVisibleArticles] = useState(6);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeTab, setActiveTab] = useState('news'); // State for active tab, default to 'news'

  const { newsinfo: newsData, fetchNews } = useAuthStore();
  const navigate = useNavigate(); // Initialize useNavigate hook

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log(newsData);

  // Extract ID for React keys (handle both string and object formats)
  const getArticleId = (article) => {
    return typeof article._id === 'string' ? article._id : article._id.$oid;
  }

  // Format date from your backend structure
  const formatDate = (dateObj) => {
    // eslint-disable-next-line no-undef
    const dateString = typeof dateObj === 'string' ? dateObj : article._id ? article._id.$date : dateObj.$date; // Handle different date formats
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Calculate read time based on content length
  const calculateReadTime = (content) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(' ').length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  // Handle article click
  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  // Close article modal
  const closeArticle = () => {
    setSelectedArticle(null);
    document.body.style.overflow = 'unset'; // Restore scrolling
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedArticle) {
        closeArticle();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedArticle]);


  // Filter and search functionality
  const filteredNews = newsData.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredNews = filteredNews.filter(article => article.featured);
  const regularNews = filteredNews.filter(article => !article.featured);

  // Categories based on your data
  const categories = [
    { id: 'all', name: 'All News', icon: BookOpen },
    { id: 'tech-fest', name: 'Tech Events', icon: Code },
    { id: 'sports', name: 'Sports', icon: Trophy },
    { id: 'academic', name: 'Academic', icon: Beaker },
    { id: 'campus', name: 'Campus Life', icon: Users },
    { id: 'event', name: 'Events', icon: Calendar },
  ];

  // Generate random images for demo (you can replace with actual image URLs from your backend)
  const getImageForCategory = (category) => {
    const images = {
      'tech-fest': 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
      'sports': 'https://images.unsplash.com/photo-1593013820725-ca0b6076576f?w=800&h=400&fit=crop',
      'academic': 'https://images.unsplash.com/photo-1537495329792-41ae41ad3bf0?w=800&h=400&fit=crop',
      'campus': 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop',
      'event': 'https://plus.unsplash.com/premium_photo-1661306437817-8ab34be91e0c??w=800&h=400&fit=crop',
    };
    return images[category] || 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop';
  };

  const NewsCard = ({ article, featured = false }) => (
    <div
      className={`group cursor-pointer transition-all duration-300 hover:transform hover:scale-[1.02] ${featured ? 'lg:col-span-2' : ''
        }`}
      onClick={() => handleArticleClick(article)}
    >
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100">
        <div className="relative overflow-hidden">
          <img
            src={getImageForCategory(article.category)}
            alt={article.title}
            className={`w-full object-cover transition-transform duration-500 group-hover:scale-110 ${featured ? 'h-72' : 'h-48'
              }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="absolute top-4 left-4">
            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium capitalize shadow-lg">
              {article.category.replace('-', ' ')}
            </span>
          </div>
          {article.featured && (
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
            {article.title}
          </h3>

          <p className="text-gray-600 mb-4 leading-relaxed">
            {article.excerpt}
          </p>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {formatDate(article.publishedAt)}
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-blue-600">
                <Clock className="w-4 h-4 mr-1" />
                <span className="font-medium">{calculateReadTime(article.content)}</span>
              </div>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform text-blue-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Article Modal Component
  const ArticleModal = ({ article, onClose }) => (
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
              src={getImageForCategory(article.category)}
              alt={article.title}
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
                {article.category.replace('-', ' ')}
              </span>
              {article.featured && (
                <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  ⭐ Featured
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[60vh]">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {article.title}
            </h1>

            {/* Meta information */}
            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(article.publishedAt)}
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {calculateReadTime(article.content)}
              </div>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.tags.map((tag, index) => (
                  <span key={index} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Article content */}
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                {article.content}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Header */}
      <Header activeTab={activeTab} />

      {/* Page Content Header with Search */}
      <div className="pt-32">
        <div className="bg-white shadow-sm border-b border-gray-100 "> {/* Added padding-top to account for fixed header */}
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-8 lg:mb-0">
                <h1 className="text-5xl font-bold text-gray-900 mb-3">
                  Campus <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">News</span>
                </h1>
                <p className="text-gray-600 text-xl">Stay updated with the latest happenings around campus</p>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md w-full">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search news articles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm hover:shadow-md text-gray-700"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Category Filter */}
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
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
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
              Showing {filteredNews.length} article{filteredNews.length !== 1 ? 's' : ''}
              {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>

          {/* Featured News */}
          {featuredNews.length > 0 && (
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <div className="flex items-center">
                  <Trophy className="w-7 h-7 mr-3 text-yellow-500" />
                  <h2 className="text-3xl font-bold text-gray-900">Featured Stories</h2>
                </div>
                <div className="ml-4 h-px bg-gradient-to-r from-yellow-400 to-transparent flex-1"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {featuredNews.map(article => (
                  <NewsCard key={getArticleId(article)} article={article} featured={true} />
                ))}
              </div>
            </div>
          )}

          {/* Regular News */}
          {regularNews.length > 0 ? (
            <div>
              <div className="flex items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Latest News</h2>
                <div className="ml-4 h-px bg-gradient-to-r from-blue-400 to-transparent flex-1"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularNews.slice(0, visibleArticles).map(article => (
                  <NewsCard key={getArticleId(article)} article={article} />
                ))}
              </div>

              {regularNews.length > visibleArticles && (
                <div className="text-center mt-12">
                  <button
                    onClick={() => setVisibleArticles(prev => prev + 6)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-105 hover:from-blue-700 hover:to-purple-700"
                  >
                    Load More Articles
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-white rounded-2xl shadow-lg p-12 max-w-md mx-auto">
                <BookOpen className="w-20 h-20 text-gray-300 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">No articles found</h3>
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


      {/* Article Modal */}
      {selectedArticle && (
        <ArticleModal article={selectedArticle} onClose={closeArticle} />
      )}
      <Footer />
    </div>
  );
};

export default NewsPage;