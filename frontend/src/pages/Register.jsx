import { useState } from "react";
import API from "../api/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer"
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post("/auth/register", form);
    alert("Registered! You can login now.");
  };

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Name"
               onChange={(e)=>setForm({...form, name:e.target.value})} />

        <input placeholder="Email"
               onChange={(e)=>setForm({...form, email:e.target.value})} />

        <input type="password"
               placeholder="Password"
               onChange={(e)=>setForm({...form, password:e.target.value})} />

        <select onChange={(e)=>setForm({...form, role:e.target.value})}>
          <option value="customer">Customer</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}
