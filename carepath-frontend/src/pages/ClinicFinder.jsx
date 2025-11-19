import { useState } from 'react';
import api from '../api/client';
import ClinicCard from '../components/ClinicCard';

function ClinicFinder() {
  const [area, setArea] = useState('');
  const [service, setService] = useState('');
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [usingGps, setUsingGps] = useState(false);
  const [gpsError, setGpsError] = useState('');

  const searchClinics = async (options = {}) => {
    try {
      setLoading(true);
      setError('');
      setGpsError('');

      const params = {};

      // manual area
      if (!options.useGps && area) {
        params.area = area;
      }

      // service filter
      if (service) {
        params.service = service;
      }

      // gps-based
      if (options.useGps && options.coords) {
        params.lat = options.coords.latitude;
        params.lng = options.coords.longitude;
        params.radiusKm = 10; // tweak radius as needed
      }

      const res = await api.get('/clinics', { params });
      setClinics(res.data);
    } catch (err) {
      console.error(err);
      setError('Unable to load clinics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSearch = (e) => {
    e.preventDefault();
    setUsingGps(false);
    searchClinics({ useGps: false });
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Your device does not support location access.');
      return;
    }

    setUsingGps(true);
    setGpsError('');
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = position.coords;
        searchClinics({ useGps: true, coords });
      },
      (err) => {
        console.error(err);
        setLoading(false);
        setUsingGps(false);
        setGpsError('Unable to get your location. Please check permissions and try again.');
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  return (
    <section>
      <h2>Find a nearby public clinic</h2>
      <p>Start with your area, or use your current location.</p>

      <form onSubmit={handleManualSearch} className="form">
        <label>
          Your area / town
          <input
            type="text"
            value={area}
            onChange={e => setArea(e.target.value)}
            placeholder="e.g. Village A, Town X"
            disabled={usingGps}
            required={!usingGps}
          />
        </label>

        <label>
          Service needed (optional)
          <select value={service} onChange={e => setService(e.target.value)}>
            <option value="">Any service</option>
            <option value="general">General consultation</option>
            <option value="antenatal">Antenatal</option>
            <option value="immunization">Child immunization</option>
            <option value="malaria">Malaria / fever</option>
          </select>
        </label>

        <button type="submit" className="primary-btn" disabled={loading}>
          Search by area
        </button>
      </form>

      <div style={{ margin: '1rem 0' }}>
        <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Or:</p>
        <button
          type="button"
          className="secondary-btn"
          onClick={handleUseLocation}
          disabled={loading}
        >
          Use my current location
        </button>
        {gpsError && <p className="error" style={{ marginTop: '0.5rem' }}>{gpsError}</p>}
      </div>

      {loading && <p>Loading clinics...</p>}
      {error && <p className="error">{error}</p>}

      <div className="list">
        {clinics.map(c => (
          <ClinicCard key={c.id} clinic={c} />
        ))}

        {!loading && clinics.length === 0 && !error && (
          <p>No clinics found yet. Try another area or try using your location.</p>
        )}
      </div>
    </section>
  );
}

export default ClinicFinder;
