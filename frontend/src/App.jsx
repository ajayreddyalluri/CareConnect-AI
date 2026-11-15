
import { useEffect, useState } from "react";
import MedicationDoseHistory from "./components/MedicationDoseHistory";
import {
  Heart, LayoutDashboard, Pill, CalendarDays, Users,
  Bell, Plus, CheckCircle, Clock, Activity,
  Menu, X, Trash2, AlertCircle, RefreshCw
} from "lucide-react";

import {
  getMedications,
  addMedication,
  deleteMedication,
  addDose,
  updateDoseStatus,
  getAppointments,
  addAppointment,
  deleteAppointment
} from "./services/api";

import "./App.css";

function App() {
  const [medications, setMedications] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  const [medForm, setMedForm] = useState({
    name: "",
    dosage: "",
    frequency: "",
    schedule_time: "08:00",
    instructions: ""
  });

  const [appointmentForm, setAppointmentForm] = useState({
    doctor_name: "",
    specialty: "",
    appointment_time: "",
    location: ""
  });

  async function loadData() {
    setLoading(true);
    setError("");

    const results = await Promise.allSettled([
      getMedications(),
      getAppointments()
    ]);

    if (results[0].status === "fulfilled") {
      setMedications(results[0].value);
    } else {
      setError("Could not load medications. Check the backend.");
    }

    if (results[1].status === "fulfilled") {
      setAppointments(results[1].value);
    } else {
      setError(previous =>
        previous
          ? previous + " Appointments API is unavailable."
          : "Could not load appointments. Check the appointments API."
      );
    }

    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const takenCount = medications.filter(
    medication => medication.status === "Taken"
  ).length;

  const pendingCount = medications.length - takenCount;

  async function handleAddMedication(event) {
    event.preventDefault();

    try {
      await addMedication(medForm);
      setMedForm({
        name: "",
        dosage: "",
        frequency: "",
        schedule_time: "08:00",
        instructions: ""
      });
      setShowMedicationForm(false);
      await loadData();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDeleteMedication(id) {
    if (!window.confirm("Delete this medication?")) return;

    try {
      await deleteMedication(id);
      await loadData();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleMarkTaken(medicationId) {
    try {
      const dose = await addDose(
        medicationId,
        new Date().toISOString()
      );

      await updateDoseStatus(dose.id, "Taken");
      await loadData();
      alert("Dose marked as Taken.");
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleAddAppointment(event) {
    event.preventDefault();

    try {
      await addAppointment({
        ...appointmentForm,
        appointment_time: new Date(
          appointmentForm.appointment_time
        ).toISOString()
      });

      setAppointmentForm({
        doctor_name: "",
        specialty: "",
        appointment_time: "",
        location: ""
      });

      setShowAppointmentForm(false);
      await loadData();
    } catch (error) {
      alert(error.message);
    }
  }

  async function handleDeleteAppointment(id) {
    if (!window.confirm("Delete this appointment?")) return;

    try {
      await deleteAppointment(id);
      await loadData();
    } catch (error) {
      alert(error.message);
    }
  }

  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Medications", icon: Pill },
    { name: "Appointments", icon: CalendarDays },
    { name: "Care Team", icon: Users }
  ];

  function medicationTime(time) {
    if (!time) return "";
    return time;
  }

  function appointmentDate(value) {
    if (!value) return "Date unavailable";

    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    });
  }

  function medicationCard(medication) {
    return (
      <div className="med-item" key={medication.id}>
        <div className="med-icon"><Pill /></div>

        <div className="med-info">
          <strong>{medication.name}</strong>
          <span>
            {medication.dosage} · {medication.schedule_time}
          </span>
          <span>{medication.frequency}</span>
        </div>

        <span className="status pending">Scheduled</span>

        <button
          className="taken-button"
          onClick={() => handleMarkTaken(medication.id)}
        >
          Mark taken
        </button>

        <button
          className="taken-button"
          onClick={() => handleDeleteMedication(medication.id)}
          title="Delete medication"
        >
          <Trash2 size={15} />
        </button>
      </div>
    );
  }

  function appointmentCard(item) {
    return (
      <div className="appointment" key={item.id}>
        <div className="appointment-date">
          <CalendarDays size={20} />
        </div>

        <div className="med-info">
          <strong>{item.doctor_name}</strong>
          <span>{item.specialty}</span>
          <small>{appointmentDate(item.appointment_time)}</small>
          <small>{item.location || "Location not specified"}</small>
        </div>

        <button
          className="taken-button"
          onClick={() => handleDeleteAppointment(item.id)}
        >
          Delete
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <aside className={`sidebar ${menuOpen ? "show" : ""}`}>
        <div className="brand">
          <div className="brand-icon"><Heart size={23} /></div>
          <div>
            <h2>CareConnect</h2>
            <span>AI Care Platform</span>
          </div>
          <button
            className="close-menu"
            onClick={() => setMenuOpen(false)}
          >
            <X />
          </button>
        </div>

        <p className="nav-label">MENU</p>

        {navigation.map(item => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`nav-item ${
                activeTab === item.name ? "active" : ""
              }`}
              onClick={() => {
                setActiveTab(item.name);
                setMenuOpen(false);
              }}
            >
              <Icon size={19} />
              {item.name}
            </button>
          );
        })}

        <div className="sidebar-footer">
          <div className="avatar">A</div>
          <div>
            <strong>Ajay's Family</strong>
            <span>Caregiver account · Demo</span>
          </div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setMenuOpen(true)}
          >
            <Menu />
          </button>

          <div>
            <p className="welcome">Welcome back</p>
            <h2>{activeTab}</h2>
          </div>

          <button className="notification" onClick={loadData}>
            <RefreshCw size={19} />
          </button>
        </header>

        {error && (
          <div className="care-tip">
            <AlertCircle size={20} />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <section className="panel">
            <p>Loading your care information...</p>
          </section>
        ) : (
          <>
            {activeTab === "Dashboard" && (
              <>
                <section className="hero">
                  <div>
                    <span className="hero-tag">
                      YOUR FAMILY CARE SPACE
                    </span>
                    <h1>Better care, together.</h1>
                    <p>
                      Manage medicines, appointments and daily care
                      in one place.
                    </p>
                  </div>
                  <Heart className="hero-heart" size={76} />
                </section>

                <section className="stats">
                  <div className="stat-card">
                    <div className="stat-icon purple"><Pill /></div>
                    <p>Total medications</p>
                    <h2>{medications.length}</h2>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon green"><CheckCircle /></div>
                    <p>Doses taken this session</p>
                    <h2>{takenCount}</h2>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon orange"><Clock /></div>
                    <p>Not marked taken</p>
                    <h2>{pendingCount}</h2>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon blue"><CalendarDays /></div>
                    <p>Appointments</p>
                    <h2>{appointments.length}</h2>
                  </div>
                </section>

                <section className="content-grid">
                  <div className="panel">
                    <div className="panel-heading">
                      <div>
                        <h3>Medication schedule</h3>
                        <p>Medication records from your database</p>
                      </div>

                      <button
                        className="primary-button"
                        onClick={() => setShowMedicationForm(!showMedicationForm)}
                      >
                        <Plus size={17} /> Add medicine
                      </button>
                    </div>

                    {showMedicationForm && medicationForm()}

                    {medications.map(medicationCard)}

                    {medications.length === 0 && (
                      <p>No medications added yet.</p>
                    )}
                  </div>

                  <div className="panel">
                    <div className="panel-heading">
                      <div>
                        <h3>Upcoming appointments</h3>
                        <p>Doctor visits and checkups</p>
                      </div>
                      <CalendarDays className="heading-icon" />
                    </div>

                    {appointments.slice(0, 4).map(appointmentCard)}

                    {appointments.length === 0 && (
                      <p>No appointments scheduled.</p>
                    )}
                  </div>
                </section>

                <section className="care-tip">
                  <Activity size={22} />
                  <div>
                    <strong>Care reminder</strong>
                    <p>
                      Keep medication records updated. Contact a
                      healthcare professional if you have concerns
                      about a dose.
                    </p>
                  </div>
                </section>
              </>
            )}

            {activeTab === "Medications" && (
              <section className="panel page-panel">
                <div className="panel-heading">
                  <div>
                    <h3>All medications</h3>
                    <p>Manage medication records</p>
                  </div>

                  <button
                    className="primary-button"
                    onClick={() => setShowMedicationForm(!showMedicationForm)}
                  >
                    <Plus size={17} /> Add medicine
                  </button>
                </div>

                {showMedicationForm && medicationForm()}

                {medications.map(medicationCard)}

                {medications.length === 0 && (
                  <p>No medications added yet.</p>
                )}
              </section>
            )}

            {activeTab === "Appointments" && (
              <section className="panel page-panel">
                <div className="panel-heading">
                  <div>
                    <h3>Appointments</h3>
                    <p>Manage doctor appointments</p>
                  </div>

                  <button
                    className="primary-button"
                    onClick={() => setShowAppointmentForm(!showAppointmentForm)}
                  >
                    <Plus size={17} /> Add appointment
                  </button>
                </div>

                {showAppointmentForm && appointmentFormUI()}

                {appointments.map(appointmentCard)}

                {appointments.length === 0 && (
                  <p>No appointments scheduled.</p>
                )}
              </section>
            )}

            {activeTab === "Care Team" && (
              <section className="panel page-panel">
                <h3>Family care team</h3>
                <p>People involved in supporting daily care.</p>

                <div className="team-member">
                  <div className="avatar">A</div>
                  <div>
                    <strong>Ajay</strong>
                    <span>Family caregiver · Demo profile</span>
                  </div>
                </div>

                <div className="care-tip">
                  <AlertCircle size={22} />
                  <div>
                    <strong>Care team access</strong>
                    <p>
                      Passcode-based family access is a future
                      implementation milestone. This demo currently
                      has no real user authentication.
                    </p>
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        <footer>
          CareConnect AI · Demo application · Use fictional health data only
        </footer>
      </main>
    </div>
  );

  function medicationForm() {
    return (
      <form className="data-form" onSubmit={handleAddMedication}>
        <h3>New medication</h3>

        <input
          placeholder="Medication name"
          value={medForm.name}
          onChange={e => setMedForm({ ...medForm, name: e.target.value })}
          required
        />

        <input
          placeholder="Dosage (e.g. 1 tablet)"
          value={medForm.dosage}
          onChange={e => setMedForm({ ...medForm, dosage: e.target.value })}
          required
        />

        <input
          placeholder="Frequency (e.g. Once daily)"
          value={medForm.frequency}
          onChange={e => setMedForm({ ...medForm, frequency: e.target.value })}
          required
        />

        <label>Scheduled time</label>
        <input
          type="time"
          value={medForm.schedule_time}
          onChange={e => setMedForm({
            ...medForm,
            schedule_time: e.target.value
          })}
          required
        />

        <textarea
          placeholder="Instructions"
          value={medForm.instructions}
          onChange={e => setMedForm({
            ...medForm,
            instructions: e.target.value
          })}
        />

        <button className="primary-button" type="submit">
          Save medication
        </button>
      </form>
    );
  }

  function appointmentFormUI() {
    return (
      <form className="data-form" onSubmit={handleAddAppointment}>
        <h3>New appointment</h3>

        <input
          placeholder="Doctor name"
          value={appointmentForm.doctor_name}
          onChange={e => setAppointmentForm({
            ...appointmentForm,
            doctor_name: e.target.value
          })}
          required
        />

        <input
          placeholder="Specialty"
          value={appointmentForm.specialty}
          onChange={e => setAppointmentForm({
            ...appointmentForm,
            specialty: e.target.value
          })}
          required
        />

        <label>Appointment date and time</label>
        <input
          type="datetime-local"
          value={appointmentForm.appointment_time}
          onChange={e => setAppointmentForm({
            ...appointmentForm,
            appointment_time: e.target.value
          })}
          required
        />

        <input
          placeholder="Hospital or clinic"
          value={appointmentForm.location}
          onChange={e => setAppointmentForm({
            ...appointmentForm,
            location: e.target.value
          })}
        />

        <button className="primary-button" type="submit">
          Save appointment
        </button>
      </form>
    );
  }
}

export default App;
