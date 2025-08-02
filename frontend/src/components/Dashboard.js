 import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../assets/styles/dashboard.css';

function Dashboard() {
  const { user } = useContext(AuthContext);

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      <p>Welcome, {user?.username || 'User'}!</p>
      <div className="dashboard-tabs">
        <Link to="/reports" className="dashboard-tab">
          View Reports
        </Link>
        <Link to="/complaints" className="dashboard-tab">
          View Complaints
        </Link>
        <Link to="/profile" className="dashboard-tab">
          Profile
        </Link>
        {user?.isAdmin && (
          <Link to="/admin" className="dashboard-tab">
            Admin Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
