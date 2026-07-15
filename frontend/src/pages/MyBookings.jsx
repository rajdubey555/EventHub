import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import api from '../utils/api';
import { FaCalendarAlt, FaMapMarkerAlt, FaTicketAlt, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch current user's bookings
  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings/my-bookings');
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Cancel booking handler
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled successfully!');
      
      // Update local state status to 'cancelled' and restore seats in display
      setBookings((prevBookings) =>
        prevBookings.map((b) => {
          if (b._id === bookingId) {
            return {
              ...b,
              status: 'cancelled',
              event: {
                ...b.event,
                availableSeats: b.event.availableSeats + b.seatsBooked,
              },
            };
          }
          return b;
        })
      );
    } catch (err) {
      console.error('Cancel booking error:', err);
      toast.error(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">My Bookings</h1>
        <p className="mt-1 text-gray-500">Track and manage your booked event tickets</p>
      </div>

      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
          <p className="text-gray-500 mb-6">You haven't booked any events yet.</p>
          <Link
            to="/events"
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-5 py-2.5 rounded-lg shadow transition-colors inline-block text-sm"
          >
            Find Events
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const event = booking.event;
            
            // Handle cases where the event details might have been removed or are missing
            if (!event) {
              return (
                <div key={booking._id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm text-gray-500 italic text-sm">
                  This event details are no longer available.
                </div>
              );
            }

            const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={booking._id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:shadow"
              >
                {/* Event Thumbnail & Info */}
                <div className="flex gap-4 items-start sm:items-center">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 hidden sm:block">
                    <img
                      src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80'}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <Link to={`/events/${event._id}`} className="text-lg font-bold text-gray-900 hover:text-primary-600 transition-colors line-clamp-1">
                      {event.title}
                    </Link>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-1">
                      <span className="flex items-center">
                        <FaCalendarAlt className="mr-1 text-primary-500" />
                        {formattedDate} at {event.time}
                      </span>
                      <span className="flex items-center">
                        <FaMapMarkerAlt className="mr-1 text-primary-500" />
                        {event.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking stats & buttons */}
                <div className="flex flex-wrap items-center justify-between md:justify-end gap-x-8 gap-y-4 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100">
                  
                  {/* Quantity and Price */}
                  <div className="text-sm">
                    <div className="text-gray-500 font-medium">
                      Seats: <span className="text-gray-900 font-bold">{booking.seatsBooked}</span>
                    </div>
                    <div className="text-gray-500 font-medium">
                      Total: <span className="text-gray-900 font-extrabold">₹{booking.totalPrice}</span>
                    </div>
                  </div>

                  {/* Status Tag */}
                  <div>
                    {booking.status === 'booked' ? (
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-green-200">
                        <FaCheckCircle /> Confirmed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-red-200">
                        <FaTimesCircle /> Cancelled
                      </span>
                    )}
                  </div>

                  {/* Cancel Button */}
                  {booking.status === 'booked' && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
