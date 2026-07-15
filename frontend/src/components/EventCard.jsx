import React from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaCalendarAlt, FaTicketAlt } from 'react-icons/fa';

// Card showing quick details of an event
const EventCard = ({ event }) => {
  const { _id, title, category, location, date, price, image, availableSeats } = event;

  // Format date readable (e.g. Oct 12, 2026)
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all flex flex-col border border-gray-100">
      {/* Thumbnail Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80'}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {/* Category Tag */}
        <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-md uppercase tracking-wider shadow">
          {category}
        </span>
      </div>

      {/* Info Content */}
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{title}</h3>

        <div className="space-y-2 text-sm text-gray-600 mb-4 flex-grow">
          {/* Date */}
          <p className="flex items-center">
            <FaCalendarAlt className="mr-2 text-primary-500" />
            {formattedDate}
          </p>
          {/* Location */}
          <p className="flex items-center">
            <FaMapMarkerAlt className="mr-2 text-primary-500 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </p>
          {/* Seats Availability */}
          <p className="flex items-center">
            <FaTicketAlt className="mr-2 text-primary-500" />
            {availableSeats > 0 ? (
              <span className="text-green-600 font-semibold">{availableSeats} seats left</span>
            ) : (
              <span className="text-red-500 font-semibold">Sold Out</span>
            )}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
          <span className="text-lg font-extrabold text-gray-900">
            {price === 0 ? 'Free' : `₹${price}`}
          </span>
          <Link
            to={`/events/${_id}`}
            className="bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all shadow-sm hover:shadow"
          >
            Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
