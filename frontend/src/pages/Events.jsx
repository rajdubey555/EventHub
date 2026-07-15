import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Spinner from '../components/Spinner';
import EventCard from '../components/EventCard';
import api from '../utils/api';
import { FaSearch } from 'react-icons/fa';

const categories = ['All', 'Tech', 'Music', 'Sports', 'Comedy', 'Workshop'];

const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Read category from URL params if present, default to 'All'
  const categoryParam = searchParams.get('category') || 'All';

  useEffect(() => {
    const fetchFilteredEvents = async () => {
      setLoading(true);
      try {
        let url = `/events?category=${categoryParam}`;
        if (searchParams.get('search')) {
          url += `&search=${searchParams.get('search')}`;
        }
        const { data } = await api.get(url);
        setEvents(data);
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredEvents();
  }, [categoryParam, searchParams]);

  // Handle category tab toggle
  const handleCategorySelect = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
  };

  // Handle text search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm.trim() === '') {
      newParams.delete('search');
    } else {
      newParams.set('search', searchTerm.trim());
    }
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Browse Events</h1>
        <p className="mt-1 text-gray-500">Discover what is happening and book your spot</p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Category Toggles */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                categoryParam === cat
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input form */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-md w-full">
          <input
            type="text"
            placeholder="Search events by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-24 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
          />
          <FaSearch className="absolute left-3.5 top-3 text-gray-400" />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-primary-600 hover:bg-primary-700 text-white px-4 rounded-md text-xs font-bold transition-colors"
          >
            Search
          </button>
        </form>

      </div>

      {/* Events Results Grid */}
      {loading ? (
        <Spinner />
      ) : events.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-lg text-gray-500">No events matched your criteria. Try another search or filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Events;
