import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    // Find all users except their passwords
    const users = await User.find({}).select('-password');
    return res.json(users);
  } catch (error) {
    console.error('Get users error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};
