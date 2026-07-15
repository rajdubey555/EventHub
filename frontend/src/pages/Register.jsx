import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { loginStart, loginSuccess, loginFailure, clearError } from '../store/authSlice';
import api from '../utils/api';
import { FaUser, FaEnvelope, FaLock, FaUserPlus, FaUserTag } from 'react-icons/fa';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user'); // user or admin selection

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // If authenticated, redirect
    if (userInfo) {
      if (userInfo.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }

    // Clear error when leaving component
    return () => {
      dispatch(clearError());
    };
  }, [userInfo, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation checks
    if (!name || !email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    dispatch(loginStart());
    try {
      const { data } = await api.post('/auth/register', { name, email, password, role });
      dispatch(loginSuccess(data));
      toast.success(`Registration successful! Welcome, ${data.name}!`);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed. Try again.';
      dispatch(loginFailure(errMsg));
      toast.error(errMsg);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="mt-1.5 text-sm text-gray-500">Join EventHub and get started</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <FaUser className="absolute left-3.5 top-3 text-gray-400" />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <FaEnvelope className="absolute left-3.5 top-3 text-gray-400" />
            </div>
          </div>

          {/* Role Picker (Common in college testing projects) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Register As</label>
            <div className="relative">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none bg-white focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="user">Regular User (Customer)</option>
                <option value="admin">Admin (Organizer)</option>
              </select>
              <FaUserTag className="absolute left-3.5 top-3 text-gray-400" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <FaLock className="absolute left-3.5 top-3 text-gray-400" />
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <FaLock className="absolute left-3.5 top-3 text-gray-400" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-lg transition-colors text-sm shadow"
          >
            {loading ? (
              'Creating account...'
            ) : (
              <>
                <FaUserPlus className="mr-2" /> Register
              </>
            )}
          </button>
        </form>

        {/* Toggle Page Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 hover:underline font-semibold">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
