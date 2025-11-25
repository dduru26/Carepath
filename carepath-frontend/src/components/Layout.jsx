import { Link } from 'react-router-dom';
import useOnlineStatus from '../hooks/useOnlineStatus';

function Layout({ children }) {
  const online = useOnlineStatus();

  return (
    <div className="app">
      <header className="app-header">
        <h1>CarePath</h1>
      </header>

      {!online && (
        <div
          style={{
            backgroundColor: '#f97316',
            color: 'white',
            padding: '0.35rem 1rem',
            fontSize: '0.85rem'
          }}
        >
          You are offline. Showing saved information where available.
        </div>
      )}

      <nav className="app-nav">
        <Link to="/">Home</Link>
        <Link to="/clinics">Find a clinic</Link>
        <Link to="/visit-guides">Prepare for a visit</Link>
        <Link to="/reminders">Reminders</Link>
        {/* <Link to="/admin">Admin</Link>  // keep commented if you want it hidden */}
      </nav>

      <main className="app-main">{children}</main>
    </div>
  );
}

export default Layout;
