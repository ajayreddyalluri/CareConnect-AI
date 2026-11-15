
import { useEffect, useState } from "react";
import {
  getDoses,
  recordDose,
  changeDoseStatus
} from "../services/api";

export default function MedicationDoseHistory({ medicationId }) {
  const [doses, setDoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDoses() {
    try {
      const data = await getDoses(medicationId);
      setDoses(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDoses();
  }, [medicationId]);

  async function addDose() {
    try {
      await recordDose(medicationId, new Date().toISOString());
      await loadDoses();
    } catch (err) {
      setError(err.message);
    }
  }

  async function updateStatus(id, status) {
    try {
      await changeDoseStatus(id, status);
      await loadDoses();
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <p>Loading dose history...</p>;

  return (
    <div className="dose-history">
      <h4>Dose history</h4>

      <button type="button" onClick={addDose}>
        + Record dose
      </button>

      {error && <p role="alert">{error}</p>}

      {doses.length === 0 && <p>No dose records yet.</p>}

      {doses.map((dose) => (
        <div className="dose-row" key={dose.id}>
          <span>
            {new Date(dose.scheduled_at).toLocaleString("en-IN")}
          </span>

          <strong>{dose.status}</strong>

          {dose.status === "Pending" && (
            <>
              <button
                type="button"
                onClick={() => updateStatus(dose.id, "Taken")}
              >
                Taken
              </button>

              <button
                type="button"
                onClick={() => updateStatus(dose.id, "Missed")}
              >
                Missed
              </button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
