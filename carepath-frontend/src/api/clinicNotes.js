// src/api/clinicNotes.js
import api from './client';

// Get notes for a clinic
export async function fetchClinicNotes(clinicId) {
  const res = await api.get(`/clinics/${clinicId}/notes`);
  return res.data;
}

// Add a new note (CHW/admin only)
export async function addClinicNote(clinicId, noteData) {
  const res = await api.post(`/clinics/${clinicId}/notes`, noteData);
  return res.data;
}
