import express from 'express';
import {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route for booking an event (User) or viewing all bookings (Admin)
router.route('/')
  .post(protect, createBooking)
  .get(protect, admin, getAllBookings);

// Route for a user to see their own bookings
router.route('/my-bookings').get(protect, getMyBookings);

// Route for a user to cancel a booking
router.route('/:id/cancel').put(protect, cancelBooking);

export default router;
