// src/pages/Home.jsx
import { Link } from 'react-router-dom';

function Home() {
  return (
    <section>
      <h2>Reduce friction in your health visits.</h2>
      <p>
        CarePath helps you find nearby public clinics, prepare for common visits,
        and (later) keep track of appointments and medications.
      </p>

      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link className="primary-btn" to="/clinics">Find a nearby clinic</Link>
        <Link className="secondary-btn" to="/visit-guides">Prepare for a visit</Link>
      </div>
    </section>
  );
}

export default Home;
