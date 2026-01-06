import { useState } from "react";
import API from "../api/api";

export default function BookEvent() {
  const [form, setForm] = useState({
    customer: "",
    service: "",
    eventDate: "",
    location: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/bookings", form);
      alert("Booking created successfully!");
      // Reset form
      setForm({
        customer: "",
        service: "",
        eventDate: "",
        location: ""
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("Failed to create booking. Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      <h2>Book an Event</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Customer Name:
            <input
              type="text"
              name="customer"
              value={form.customer}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </label>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Service:
            <input
              type="text"
              name="service"
              value={form.service}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </label>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Event Date:
            <input
              type="date"
              name="eventDate"
              value={form.eventDate}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </label>
        </div>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>
            Location:
            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '8px' }}
            />
          </label>
        </div>
        
        <button 
          type="submit" 
          style={{
            backgroundColor: '#4CAF50',
            color: 'white',
            padding: '10px 15px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Book Event
        </button>
      </form>

      <form onSubmit={submit}>
        <input placeholder="Customer Id"
               onChange={(e)=>setForm({...form, customer:e.target.value})}/>

        <input placeholder="Service Id"
               onChange={(e)=>setForm({...form, service:e.target.value})}/>

        <input type="date"
               onChange={(e)=>setForm({...form, eventDate:e.target.value})}/>

        <input placeholder="Location"
               onChange={(e)=>setForm({...form, location:e.target.value})}/>

        <button>Create Booking</button>
      </form>
    </div>
  );
}
