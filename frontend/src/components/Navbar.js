import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">CivicTrack</Link>
      <ul className="nav-links">
        {!user ? (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
            <li><Link to="/complaint">File Complaint</Link></li>
          </>
        ) : (
          <>
            <li><Link to="/report">Report Issue</Link></li>
            <li><Link to="/reports">View Reports</Link></li>
            {user.isAdmin && (
              <>
                <li><Link to="/complaints">View Complaints</Link></li>
                <li><Link to="/admin">Admin Dashboard</Link></li>
              </>
            )}
            <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;