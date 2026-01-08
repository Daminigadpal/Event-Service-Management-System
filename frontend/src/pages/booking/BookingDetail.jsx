// frontend/src/pages/booking/BookingDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`/api/bookings/${id}`);
        setBooking(response.data);
      } catch (err) {
        setError('Failed to fetch booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const updateStatus = async (newStatus) => {
    try {
      await axios.patch(`/api/bookings/${id}/status`, { status: newStatus });
      setBooking(prev => ({ ...prev, status: newStatus }));
    } catch (err) {
      setError('Failed to update booking status');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!booking) return <div>Booking not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Booking Details</h1>
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-indigo-600 hover:text-indigo-900"
        >
          &larr; Back to list
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 bg-gray-50">
          <h2 className="text-lg font-medium text-gray-900">
            {booking.eventType} Event
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Booking ID: {booking._id}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <select
                  value={booking.status}
                  onChange={(e) => updateStatus(e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  {['Inquiry', 'Quoted', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Event Dates</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {booking.eventDates.map((date, index) => (
                  <div key={index}>{new Date(date).toLocaleDateString()}</div>
                ))}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {booking.location}
              </dd>
            </div>
            {booking.specialRequests && (
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Special Requests</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {booking.specialRequests}
                </dd>
              </div>
            )}
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Assigned Staff</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {booking.assignedStaff?.length > 0 
                  ? booking.assignedStaff.map(staff => staff.name).join(', ')
                  : 'No staff assigned'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;