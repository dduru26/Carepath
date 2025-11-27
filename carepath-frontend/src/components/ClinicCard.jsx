// src/components/ClinicCard.jsx
import { Link } from 'react-router-dom';

export default function ClinicCard({ clinic }) {
  return (
    <article className="card">
      <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>
        {clinic.name}
      </h3>
      <p style={{ fontSize: '0.85rem', color: '#4b5563' }}>
        {clinic.address || clinic.area || 'Location details coming soon.'}
      </p>

      {clinic.openingHours && (
        <p
          style={{
            fontSize: '0.8rem',
            color: '#374151',
            marginTop: '0.4rem',
          }}
        >
          <strong>Hours:</strong> {clinic.openingHours}
        </p>
      )}

      {Array.isArray(clinic.services) && clinic.services.length > 0 && (
        <div style={{ marginTop: '0.4rem' }}>
          <span
            style={{
              fontSize: '0.8rem',
              color: '#374151',
              display: 'inline-block',
              marginBottom: '0.25rem',
            }}
          >
            <strong>Services:</strong>
          </span>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.25rem',
            }}
          >
            {clinic.services.map((s) => (
              <span
                key={s}
                style={{
                  fontSize: '0.75rem',
                  padding: '0.15rem 0.4rem',
                  borderRadius: 999,
                  background: '#eff6ff',
                  color: '#1d4ed8',
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '0.75rem' }}>
        <Link to={`/clinics/${clinic.id}`}>
          <button className="secondary-btn">View details</button>
        </Link>
      </div>
    </article>
  );
}
