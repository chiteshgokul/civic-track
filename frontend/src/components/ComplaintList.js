import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [status, setStatus] = useState('');
  const [deptId, setDeptId] = useState('');
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      setError('');
      try {
        // Use /api/complaints/my for normal users, /api/complaints for admins
        const url = user && user.isAdmin ? '/complaints' : '/complaints/my';
        const response = await api.get(url);
        setComplaints(response.data);
      } catch (err) {
        setError('Failed to fetch complaints');
      }
    };
    if (user) fetchData();
  }, [user]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const params = { status, dept_id: deptId };
      const response = await api.get('/complaints', { params });
      setComplaints(response.data);
    } catch (err) {
      setError('Failed to fetch complaints');
    }
  };

  const handleStatusUpdate = async (complaintId, newStatus) => {
    try {
      await api.put(`/complaints/${complaintId}/status`, { status: newStatus });
      setComplaints(complaints.map((c) =>
        c.complaint_id === complaintId ? { ...c, status: newStatus } : c
      ));
    } catch (err) {
      setError('Failed to update status');
    }
  };

  return (
    <section className="list-container">
      <h2>Complaints</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSearch} className="search-form" aria-label="Search Complaints">
        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="deptId">Department</label>
          <select
            id="deptId"
            value={deptId}
            onChange={(e) => setDeptId(e.target.value)}
          >
            <option value="">All</option>
            {departments.map((dept) => (
              <option key={dept.dept_id} value={dept.dept_id}>
                {dept.dept_name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="btn">Search</button>
      </form>
      <ul className="complaint-list">
        {complaints.map((complaint) => (
          <li key={complaint.complaint_id} className="complaint-item">
            <p><strong>Citizen:</strong> {complaint.citizen_name}</p>
            <p><strong>Department:</strong> {complaint.dept_name}</p>
            <p>{complaint.description}</p>
            <p><strong>Status:</strong> {complaint.status}</p>
            <p><strong>Created:</strong> {new Date(complaint.created_at).toLocaleString()}</p>
            <select
              value={complaint.status}
              onChange={(e) => handleStatusUpdate(complaint.complaint_id, e.target.value)}
              aria-label={`Update status for complaint ${complaint.complaint_id}`}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ComplaintList;