
export default function AppointmentList({
  appointments,
  onDelete
}) {
  if (!appointments.length) {
    return <p>No appointments scheduled.</p>;
  }

  return (
    <section>
      <h3>Upcoming Appointments</h3>

      {appointments.map((appointment) => (
        <div key={appointment.id}>
          <h4>{appointment.doctor_name}</h4>

          <p>Specialty: {appointment.specialty}</p>

          <p>
            Date: {new Date(
              appointment.appointment_time
            ).toLocaleString()}
          </p>

          <p>Location: {appointment.location || "Not specified"}</p>

          <p>Status: {appointment.status}</p>

          <button
            type="button"
            onClick={() => onDelete(appointment.id)}
          >
            Delete Appointment
          </button>
        </div>
      ))}
    </section>
  );
}
