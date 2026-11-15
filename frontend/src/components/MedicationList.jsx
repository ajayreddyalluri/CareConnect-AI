
export default function MedicationList({
  medications,
  onDelete
}) {
  if (!medications.length) {
    return <p>No medications added yet.</p>;
  }

  return (
    <section>
      <h3>My Medications</h3>

      {medications.map((medication) => (
        <div key={medication.id}>
          <h4>{medication.name}</h4>

          <p>Dosage: {medication.dosage}</p>
          <p>Frequency: {medication.frequency}</p>
          <p>Time: {medication.schedule_time}</p>

          <p>
            Instructions: {medication.instructions || "None"}
          </p>

          <button
            type="button"
            onClick={() => onDelete(medication.id)}
          >
            Delete
          </button>
        </div>
      ))}
    </section>
  );
}
