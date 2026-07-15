import express from 'express';
import { getUsers } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Admin-only route to view all registered users
router.route('/').get(protect, admin, getUsers);

export default router;
