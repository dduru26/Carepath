// src/components/ClinicCard.jsx
import { Link } from 'react-router-dom';

function ClinicCard({ clinic }) {
  return (
    <article className="card">
      <h3>{clinic.name}</h3>
      <p>{clinic.address}</p>
      <p><strong>Hours:</strong> {clinic.opening_hours}</p>
      <p>
        <strong>Services:</strong> {clinic.services && clinic.services.join(', ')}
      </p>
      <Link to={`/clinics/${clinic.id}`} className="secondary-btn">
        View details
      </Link>
    </article>
  );
}

export default ClinicCard;
