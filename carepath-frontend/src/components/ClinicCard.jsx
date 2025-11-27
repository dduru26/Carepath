// src/components/ClinicCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function normalizeServices(services) {
  if (!services) return [];

  // If it's already an array (ideal case from Prisma)
  if (Array.isArray(services)) {
    return services.filter(Boolean);
  }

  // If it's a string, split on commas
  if (typeof services === 'string') {
    return services
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  // Fallback – unknown type
  return [];
}

export default function ClinicCard({ clinic }) {
  const servicesArray = normalizeServices(clinic.services);

  return (
    <article
      className="clinic-card"
      style={{
        border: '1px solid #e5e7eb',
        borderRadius: 8,
        padding: '0.75rem 1rem',
        marginBottom: '0.75rem',
      }}
    >
      <h3 style={{ marginBottom: '0.25rem' }}>{clinic.name}</h3>

      {clinic.address && (
        <p style={{ fontSize: '0.9rem', color: '#4b5563' }}>{clinic.address}</p>
      )}

      {clinic.area && (
        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          Area: {clinic.area}
        </p>
      )}

      {clinic.openingHours && (
        <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          Hours: {clinic.openingHours}
        </p>
      )}

      {servicesArray.length > 0 && (
        <p style={{ fontSize: '0.85rem', color: '#374151', marginTop: '0.25rem' }}>
          <strong>Services:</strong> {servicesArray.join(', ')}
        </p>
      )}

      <div style={{ marginTop: '0.5rem' }}>
        <Link
          to={`/clinics/${clinic.id}`}
          style={{
            display: 'inline-block',
            padding: '0.35rem 0.75rem',
            borderRadius: 999,
            border: '1px solid #2563eb',
            color: '#2563eb',
            fontSize: '0.85rem',
            textDecoration: 'none',
          }}
        >
          View details
        </Link>
      </div>
    </article>
  );
}
