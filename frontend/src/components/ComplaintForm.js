import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ComplaintForm() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [aadharNo, setAadharNo] = useState('');
  const [deptId, setDeptId] = useState('');
  const [description, setDescription] = useState('');
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get('/departments');
        setDepartments(response.data);
      } catch (err) {
        setError('Failed to load departments');
      }
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const citizenResponse = await api.post('/citizens', {
        name,
        phone,
        email,
        address,
        aadhar_no: aadharNo,
      });
      const citizenId = citizenResponse.data.citizenId;
      await api.post('/complaints', { citizen_id: citizenId, dept_id: deptId, description });
      setSuccess('Complaint submitted successfully');
      setName('');
      setPhone('');
      setEmail('');
      setAddress('');
      setAadharNo('');
      setDeptId('');
      setDescription('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit complaint');
    }
  };

  return (
    <section className="form-container">
      <h2>File a Complaint</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit} aria-label="Complaint Form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="aadharNo">Aadhar Number</label>
          <input
            type="text"
            id="aadharNo"
            value={aadharNo}
            onChange={(e) => setAadharNo(e.target.value)}
            maxLength={12}
          />
        </div>
        <div className="form-group">
          <label htmlFor="deptId">Department</label>
          <select
            id="deptId"
            value={deptId}
            onChange={(e) => setDeptId(e.target.value)}
            required
            aria-required="true"
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.dept_id} value={dept.dept_id}>
                {dept.dept_name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            aria-required="true"
          />
        </div>
        <button type="submit" className="btn">Submit Complaint</button>
      </form>
    </section>
  );
}

export default ComplaintForm;