
import { useState } from "react";

export default function MedicationForm({ onAdd }) {
  const [form, setForm] = useState({
    name: "",
    dosage: "",
    frequency: "",
    schedule_time: "",
    instructions: ""
  });

  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      await onAdd(form);

      setForm({
        name: "",
        dosage: "",
        frequency: "",
        schedule_time: "",
        instructions: ""
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Add Medication</h3>

      <input
        name="name"
        placeholder="Medication name"
        value={form.name}
        onChange={handleChange}
        required
      />

      <input
        name="dosage"
        placeholder="Dosage (e.g. 1 tablet)"
        value={form.dosage}
        onChange={handleChange}
        required
      />

      <input
        name="frequency"
        placeholder="Frequency (e.g. Once daily)"
        value={form.frequency}
        onChange={handleChange}
        required
      />

      <input
        name="schedule_time"
        type="time"
        value={form.schedule_time}
        onChange={handleChange}
        required
      />

      <textarea
        name="instructions"
        placeholder="Instructions"
        value={form.instructions}
        onChange={handleChange}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : "Add Medication"}
      </button>
    </form>
  );
}
