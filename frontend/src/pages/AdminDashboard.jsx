import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import api from '../utils/api';
import { FaPlus, FaEdit, FaTrash, FaCalendarAlt, FaUsers, FaClipboardList, FaTimes } from 'react-icons/fa';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('events'); // events, bookings, users

  // Lists
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  // Loadings
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('Tech');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [capacity, setCapacity] = useState('');

  // Load all dashboard records in parallel to show analytics summary
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [eventsRes, bookingsRes, usersRes] = await Promise.all([
        api.get('/events'),
        api.get('/bookings'),
        api.get('/users'),
      ]);
      setEvents(eventsRes.data);
      setBookings(bookingsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Error loading dashboard records:', err.message);
      toast.error('Failed to retrieve dashboard records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Format date helper for input type="date"
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    const month = `${d.getMonth() + 1}`.padStart(2, '0');
    const day = `${d.getDate()}`.padStart(2, '0');
    const year = d.getFullYear();
    return [year, month, day].join('-');
  };

  // Open modal for Adding a new event
  const openAddModal = () => {
    setEditMode(false);
    setSelectedEventId(null);
    setTitle('');
    setDescription('');
    setDate('');
    setTime('');
    setLocation('');
    setCategory('Tech');
    setPrice(0);
    setImage('');
    setCapacity(50);
    setShowModal(true);
  };

  // Open modal for Editing an event
  const openEditModal = (event) => {
    setEditMode(true);
    setSelectedEventId(event._id);
    setTitle(event.title);
    setDescription(event.description);
    setDate(formatDateForInput(event.date));
    setTime(event.time);
    setLocation(event.location);
    setCategory(event.category);
    setPrice(event.price);
    setImage(event.image || '');
    setCapacity(event.capacity);
    setShowModal(true);
  };

  // Submit Handler (Add or Edit Event)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !date || !time || !location || !capacity) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitLoading(true);
    const eventPayload = {
      title,
      description,
      date,
      time,
      location,
      category,
      price: Number(price),
      image: image || undefined,
      capacity: Number(capacity),
    };

    try {
      if (editMode) {
        await api.put(`/events/${selectedEventId}`, eventPayload);
        toast.success('Event updated successfully!');
      } else {
        await api.post('/events', eventPayload);
        toast.success('Event created successfully!');
      }
      setShowModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error('Submit event error:', err);
      toast.error(err.response?.data?.message || 'Failed to submit event details');
    } finally {
      setSubmitLoading(false);
    }
  };

  // Delete event handler
  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event? This will erase all connected data.')) {
      return;
    }

    try {
      await api.delete(`/events/${eventId}`);
      toast.success('Event deleted successfully!');
      fetchDashboardData();
    } catch (err) {
      console.error('Delete event error:', err);
      toast.error(err.response?.data?.message || 'Failed to delete event');
    }
  };

  // Calculate summary counts from existing states
  const totalEvents = events.length;
  const totalUsers = users.length;
  const confirmedBookings = bookings.filter((b) => b.status === 'booked');
  const totalBookings = confirmedBookings.length;
  const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
        <p className="mt-1 text-gray-500">Manage your events catalog, user registrations, and ticket bookings</p>
      </div>

      {/* Analytics Summary Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Events */}
        <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Total Events</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-1 block">{totalEvents}</span>
          </div>
          <div className="p-3 bg-primary-50 text-primary-600 rounded-lg">
            <FaCalendarAlt className="text-xl" />
          </div>
        </div>
        
        {/* Total Bookings */}
        <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Confirmed Bookings</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-1 block">{totalBookings}</span>
          </div>
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <FaClipboardList className="text-xl" />
          </div>
        </div>

        {/* Total Users */}
        <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Registered Users</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-1 block">{totalUsers}</span>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FaUsers className="text-xl" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Total Revenue</span>
            <span className="text-2xl font-extrabold text-gray-900 mt-1 block">₹{totalRevenue}</span>
          </div>
          <div className="p-3 bg-yellow-50 text-yellow-600 rounded-lg">
            <span className="text-xl font-bold font-sans">₹</span>
          </div>
        </div>
      </div>

      {/* Tabs list bar */}
      <div className="flex border-b border-gray-200 mb-8 gap-6">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center pb-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'events'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <FaCalendarAlt className="mr-2" /> Events
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          className={`flex items-center pb-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'bookings'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <FaClipboardList className="mr-2" /> Bookings
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center pb-4 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'users'
              ? 'border-primary-600 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <FaUsers className="mr-2" /> Users
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <Spinner />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* 1. EVENTS TAB */}
          {activeTab === 'events' && (
            <div>
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900">Events Catalog</h3>
                <button
                  onClick={openAddModal}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-4 py-2 rounded-lg text-sm flex items-center shadow transition-colors"
                >
                  <FaPlus className="mr-1.5 text-xs" /> Add Event
                </button>
              </div>

              {events.length === 0 ? (
                <div className="text-center py-16 text-gray-500">No events present. Create one above!</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                    <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-bold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Title</th>
                        <th className="px-6 py-4">Category</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Seats Left</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {events.map((ev) => (
                        <tr key={ev._id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 font-semibold text-gray-900 line-clamp-1">{ev.title}</td>
                          <td className="px-6 py-4">
                            <span className="bg-primary-50 text-primary-700 text-xs px-2 py-0.5 rounded font-bold uppercase">
                              {ev.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">
                            {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4 text-gray-900 font-semibold">₹{ev.price}</td>
                          <td className="px-6 py-4 text-gray-600">
                            {ev.availableSeats} / {ev.capacity}
                          </td>
                          <td className="px-6 py-4 text-right space-x-3">
                            <button
                              onClick={() => openEditModal(ev)}
                              className="text-primary-600 hover:text-primary-900 font-bold"
                              title="Edit"
                            >
                              <FaEdit className="inline" />
                            </button>
                            <button
                              onClick={() => handleDeleteEvent(ev._id)}
                              className="text-red-600 hover:text-red-950 font-bold"
                              title="Delete"
                            >
                              <FaTrash className="inline" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 2. BOOKINGS TAB */}
          {activeTab === 'bookings' && (
            <div>
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900">Reservations Record</h3>
              </div>

              {bookings.length === 0 ? (
                <div className="text-center py-16 text-gray-500">No bookings have been made yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                    <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-bold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Event</th>
                        <th className="px-6 py-4">Seats</th>
                        <th className="px-6 py-4">Total Cost</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Booked Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {bookings.map((bk) => (
                        <tr key={bk._id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 text-gray-900 font-semibold">
                            <div>{bk.user?.name || 'Deleted User'}</div>
                            <div className="text-xs text-gray-500 font-normal">{bk.user?.email}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 font-semibold">{bk.event?.title || 'Deleted Event'}</td>
                          <td className="px-6 py-4 text-gray-900">{bk.seatsBooked}</td>
                          <td className="px-6 py-4 text-gray-900 font-bold">₹{bk.totalPrice}</td>
                          <td className="px-6 py-4">
                            {bk.status === 'booked' ? (
                              <span className="bg-green-50 text-green-700 text-xs px-2 py-0.5 rounded font-bold border border-green-200">
                                Confirmed
                              </span>
                            ) : (
                              <span className="bg-red-50 text-red-700 text-xs px-2 py-0.5 rounded font-bold border border-red-200">
                                Cancelled
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {new Date(bk.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* 3. USERS TAB */}
          {activeTab === 'users' && (
            <div>
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900">User Members</h3>
              </div>

              {users.length === 0 ? (
                <div className="text-center py-16 text-gray-500">No users found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                    <thead className="bg-gray-50/50 text-gray-500 uppercase text-xs font-bold tracking-wider">
                      <tr>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">Role</th>
                        <th className="px-6 py-4">Joined Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4 text-gray-900 font-semibold">{u.name}</td>
                          <td className="px-6 py-4 text-gray-600">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`text-xs px-2 py-0.5 rounded font-bold uppercase border ${
                              u.role === 'admin' 
                                ? 'bg-red-50 text-red-700 border-red-200' 
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* EVENT ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">
                {editMode ? 'Edit Event Details' : 'Create New Event'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes className="text-lg" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-grow text-sm">
              
              {/* Title */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Summer Music Gala"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Description *</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed event program outline..."
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  required
                ></textarea>
              </div>

              {/* Date & Time Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Date *</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Time Range *</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 6:00 PM - 9:00 PM"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    required
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Location *</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Street address, city or Venue name"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  required
                />
              </div>

              {/* Category & Price & Capacity Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none bg-white focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="Tech">Tech</option>
                    <option value="Music">Music</option>
                    <option value="Sports">Sports</option>
                    <option value="Comedy">Comedy</option>
                    <option value="Workshop">Workshop</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Math.max(0, Number(e.target.value)))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Capacity *</label>
                  <input
                    type="number"
                    value={capacity}
                    onChange={(e) => setCapacity(Math.max(1, Number(e.target.value)))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Image URL</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>

              {/* Modal Footer / Form Buttons */}
              <div className="border-t border-gray-100 pt-4 flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2 rounded-lg shadow transition-colors"
                >
                  {submitLoading ? 'Submitting...' : 'Submit'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
