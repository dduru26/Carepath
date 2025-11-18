// src/pages/ClinicFinder.jsx
import { useEffect, useState } from 'react';
import api from '../api/client';
import ClinicCard from '../components/ClinicCard';

function ClinicFinder() {
  const [area, setArea] = useState('');
  const [service, setService] = useState('');
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchClinics = async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (area) params.area = area;
      if (service) params.service = service;

      const res = await api.get('/clinics', { params });
      setClinics(res.data);
    } catch (err) {
      setError('Unable to load clinics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    searchClinics();
  };

  return (
    <section>
      <h2>Find a nearby public clinic</h2>
      <p>Start by typing the name of your area, town, or community.</p>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Your area / town
          <input
            type="text"
            value={area}
            onChange={e => setArea(e.target.value)}
            placeholder="e.g. Village A, Town X"
            required
          />
        </label>

        <label>
          Service needed (optional)
          <select value={service} onChange={e => setService(e.target.value)}>
            <option value="">Any service</option>
            <option value="general">General consultation</option>
            <option value="antenatal">Antenatal care</option>
            <option value="immunization">Child immunization</option>
            <option value="malaria">Malaria / fever</option>
          </select>
        </label>

        <button type="submit" className="primary-btn">
          Search clinics
        </button>
      </form>

      {loading && <p>Loading clinics...</p>}
      {error && <p className="error">{error}</p>}

      <div className="list">
        {clinics.map(c => (
          <ClinicCard key={c.id} clinic={c} />
        ))}
        {!loading && clinics.length === 0 && (
          <p>No clinics found yet. Try another area or spelling.</p>
        )}
      </div>
    </section>
  );
}

export default ClinicFinder;
