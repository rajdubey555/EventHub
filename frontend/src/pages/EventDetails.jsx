import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import api from '../utils/api';
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTicketAlt, FaRupeeSign } from 'react-icons/fa';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
      } catch (err) {
        console.error('Error fetching event details:', err);
        toast.error('Event not found or database error');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };
    fetchEventDetails();
  }, [id, navigate]);

  const handleBooking = async () => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    setBookingLoading(true);
    try {
      await api.post('/bookings', {
        eventId: event._id,
        seatsBooked: Number(seatsToBook),
      });

      toast.success('Event booked successfully!');
      
      // Update local seats count directly or refetch
      setEvent((prevEvent) => ({
        ...prevEvent,
        availableSeats: prevEvent.availableSeats - seatsToBook,
      }));
      setSeatsToBook(1);

      // Redirect to bookings list
      navigate('/my-bookings');
    } catch (err) {
      console.error('Booking error:', err);
      toast.error(err.response?.data?.message || 'Failed to book event');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) return <Spinner />;
  if (!event) return <div className="text-center py-20">Event not found.</div>;

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  // Calculate percentage of seats filled
  const seatsFilledPercentage = ((event.capacity - event.availableSeats) / event.capacity) * 100;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back button */}
      <Link to="/events" className="text-primary-600 hover:text-primary-700 font-bold mb-6 inline-block">
        &larr; Back to Events
      </Link>

      <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 md:p-8">
        
        {/* Event Image */}
        <div className="h-64 sm:h-80 md:h-full rounded-xl overflow-hidden shadow-inner">
          <img
            src={event.image || 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Event Meta and Booking Action */}
        <div className="flex flex-col justify-between">
          <div>
            <span className="bg-primary-100 text-primary-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {event.category}
            </span>
            <h1 className="text-3xl font-extrabold text-gray-900 mt-3 mb-4">{event.title}</h1>
            
            {/* Short specs list */}
            <div className="space-y-3.5 text-gray-700 mb-6">
              <p className="flex items-center">
                <FaCalendarAlt className="mr-3 text-primary-500 text-lg flex-shrink-0" />
                <span>{formattedDate}</span>
              </p>
              <p className="flex items-center">
                <FaClock className="mr-3 text-primary-500 text-lg flex-shrink-0" />
                <span>{event.time}</span>
              </p>
              <p className="flex items-center">
                <FaMapMarkerAlt className="mr-3 text-primary-500 text-lg flex-shrink-0" />
                <span>{event.location}</span>
              </p>
              <p className="flex items-center">
                <FaRupeeSign className="mr-3 text-primary-500 text-lg flex-shrink-0" />
                <span className="font-bold text-gray-900 text-lg">
                  {event.price === 0 ? 'Free Entry' : `₹${event.price}`}
                </span>
              </p>
            </div>

            {/* Description */}
            <div className="border-t border-gray-100 pt-6 mb-6">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{event.description}</p>
            </div>

            {/* Seat Capacity Tracker */}
            <div className="mb-6">
              <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                <span>SEAT AVAILABILITY</span>
                <span>{event.availableSeats} / {event.capacity} seats left</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    seatsFilledPercentage > 85 ? 'bg-red-500' : 'bg-primary-600'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, 100 - seatsFilledPercentage))}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Booking Widget */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
            {event.availableSeats === 0 ? (
              <button disabled className="w-full bg-gray-300 text-gray-500 font-bold py-3 px-4 rounded-lg cursor-not-allowed text-center">
                Sold Out
              </button>
            ) : userInfo && userInfo.role === 'admin' ? (
              <p className="text-sm text-center text-red-500 font-bold py-2">
                Admins are not authorized to book events.
              </p>
            ) : (
              <div className="flex items-center gap-3">
                {userInfo && (
                  <div className="w-20">
                    <select
                      value={seatsToBook}
                      onChange={(e) => setSeatsToBook(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                      {[...Array(Math.min(5, event.availableSeats)).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1} seat{x > 0 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                <button
                  onClick={handleBooking}
                  disabled={bookingLoading}
                  className="flex-grow bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 px-4 rounded-lg shadow transition-colors text-center text-sm"
                >
                  {userInfo ? (bookingLoading ? 'Booking...' : 'Book Event') : 'Login to Book'}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default EventDetails;
