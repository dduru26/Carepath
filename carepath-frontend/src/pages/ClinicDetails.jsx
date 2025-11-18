// src/pages/ClinicDetails.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

function ClinicDetails() {
  const { id } = useParams();
  const [clinic, setClinic] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadClinic = async () => {
      try {
        const res = await api.get(`/clinics/${id}`);
        setClinic(res.data);
      } catch (err) {
        setError('Clinic not found.');
      }
    };
    loadClinic();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!clinic) return <p>Loading...</p>;

  return (
    <section>
      <h2>{clinic.name}</h2>
      <p>{clinic.address}</p>
      <p><strong>Opening hours:</strong> {clinic.opening_hours}</p>
      <p><strong>Services:</strong> {clinic.services && clinic.services.join(', ')}</p>

      <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
        In future versions, this page can show directions, maps, and more details.
      </p>
    </section>
  );
}

export default ClinicDetails;
