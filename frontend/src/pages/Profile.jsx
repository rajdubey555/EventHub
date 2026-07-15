import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateProfileStart, updateProfileSuccess, updateProfileFailure, clearError } from '../store/authSlice';
import api from '../utils/api';
import { FaUser, FaEnvelope, FaLock, FaCheck } from 'react-icons/fa';

const Profile = () => {
  const dispatch = useDispatch();
  const { userInfo, loading } = useSelector((state) => state.auth);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }

    return () => {
      dispatch(clearError());
    };
  }, [userInfo, dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error('Name and Email are required');
      return;
    }

    // If password is typed, check matching and length
    if (password) {
      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters long');
        return;
      }
    }

    dispatch(updateProfileStart());
    try {
      const payload = { name, email };
      if (password) {
        payload.password = password;
      }

      const { data } = await api.put('/auth/profile', payload);
      dispatch(updateProfileSuccess(data));
      toast.success('Profile updated successfully!');
      
      // Clear password inputs
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Update profile error:', err);
      const errMsg = err.response?.data?.message || 'Failed to update profile';
      dispatch(updateProfileFailure(errMsg));
      toast.error(errMsg);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">My Profile</h2>
          <p className="mt-1.5 text-sm text-gray-500">Update your account information</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
            <div className="relative">
              <input
                type="text"
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                required
              />
              <FaEnvelope className="absolute left-3.5 top-3 text-gray-400" />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-5 mt-5">
            <p className="text-xs text-gray-500 mb-4 font-semibold uppercase tracking-wider">
              Change Password (Leave blank to keep current)
            </p>

            {/* New Password */}
            <div className="mb-4">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
                <FaLock className="absolute left-3.5 top-3 text-gray-400" />
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Repeat new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
                />
                <FaLock className="absolute left-3.5 top-3 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-lg transition-colors text-sm shadow"
          >
            {loading ? (
              'Saving changes...'
            ) : (
              <>
                <FaCheck className="mr-2" /> Save Changes
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Profile;
