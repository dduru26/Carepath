// src/api/clinics.js
import api from './client';

// Get all clinics
export async function fetchClinics() {
  const res = await api.get('/clinics');
  return res.data;
}

// Create a new clinic (admin only)
export async function createClinic(clinicData) {
  const res = await api.post('/clinics', clinicData);
  return res.data;
}

// Update an existing clinic (admin only)
export async function updateClinic(id, updates) {
  const res = await api.put(`/clinics/${id}`, updates);
  return res.data;
}

// Delete a clinic (admin only)
export async function deleteClinic(id) {
  const res = await api.delete(`/clinics/${id}`);
  return res.data; // { message: 'Clinic deleted' }
}
