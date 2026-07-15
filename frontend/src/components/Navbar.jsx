import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { FaBars, FaTimes, FaUser, FaCalendarAlt, FaTachometerAlt } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    setIsOpen(false);
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-extrabold text-primary-600 tracking-tight">EventHub</span>
            </Link>
            {/* Desktop Navigation Links */}
            <div className="hidden md:ml-8 md:flex md:space-x-6">
              <Link to="/" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-semibold transition-colors">
                Home
              </Link>
              <Link to="/events" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-semibold transition-colors">
                Events
              </Link>
            </div>
          </div>
          
          {/* Desktop User Status Actions */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {userInfo ? (
              <>
                {userInfo.role === 'admin' && (
                  <Link to="/admin" className="flex items-center text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-semibold transition-colors">
                    <FaTachometerAlt className="mr-1.5" /> Dashboard
                  </Link>
                )}
                <Link to="/my-bookings" className="flex items-center text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-semibold transition-colors">
                  <FaCalendarAlt className="mr-1.5" /> Bookings
                </Link>
                <Link to="/profile" className="flex items-center text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-semibold transition-colors">
                  <FaUser className="mr-1.5" /> {userInfo.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-semibold transition-all shadow-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-600 hover:text-primary-600 px-3 py-2 text-sm font-semibold transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all shadow-sm">
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Hamburger Menu Toggle (Mobile) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
            >
              {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Links */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2 px-4 space-y-1">
          <Link to="/" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
            Home
          </Link>
          <Link to="/events" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
            Events
          </Link>
          {userInfo ? (
            <>
              {userInfo.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                  Admin Dashboard
                </Link>
              )}
              <Link to="/my-bookings" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                My Bookings
              </Link>
              <Link to="/profile" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                Profile ({userInfo.name})
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50">
                Login
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-md text-base font-medium text-primary-600 hover:bg-gray-50 font-semibold">
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
