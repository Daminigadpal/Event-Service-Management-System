import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function BookEvent() {
  const [formData, setFormData] = useState({
    service: "",
    eventDate: "",
    location: "",
    notes: "",
    status: "Inquiry" // default booking status
  });

  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.get("/services");
        setServices(response.data.data);
      } catch (err) {
        console.error("Error fetching services:", err);
        setError("Failed to load services. Please try again later.");
      }
    };

    fetchServices();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit booking
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.service || !formData.eventDate || !formData.location) {
      setError("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login", { state: { from: "/book-event" } });
        return;
      }

      const bookingData = {
        ...formData,
        eventDate: new Date(formData.eventDate).toISOString()
      };

      const response = await api.post("/bookings", bookingData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        alert("Booking created successfully!");
        setFormData({
          service: "",
          eventDate: "",
          location: "",
          notes: "",
          status: "Inquiry"
        });
      }
    } catch (err) {
      console.error("Error creating booking:", err);

      if (err.response) {
        if (err.response.status === 401) {
          navigate("/login", { state: { from: "/book-event" } });
          return;
        }
        setError(err.response.data.message || "Failed to create booking.");
      } else if (err.request) {
        setError("No response from server. Please check your connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-center mb-6">
        Book an Event
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8"
      >
        {/* DEBUG: This should always be visible */}
        <div style={{ backgroundColor: 'red', color: 'white', padding: '20px', margin: '20px 0', textAlign: 'center' }}>
          DEBUG: Form is rendering! Status value: {formData.status}
        </div>

        {/* Service */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Service <span className="text-red-500">*</span>
          </label>
          <select
            name="service"
            value={formData.service}
            onChange={handleChange}
            required
            className="shadow border rounded w-full py-2 px-3"
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service._id} value={service._id}>
                {service.name} - ₹{service.price}
              </option>
            ))}
          </select>
        </div>

        {/* Status */}
        <div className="mb-4" style={{ border: '2px solid red', padding: '10px', backgroundColor: 'yellow' }}>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Booking Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="shadow border rounded w-full py-2 px-3"
            style={{
              display: 'block',
              width: '100%',
              padding: '8px 12px',
              border: '1px solid #d1d5db',
              borderRadius: '6px',
              backgroundColor: 'white',
              fontSize: '16px'
            }}
          >
            <option value="Inquiry">Inquiry</option>
            <option value="Quoted">Quoted</option>
            <option value="Confirmed">Confirmed</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
          {/* Debug: Show current status */}
          <p className="text-xs text-gray-500 mt-1">Current status: {formData.status}</p>
        </div>

        {/* Event Date */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Event Date & Time <span className="text-red-500">*</span>
          </label>
          <input
            type="datetime-local"
            name="eventDate"
            value={formData.eventDate}
            onChange={handleChange}
            required
            min={new Date().toISOString().slice(0, 16)}
            className="shadow border rounded w-full py-2 px-3"
          />
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Enter event location"
            className="shadow border rounded w-full py-2 px-3"
          />
        </div>

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="shadow border rounded w-full py-2 px-3"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isLoading ? "Processing..." : "Book Now"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </form>

      <p className="text-center text-gray-500 text-xs mt-4">
        * Required fields
      </p>
    </div>
  );
}
