import Event from '../models/Event.js';

// @desc    Get all events with search and filter
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    // Search filter
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    // Populate creator's details
    const events = await Event.find(query).populate('creator', 'name email');
    return res.json(events);
  } catch (error) {
    console.error('Get events error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('creator', 'name email');

    if (event) {
      return res.json(event);
    } else {
      return res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    console.error('Get event by ID error:', error.message);
    return res.status(500).json({ message: 'Invalid Event ID or database error' });
  }
};

// @desc    Create a new event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res) => {
  const { title, description, date, time, location, category, price, image, capacity } = req.body;

  try {
    const event = new Event({
      title,
      description,
      date,
      time,
      location,
      category,
      price: price || 0,
      image,
      capacity,
      availableSeats: capacity, // initially all seats are open
      creator: req.user._id,
    });

    const createdEvent = await event.save();
    return res.status(201).json(createdEvent);
  } catch (error) {
    console.error('Create event error:', error.message);
    return res.status(400).json({ message: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = async (req, res) => {
  const { title, description, date, time, location, category, price, image, capacity } = req.body;

  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      const bookedSeats = event.capacity - event.availableSeats;

      event.title = title || event.title;
      event.description = description || event.description;
      event.date = date || event.date;
      event.time = time || event.time;
      event.location = location || event.location;
      event.category = category || event.category;
      event.price = price !== undefined ? price : event.price;
      event.image = image || event.image;

      // Handle capacity update
      if (capacity !== undefined) {
        event.capacity = capacity;
        event.availableSeats = capacity - bookedSeats;
        if (event.availableSeats < 0) {
          return res.status(400).json({ message: 'Capacity cannot be less than booked seats' });
        }
      }

      const updatedEvent = await event.save();
      return res.json(updatedEvent);
    } else {
      return res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    console.error('Update event error:', error.message);
    return res.status(400).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      await event.deleteOne();
      return res.json({ message: 'Event deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    console.error('Delete event error:', error.message);
    return res.status(500).json({ message: error.message });
  }
};
