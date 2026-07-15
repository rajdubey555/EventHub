import React from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const Hero = () => {
  return (
    <div className="relative bg-gradient-to-r from-primary-600 to-indigo-700 py-20 px-6 sm:px-12 lg:px-24 text-white overflow-hidden shadow-lg">
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
      <div className="relative max-w-4xl mx-auto text-center">
        {/* Title */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Unforgettable Events, <br />
          <span className="text-yellow-300">Seamless Bookings</span>
        </h1>
        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
          Explore and book tickets for the latest workshops, live music concerts, comedy nights, and sports events near you.
        </p>
        {/* Explore button */}
        <div className="flex justify-center">
          <Link
            to="/events"
            className="inline-flex items-center bg-white text-primary-700 hover:bg-gray-100 font-bold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            Explore Events <FaArrowRight className="ml-2 text-sm" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
