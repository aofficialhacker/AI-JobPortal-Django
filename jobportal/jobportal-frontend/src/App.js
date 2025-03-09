// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './components/Login';
import Register from './components/Register';
import JobListings from './components/JobListings';
import Dashboard from './components/Dashboard';
import CandidateDashboard from './components/CandidateDashboard';
import ApplyJob from './components/ApplyJob';
import PostJob from './components/PostJob';
import EditJob from './components/EditJob';

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<JobListings />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/my-applications" element={<CandidateDashboard />} />
        <Route path="/apply/:jobId" element={<ApplyJob />} />
        <Route path="/post-job" element={<PostJob />} />
        <Route path="/jobs/edit/:jobId" element={<EditJob />} />
      </Routes>
    </Router>
  );
}

export default App;
