import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from "../services/api";

export default function BookEvent() {
  const [formData, setFormData] = useState({
    service: "",
    eventDate: "",
    location: "",
    notes: ""
  });
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch services when component mounts
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get('/services');
        setServices(response.data.data);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Failed to load services. Please try again later.');
      }
    };

    fetchServices();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.service || !formData.eventDate || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      // Get the token from local storage
      const token = localStorage.getItem('token');
      
      if (!token) {
        // Redirect to login if no token is found
        navigate('/login', { state: { from: '/book-event' } });
        return;
      }

      // Format the date for the backend
      const bookingData = {
        ...formData,
        eventDate: new Date(formData.eventDate).toISOString(),
        service: formData.service // This should be the service ID
      };

      // Make the API call
      const response = await api.post('/bookings', bookingData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      // Handle successful booking
      if (response.data.success) {
        alert('Booking created successfully!');
        // Reset form
        setFormData({
          service: "",
          eventDate: "",
          location: "",
          notes: ""
        });
        // Optionally redirect to bookings list or dashboard
        // navigate('/dashboard');
      }
    } catch (err) {
      console.error('Error creating booking:', err);
      
      // Handle different types of errors
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        if (err.response.status === 401) {
          // Unauthorized - redirect to login
          navigate('/login', { state: { from: '/book-event' } });
          return;
        }
        setError(err.response.data.message || 'Failed to create booking. Please try again.');
      } else if (err.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request
        setError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Book an Event</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="service">
            Service <span className="text-red-500">*</span>
          </label>
          <select
            id="service"
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a service</option>
            {services.map(service => (
              <option key={service._id} value={service._id}>
                {service.name} - ${service.price}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="eventDate">
            Event Date & Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            id="eventDate"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            required
            min={new Date().toISOString().slice(0, 16)} // Prevent past dates
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Enter event location"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
            Additional Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any special requirements or notes..."
            rows="3"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Processing...' : 'Book Now'}
          </button>
          
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
        </div>
      </form>
      
      <p className="text-center text-gray-500 text-xs">
        * Required fields
      </p>
    </div>
  );
}
