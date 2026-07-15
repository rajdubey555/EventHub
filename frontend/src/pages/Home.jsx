import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Hero from '../components/Hero';
import Spinner from '../components/Spinner';
import EventCard from '../components/EventCard';
import api from '../utils/api';
import {
  FaLaptopCode,
  FaMusic,
  FaBasketballBall,
  FaLaugh,
  FaTools,
  FaSearch,
  FaTicketAlt,
  FaSmile,
  FaCity,
  FaUsers,
  FaAward,
} from 'react-icons/fa';

const categories = [
  { name: 'Tech', icon: FaLaptopCode, color: 'bg-blue-100 text-blue-600' },
  { name: 'Music', icon: FaMusic, color: 'bg-pink-100 text-pink-600' },
  { name: 'Sports', icon: FaBasketballBall, color: 'bg-green-100 text-green-600' },
  { name: 'Comedy', icon: FaLaugh, color: 'bg-yellow-100 text-yellow-600' },
  { name: 'Workshop', icon: FaTools, color: 'bg-purple-100 text-purple-600' },
];

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await api.get('/events');
        // Slice the first 3 events as featured ones
        setEvents(data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleCategoryClick = (categoryName) => {
    navigate(`/events?category=${categoryName}`);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    toast.success('Thank you for subscribing to our newsletter!');
    setNewsletterEmail('');
  };

  return (
    <div>
      {/* Banner Hero */}
      <Hero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Category Grid Section */}
        <section className="mb-20">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900">Explore by Category</h2>
            <p className="mt-2 text-gray-600">Find events that match your interests</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary-100 transition-all text-center group cursor-pointer"
                >
                  <div className={`p-4 rounded-full ${cat.color} mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="text-2xl" />
                  </div>
                  <span className="font-semibold text-gray-800">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Featured Events Section */}
        <section className="mb-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900">Featured Events</h2>
              <p className="mt-2 text-gray-600">Handpicked upcoming experiences for you</p>
            </div>
            <Link
              to="/events"
              className="text-primary-600 hover:text-primary-700 font-bold hover:underline transition-colors hidden sm:block"
            >
              View All Events &rarr;
            </Link>
          </div>

          {loading ? (
            <Spinner />
          ) : events.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
              <p className="text-gray-500">No events found. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}

          <div className="text-center mt-10 sm:hidden">
            <Link
              to="/events"
              className="inline-block bg-primary-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-primary-700 transition-all shadow"
            >
              View All Events
            </Link>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-24 bg-primary-50/50 rounded-3xl p-8 sm:p-12 border border-primary-100/50">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">How EventHub Works</h2>
            <p className="mt-2 text-gray-600">Get tickets to your favorite events in 3 easy steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl mb-4 font-bold">
                <FaSearch />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">1. Find Events</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Browse through multiple categories or search for specific comedy, music, tech, or sports events near you.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl mb-4 font-bold">
                <FaTicketAlt />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">2. Reserve Seats</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Select your seats and book securely. Get instant ticket confirmations sent straight to your dashboard.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col items-center">
              <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xl mb-4 font-bold">
                <FaSmile />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">3. Attend & Enjoy</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Bring your digital ticket booking confirmation to the event venue, check in, and enjoy your memorable event!
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="mb-24 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow transition-shadow">
            <FaCity className="text-4xl text-primary-600 mx-auto mb-3" />
            <h4 className="text-3xl font-extrabold text-gray-900 mb-1">50+</h4>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Cities Covered</p>
          </div>
          <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow transition-shadow">
            <FaUsers className="text-4xl text-primary-600 mx-auto mb-3" />
            <h4 className="text-3xl font-extrabold text-gray-900 mb-1">10,000+</h4>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Happy Users</p>
          </div>
          <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow transition-shadow">
            <FaAward className="text-4xl text-primary-600 mx-auto mb-3" />
            <h4 className="text-3xl font-extrabold text-gray-900 mb-1">500+</h4>
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Events Hosted</p>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="relative bg-gradient-to-r from-primary-700 to-indigo-800 rounded-3xl p-8 sm:p-12 text-white overflow-hidden shadow-lg">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="relative max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold mb-3">Never Miss An Event</h2>
            <p className="text-primary-100 mb-8 text-sm sm:text-base">
              Subscribe to our weekly newsletter to get the latest tech meetups, workshops, and concert updates delivered directly to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-grow px-4 py-3 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 bg-white"
                required
              />
              <button
                type="submit"
                className="bg-yellow-400 hover:bg-yellow-300 text-gray-950 font-bold px-6 py-3 rounded-lg transition-colors text-sm shadow-md cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
