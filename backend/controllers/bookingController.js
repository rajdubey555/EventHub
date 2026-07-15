import Booking from '../models/Booking.js';
import Event from '../models/Event.js';

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  const { eventId, seatsBooked } = req.body;

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check seat availability
    if (event.availableSeats < seatsBooked) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    const totalPrice = event.price * seatsBooked;

    // Create booking record
    const booking = new Booking({
      user: req.user._id,
      event: eventId,
      seatsBooked,
      totalPrice,
    });

    const createdBooking = await booking.save();

    // Deduct booked seats from the event
    event.availableSeats -= seatsBooked;
    await event.save();

    return res.status(201).json(createdBooking);
  } catch (error) {
    console.error('Create booking error:', error.message);
    return res.status(400).json({ message: error.message });
  }
};

// @desc    Get logged-in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    // Find bookings of user, populating the event details
    const bookings = await Booking.find({ user: req.user._id })
      .populate('event', 'title date time location category price image')
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (error) {
    console.error('Get my bookings error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Ensure users can only cancel their own bookings
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    // Mark as cancelled
    booking.status = 'cancelled';
    await booking.save();

    // Return the booked seats to the event capacity
    const event = await Event.findById(booking.event);
    if (event) {
      event.availableSeats += booking.seatsBooked;
      await event.save();
    }

    return res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    console.error('Cancel booking error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email')
      .populate('event', 'title date time location price')
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (error) {
    console.error('Get all bookings error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};
