import React from 'react';

const PatientDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="dashboard-container">
      <h1>Welcome to Patient Dashboard</h1>
      <p>Hello, {user?.name || 'Patient'}!</p>
      {/* Add your patient dashboard content here */}
    </div>
  );
};

export default PatientDashboard;