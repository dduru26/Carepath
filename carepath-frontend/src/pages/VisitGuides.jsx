// src/pages/VisitGuides.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';

function VisitGuides() {
  const [guides, setGuides] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadGuides = async () => {
      try {
        const res = await api.get('/visit-guides');
        setGuides(res.data);
      } catch (err) {
        setError('Unable to load visit guides.');
      }
    };
    loadGuides();
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <section>
      <h2>Prepare for common clinic visits</h2>
      <p>Simple checklists for antenatal visits, child immunizations, and common illnesses.</p>

      <div className="list">
        {guides.map(g => (
          <article key={g.id} className="card">
            <h3>{g.title}</h3>
            <p>{g.description}</p>
            <Link to={`/visit-guides/${g.id}`} className="secondary-btn">
              View checklist
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default VisitGuides;
