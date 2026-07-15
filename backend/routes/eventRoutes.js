import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to view events, Admin route to create an event
router.route('/')
  .get(getEvents)
  .post(protect, admin, createEvent);

// Public route to view details, Admin routes to update/delete an event
router.route('/:id')
  .get(getEventById)
  .put(protect, admin, updateEvent)
  .delete(protect, admin, deleteEvent);

export default router;
