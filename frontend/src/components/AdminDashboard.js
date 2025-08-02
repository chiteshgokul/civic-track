import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [flaggedReports, setFlaggedReports] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, flaggedRes] = await Promise.all([
          api.get('/admin/analytics'),
          api.get('/admin/flagged'),
        ]);
        setAnalytics(analyticsRes.data);
        setFlaggedReports(flaggedRes.data);
      } catch (err) {
        setError('Failed to fetch admin data');
      }
    };
    fetchData();
  }, []);

  const handleBanUser = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/ban`);
      alert('User banned successfully');
    } catch (err) {
      setError('Failed to ban user');
    }
  };

  if (!analytics) return <p>Loading...</p>;

  return (
    <section className="dashboard-container">
      <h2>Admin Dashboard</h2>
      {error && <p className="error">{error}</p>}
      <div className="analytics">
        <h3>Analytics</h3>
        <p><strong>Total Reports:</strong> {analytics.totalReports}</p>
        <p><strong>Total Complaints:</strong> {analytics.totalComplaints}</p>
        <h4>Category Stats</h4>
        <ul>
          {analytics.categoryStats.map((stat) => (
            <li key={stat.name}>{stat.name}: {stat.count}</li>
          ))}
        </ul>
        <h4>Department Stats</h4>
        <ul>
          {analytics.deptStats.map((stat) => (
            <li key={stat.dept_name}>{stat.dept_name}: {stat.count}</li>
          ))}
        </ul>
      </div>
      <div className="flagged-reports">
        <h3>Flagged Reports</h3>
        <ul>
          {flaggedReports.map((report) => (
            <li key={report.report_id}>
              <p>{report.title} (Flags: {report.flag_count})</p>
              {/* Assuming user_id is available; adjust as needed */}
              <button onClick={() => handleBanUser(report.user_id)} className="btn">
                Ban User
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default AdminDashboard;