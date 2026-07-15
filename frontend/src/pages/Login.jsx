import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { loginStart, loginSuccess, loginFailure, clearError } from '../store/authSlice';
import api from '../utils/api';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // If user is already authenticated, redirect them
    if (userInfo) {
      if (userInfo.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }

    // Clean up error state when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [userInfo, navigate, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    dispatch(loginStart());
    try {
      const { data } = await api.post('/auth/login', { email, password });
      dispatch(loginSuccess(data));
      toast.success(`Welcome back, ${data.name}!`);
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Invalid email or password';
      dispatch(loginFailure(errMsg));
      toast.error(errMsg);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="mt-1.5 text-sm text-gray-500">Sign in to your EventHub account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
            <div className="relative">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <FaEnvelope className="absolute left-3.5 top-3 text-gray-400" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
              'Signing in...'
            ) : (
              <>
                <FaSignInAlt className="mr-2" /> Sign In
              </>
            )}
          </button>
        </form>

        {/* Toggle Page Link */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
