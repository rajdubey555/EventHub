import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="max-w-md mx-auto text-center py-20 px-4">
      <h1 className="text-7xl font-extrabold text-primary-600 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
      <p className="text-gray-500 mb-8">
        Oops! The page you are looking for does not exist, has been removed, or is temporarily unavailable.
      </p>
      <Link
        to="/"
        className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-lg shadow transition-colors inline-block"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
