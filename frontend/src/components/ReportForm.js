import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api'; // Corrected import path

function ReportForm() {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    categoryId: '',
    latitude: '',
    longitude: '',
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('categoryId', formData.categoryId);
    data.append('latitude', formData.latitude);
    data.append('longitude', formData.longitude);
    for (let i = 0; i < files.length; i++) {
      data.append('photos', files[i]);
    }

    try {
      const response = await api.post('/reports', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess('Report submitted successfully!');
      setFormData({ title: '', description: '', categoryId: '', latitude: '', longitude: '' });
      setFiles([]);
    } catch (err) {
      setError('Failed to submit report');
    }
  };

  return (
    <section className="form-container">
      <h2>Submit a Report</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit} className="report-form" encType="multipart/form-data">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="categoryId">Category</label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="1">Roads</option>
            <option value="2">Lighting</option>
            <option value="3">Water Supply</option>
            <option value="4">Cleanliness</option>
            <option value="5">Public Safety</option>
            <option value="6">Obstructions</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="latitude">Latitude</label>
          <input
            type="number"
            id="latitude"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            step="any"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="longitude">Longitude</label>
          <input
            type="number"
            id="longitude"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            step="any"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="photos">Photos</label>
          <input
            type="file"
            id="photos"
            name="photos"
            multiple
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn">Submit Report</button>
      </form>
    </section>
  );
}

export default ReportForm;