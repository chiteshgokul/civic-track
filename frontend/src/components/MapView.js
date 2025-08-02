 import React from 'react';
import '../assets/styles/mapView.css';

function MapView() {
  return (
    <div className="map-view-container">
      <h2>Map View</h2>
      <p>
        Map integration requires react-leaflet. Install with:
        <code>npm install react-leaflet leaflet</code>
      </p>
      <div className="map-placeholder">
        <p>Map will display report locations here</p>
      </div>
    </div>
  );
}

export default MapView;
