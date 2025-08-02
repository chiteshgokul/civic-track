import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/home.css';

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to CivicTrack</h1>
      <p>
        Report civic issues like potholes, lighting problems, and more. Track
        progress and stay informed!
      </p>
      <div className="home-buttons">
        <Link to="/login" className="home-button">
          Login
        </Link>
        <Link to="/signup" className="home-button">
          Signup
        </Link>
      </div>
    </div>
  );
}

export default Home; 
