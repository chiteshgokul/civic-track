import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ReportForm from './components/ReportForm';
import ComplaintForm from './components/ComplaintForm';
import ReportList from './components/ReportList';
import ComplaintList from './components/ComplaintList';
import Profile from './components/Profile';
import MapView from './components/MapView';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={<ProtectedRoute component={Dashboard} />}
            />
            <Route
              path="/report"
              element={<ProtectedRoute component={ReportForm} />}
            />
            <Route path="/complaint" element={<ComplaintForm />} />
            <Route path="/reports" element={<ReportList />} />
            <Route
              path="/complaints"
              element={<ProtectedRoute component={ComplaintList} />}
            />
            <Route
              path="/profile"
              element={<ProtectedRoute component={Profile} />}
            />
            <Route path="/map" element={<MapView />} />
            <Route
              path="/admin"
              element={<ProtectedRoute component={AdminDashboard} isAdmin />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;