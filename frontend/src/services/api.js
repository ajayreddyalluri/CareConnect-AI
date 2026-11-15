
const API_URL = "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "API request failed");
  }

  return response.json();
}

export const getMedications = () =>
  request("/medications/");

export const addMedication = (data) =>
  request("/medications/", {
    method: "POST",
    body: JSON.stringify(data)
  });

export const getAppointments = () =>
  request("/appointments/");

export const addAppointment = (data) =>
  request("/appointments/", {
    method: "POST",
    body: JSON.stringify(data)
  });

export const deleteAppointment = (id) =>
  request(`/appointments/${id}`, {
    method: "DELETE"
  });

export const deleteMedication = (id) =>
  request(`/medications/${id}`, {
    method: "DELETE"
  });

export const addDose = (medicationId, scheduledAt) =>
  request(`/medications/${medicationId}/doses`, {
    method: "POST",
    body: JSON.stringify({ scheduled_at: scheduledAt })
  });

export const updateDoseStatus = (doseId, status) =>
  request(`/medications/doses/${doseId}`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });

export const getDoses = (medicationId) =>
  request(`/medications/${medicationId}/doses`);

export const recordDose = (medicationId, scheduledAt) =>
  request(`/medications/${medicationId}/doses`, {
    method: "POST",
    body: JSON.stringify({ scheduled_at: scheduledAt })
  });

export const changeDoseStatus = (doseId, status) =>
  request(`/medications/doses/${doseId}`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
