// src/models/clinicStore.js
let clinics = require('../data/clinics.json');
let nextClinicId = clinics.length > 0 ? Math.max(...clinics.map(c => c.id)) + 1 : 1;

function getAllClinics() {
  return clinics;
}

function getClinicById(id) {
  return clinics.find(c => c.id === Number(id));
}

function createClinic(data) {
  const clinic = {
    id: nextClinicId++,
    name: data.name,
    address: data.address || '',
    area: data.area || '',
    latitude: typeof data.latitude === 'number' ? data.latitude : null,
    longitude: typeof data.longitude === 'number' ? data.longitude : null,
    opening_hours: data.opening_hours || '',
    services: Array.isArray(data.services) ? data.services : [],
    is_public: data.is_public !== undefined ? !!data.is_public : true
  };

  clinics.push(clinic);
  return clinic;
}

function updateClinic(id, data) {
  const clinic = getClinicById(id);
  if (!clinic) return null;

  clinic.name = data.name ?? clinic.name;
  clinic.address = data.address ?? clinic.address;
  clinic.area = data.area ?? clinic.area;
  clinic.latitude =
    typeof data.latitude === 'number' ? data.latitude : clinic.latitude;
  clinic.longitude =
    typeof data.longitude === 'number' ? data.longitude : clinic.longitude;
  clinic.opening_hours = data.opening_hours ?? clinic.opening_hours;
  clinic.services = Array.isArray(data.services)
    ? data.services
    : clinic.services;
  if (data.is_public !== undefined) {
    clinic.is_public = !!data.is_public;
  }

  return clinic;
}

function deleteClinic(id) {
  const index = clinics.findIndex(c => c.id === Number(id));
  if (index === -1) return false;
  clinics.splice(index, 1);
  return true;
}

module.exports = {
  getAllClinics,
  getClinicById,
  createClinic,
  updateClinic,
  deleteClinic
};
