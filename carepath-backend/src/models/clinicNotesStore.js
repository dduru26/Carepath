// src/models/clinicNotesStore.js

let notes = [];
let nextNoteId = 1;

function addNote({ clinicId, authorName, role, content }) {
  const note = {
    id: nextNoteId++,
    clinicId: Number(clinicId),
    authorName: authorName || 'Anonymous CHW',
    role: role || 'chw',
    content,
    createdAt: new Date().toISOString()
  };

  notes.push(note);
  return note;
}

function getNotesForClinic(clinicId) {
  return notes.filter(n => n.clinicId === Number(clinicId));
}

module.exports = {
  addNote,
  getNotesForClinic
};
