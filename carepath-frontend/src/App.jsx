// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Header from './components/Header';

import Login from './pages/Login';
import Signup from './pages/Signup';

import ClinicFinder from './pages/ClinicFinder';
import ClinicDetails from './pages/ClinicDetails';
import VisitGuides from './pages/VisitGuides';
import Reminders from './pages/Reminders';
import AdminDashboard from './pages/AdminDashboard';

import RequireAdmin from './components/RequireAdmin';
import RequireAuth from './components/RequireAuth';

function App() {
  return (
    <div className="app-root">
      <Header />

      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected user routes */}
        <Route
          path="/clinic-finder"
          element={
            <RequireAuth>
              <ClinicFinder />
            </RequireAuth>
          }
        />
        <Route
          path="/clinics/:id"
          element={
            <RequireAuth>
              <ClinicDetails />
            </RequireAuth>
          }
        />
        <Route
          path="/visit-guides/*"
          element={
            <RequireAuth>
              <VisitGuides />
            </RequireAuth>
          }
        />
        <Route
          path="/reminders"
          element={
            <RequireAuth>
              <Reminders />
            </RequireAuth>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            </RequireAuth>
          }
        />

        {/* Default */}
        <Route path="/" element={<Navigate to="/clinic-finder" />} />
      </Routes>
    </div>
  );
}

export default App;
