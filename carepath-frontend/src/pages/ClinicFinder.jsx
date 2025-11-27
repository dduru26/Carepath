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

  // NEW: radius state, default 5km
  const [radiusKm, setRadiusKm] = useState(5);

  const searchClinics = async (options = {}) => {
    try {
      setLoading(true);
      setError('');
      setGpsError('');

      const params = {};

      // manual area search
      if (!options.useGps && area) {
        params.area = area;
      }

      // service filter (matches the tags we stored: hospital / primary-care / clinic)
      if (service) {
        params.service = service;
      }

      // gps-based search
      if (options.useGps && options.coords) {
        params.lat = options.coords.latitude;
        params.lng = options.coords.longitude;
        params.radiusKm = radiusKm; // use selected radius
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
        setGpsError(
          'Unable to get your location. Please check permissions and try again.'
        );
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  return (
    <section>
      <h2>Find a nearby public clinic</h2>
      <p style={{ fontSize: '0.9rem', color: '#4b5563', marginBottom: '0.75rem' }}>
        Search using your area or current location. Clinic data is loaded from public facilities in Kigali.
      </p>


      <form onSubmit={handleManualSearch} className="form">
        <label>
          Your area / town
          <input
            type="text"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g. Kigali City"
            disabled={usingGps}
            required={!usingGps}
          />
        </label>

        <label>
          Service needed (optional)
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
          >
            <option value="">Any service</option>
            {/* These values match the tags we store in the DB */}
            <option value="primary-care">Primary care (health centre)</option>
            <option value="hospital">Hospital</option>
            <option value="clinic">Clinic / polyclinic</option>
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
          {loading && usingGps ? 'Getting location…' : 'Use my current location'}
        </button>

        {/* NEW: Radius selector just under the location button */}
        <div style={{ marginTop: '0.75rem' }}>
          <label style={{ fontSize: '0.9rem' }}>
            Search radius
            <select
              value={radiusKm}
              onChange={(e) => setRadiusKm(Number(e.target.value))}
              style={{
                marginLeft: '0.5rem',
                padding: '0.25rem 0.5rem',
                borderRadius: 6,
                border: '1px solid #d1d5db',
                fontSize: '0.9rem',
              }}
            >
              <option value={1}>1 km</option>
              <option value={2}>2 km</option>
              <option value={5}>5 km</option>
              <option value={10}>10 km</option>
            </select>
          </label>
        </div>

        {gpsError && (
          <p className="error" style={{ marginTop: '0.5rem' }}>
            {gpsError}
          </p>
        )}
      </div>

      {loading && <p>Loading clinics...</p>}
      {error && <p className="error">{error}</p>}

      <div className="list">
        {clinics.map((c) => (
          <ClinicCard key={c.id} clinic={c} />
        ))}

        {!loading && clinics.length === 0 && !error && (
          <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>
            No clinics found for this search. Try another area or widen your radius
          </p>
        )}
      </div>
    </section>
  );
}

export default ClinicFinder;
