// src/pages/Home.jsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main style={{ padding: '1.5rem', maxWidth: 960, margin: '0 auto' }}>
      <section
        style={{
          marginBottom: '2rem',
          padding: '1.25rem 1rem',
          borderRadius: '0.75rem',
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
        }}
      >
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
          Make clinic visits easier for underserved communities.
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#1f2937' }}>
          CarePath helps patients in and around Kigali find nearby public
          clinics, prepare for common visits, and remember appointments or
          medications — even on low-end devices.
        </p>

        <div
          style={{
            marginTop: '1rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          <Link to="/clinic-finder">
            <button className="primary-btn">Find a clinic</button>
          </Link>
          <Link to="/visit-guides">
            <button className="secondary-btn">Visit checklists</button>
          </Link>
          <Link to="/reminders">
            <button className="secondary-btn">Reminders</button>
          </Link>
        </div>
      </section>

      <section
        style={{
          display: 'grid',
          gap: '0.75rem',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        }}
      >
        <div className="card">
          <h2 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
            🌍 Clinic finder
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>
            Search by area, service, or your GPS location. Clinic data is
            sourced from real public health facilities in Kigali.
          </p>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
            📋 Visit guidance
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>
            Plain-language checklists for antenatal visits, child immunizations,
            and common illnesses like malaria and fever.
          </p>
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
            🔔 Reminders
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>
            Save your phone number and create visit reminders so you don&rsquo;t
            miss clinic dates or medication times.
          </p>
        </div>
      </section>
    </main>
  );
}
