// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ClinicFinder from './pages/ClinicFinder';
import ClinicDetails from './pages/ClinicDetails';
import VisitGuides from './pages/VisitGuides';
import VisitGuideDetails from './pages/VisitGuideDetails';
import Reminders from './pages/Reminders';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/clinics" element={<ClinicFinder />} />
        <Route path="/clinics/:id" element={<ClinicDetails />} />
        <Route path="/visit-guides" element={<VisitGuides />} />
        <Route path="/visit-guides/:id" element={<VisitGuideDetails />} />
        <Route path="/reminders" element={<Reminders />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Layout>
  );
}

export default App;
