// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';
import Home from './pages/Home';
import ClinicFinder from './pages/ClinicFinder';
import ClinicDetails from './pages/ClinicDetails';
import VisitGuides from './pages/VisitGuides';
import Reminders from './pages/Reminders';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import RequireAdmin from './components/RequireAdmin';

function App() {
  return (
    <div className="app-root">
      <Header />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        {/* Optional alias if you ever use /home */}
        <Route path="/home" element={<Home />} />

        {/* Clinic finder + details */}
        <Route path="/clinic-finder" element={<ClinicFinder />} />
        <Route path="/clinics/:id" element={<ClinicDetails />} />

        {/* Visit checklists */}
        <Route path="/visit-guides/*" element={<VisitGuides />} />

        {/* Reminders (profile + list of reminders) */}
        <Route path="/reminders" element={<Reminders />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />

        {/* Admin (protected) */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />

        {/* Catch-all: avoid blank screens on unknown paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
