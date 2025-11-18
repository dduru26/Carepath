// src/components/Layout.jsx
import { Link } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div className="app">
      <header className="app-header">
        <h1>CarePath</h1>
      </header>

      <nav className="app-nav">
        <Link to="/">Home</Link>
        <Link to="/clinics">Find a clinic</Link>
        <Link to="/visit-guides">Prepare for a visit</Link>
      </nav>

      <main className="app-main">
        {children}
      </main>
    </div>
  );
}

export default Layout;
