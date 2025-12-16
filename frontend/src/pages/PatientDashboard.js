import React from 'react';
import Navbar from '../components/Navbar';

const PatientDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h1>Welcome to Patient Dashboard</h1>
        <p>Hello, {user?.name || 'Patient'}!</p>
        {/* Add your patient dashboard content here */}
      </div>
    </>
  );
};

export default PatientDashboard;