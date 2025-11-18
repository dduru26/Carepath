// src/pages/VisitGuideDetails.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import Checklist from '../components/Checklist';

function VisitGuideDetails() {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadGuide = async () => {
      try {
        const res = await api.get(`/visit-guides/${id}`);
        setGuide(res.data);
      } catch (err) {
        setError('Visit guide not found.');
      }
    };
    loadGuide();
  }, [id]);

  if (error) return <p>{error}</p>;
  if (!guide) return <p>Loading...</p>;

  return (
    <section>
      <h2>{guide.title}</h2>
      <p>{guide.description}</p>

      <Checklist items={guide.checklist_items || []} />
    </section>
  );
}

export default VisitGuideDetails;
