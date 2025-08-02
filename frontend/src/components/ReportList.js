import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ReportList() {
  const [reports, setReports] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [radius, setRadius] = useState('5000');
  const [error, setError] = useState('');

  const fetchReports = async () => {
    setError('');
    // Only fetch if both latitude and longitude are provided and valid
    if (
      latitude === '' ||
      longitude === '' ||
      isNaN(Number(latitude)) ||
      isNaN(Number(longitude))
    ) {
      setError('Please enter valid latitude and longitude to search reports.');
      setReports([]);
      return;
    }
    try {
      const params = { latitude, longitude, radius };
      const response = await api.get('/reports', { params });
      setReports(response.data);
    } catch (err) {
      setError('Failed to fetch reports');
      setReports([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchReports();
  };

  return (
    <section className="list-container">
      <h2>Reported Issues</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSearch} className="search-form" aria-label="Search Reports">
        <div className="form-group">
          <label htmlFor="latitude">Latitude</label>
          <input
            type="number"
            id="latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            step="any"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="longitude">Longitude</label>
          <input
            type="number"
            id="longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            step="any"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="radius">Radius (meters)</label>
          <input
            type="number"
            id="radius"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            min="1000"
            max="5000"
          />
        </div>
        <button type="submit" className="btn">Search</button>
      </form>
      <ul className="report-list">
        {reports.map((report) => (
          <li key={report.report_id} className="report-item">
            <h3>{report.title}</h3>
            <p>{report.description}</p>
            <p><strong>Category:</strong> {report.category}</p>
            <p><strong>Status:</strong> {report.status}</p>
            <p><strong>Location:</strong> ({report.latitude}, {report.longitude})</p>
            <p><strong>Flags:</strong> {report.flag_count}</p>
            {report.photos && report.photos.length > 0 && (
              <div className="photo-gallery">
                <h4>Photos:</h4>
                {report.photos.map((photo) => (
                  <img
                    key={photo.photo_id}
                    src={photo.dataUrl}
                    alt={`Report ${report.report_id} - ${photo.filename}`}
                    style={{ maxWidth: '200px', margin: '5px' }}
                  />
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ReportList;