import api from './client';

// Admin CRUD
export async function createClinic(data) {
  const res = await api.post('/clinics', data);
  return res.data;
}

export async function updateClinic(id, data) {
  const res = await api.put(`/clinics/${id}`, data);
  return res.data;
}

export async function deleteClinic(id) {
  await api.delete(`/clinics/${id}`);
}

// CHW notes
export async function getClinicNotes(clinicId) {
  const res = await api.get(`/clinics/${clinicId}/notes`);
  return res.data;
}

export async function addClinicNote(clinicId, data) {
  const res = await api.post(`/clinics/${clinicId}/notes`, data);
  return res.data;
}
