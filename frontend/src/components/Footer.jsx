import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-950 text-gray-400 py-10 mt-auto border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Col */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">EventHub</h3>
            <p className="text-sm">
              Discover, book, and enjoy the best events in your area. Your next memorable experience is just a few clicks away!
            </p>
          </div>
          {/* Quick Links Col */}
          <div>
            <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-primary-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-primary-400 transition-colors">Events</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-primary-400 transition-colors">Login</Link>
              </li>
            </ul>
          </div>
          {/* Support Info Col */}
          <div>
            <h4 className="text-sm font-semibold text-gray-200 uppercase tracking-wider mb-4">Support</h4>
            <p className="text-sm">
              Questions? Reach out to support at <a href="mailto:support@eventhub.com" className="text-primary-400 hover:underline">support@eventhub.com</a>
            </p>
            <p className="text-xs text-gray-500 mt-4">
              Designed as a College MERN stack showcase project.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-900 mt-8 pt-6 text-center text-xs">
          &copy; {new Date().getFullYear()} EventHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
