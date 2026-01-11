import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";
import toast from "react-hot-toast";

const Register = () => {
  console.log('Register component rendered');

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // default role
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log('Submitting registration form with data:', formData);

    try {
      console.log('Calling register API...');
      const res = await register(formData);
      console.log('Registration response:', res);

      if (res.success) {
        console.log('✅ Registration successful! User saved to database.');
        toast.success("Registered successfully! Please login.");
        navigate("/login");
      } else {
        console.error('❌ Registration failed:', res.error);
        toast.error(res.error);
      }
    } catch (err) {
      console.error('❌ Registration error:', err);
      console.error('❌ Data not saved to database.');
      toast.error(err.error || "Registration failed");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {/* ROLE SELECT */}
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
          <option value="event_manager">Event Manager</option>
        </select>

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
