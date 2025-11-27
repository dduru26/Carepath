// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
        <Route path="/" element={<Home />} />
        <Route path="/clinic-finder" element={<ClinicFinder />} />
        <Route path="/clinic/:id" element={<ClinicDetails />} />
        <Route path="/visit-guides/*" element={<VisitGuides />} />
        <Route path="/reminders" element={<Reminders />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminDashboard />
            </RequireAdmin>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
