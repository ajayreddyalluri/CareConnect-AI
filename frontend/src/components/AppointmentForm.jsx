
import { useState } from "react";

export default function AppointmentForm({ onAdd }) {
  const [form, setForm] = useState({
    doctor_name: "",
    specialty: "",
    appointment_time: "",
    location: ""
  });

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      await onAdd({
        ...form,
        appointment_time: new Date(
          form.appointment_time
        ).toISOString()
      });

      setForm({
        doctor_name: "",
        specialty: "",
        appointment_time: "",
        location: ""
      });
    } catch (error) {
      alert(error.message);
    }
  }

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Book Doctor Appointment</h3>

      <input
        name="doctor_name"
        placeholder="Doctor name"
        value={form.doctor_name}
        onChange={handleChange}
        required
      />

      <input
        name="specialty"
        placeholder="Specialty"
        value={form.specialty}
        onChange={handleChange}
        required
      />

      <input
        name="appointment_time"
        type="datetime-local"
        value={form.appointment_time}
        onChange={handleChange}
        required
      />

      <input
        name="location"
        placeholder="Hospital or clinic"
        value={form.location}
        onChange={handleChange}
      />

      <button type="submit">Add Appointment</button>
    </form>
  );
}
