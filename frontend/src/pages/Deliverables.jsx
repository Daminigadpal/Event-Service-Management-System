import { useState } from "react";
import API from "../api/api";

export default function Deliverables() {
  const [form, setForm] = useState({
    booking: "",
    type: "photos",
    files: []
  });

  const submit = async (e) => {
    e.preventDefault();
    await API.post("/deliverables", form);
    alert("Deliverable saved");
  };

  return (
    <div>
      <h2>Deliverables</h2>

      <form onSubmit={submit}>
        <input placeholder="Booking Id"
               onChange={(e)=>setForm({...form, booking:e.target.value})}/>

        <select onChange={(e)=>setForm({...form, type:e.target.value})}>
          <option value="photos">Photos</option>
          <option value="videos">Videos</option>
          <option value="album">Album</option>
        </select>

        <button>Save</button>
      </form>
    </div>
  );
}
