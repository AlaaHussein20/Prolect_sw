import React from 'react';

const DoctorDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="dashboard-container">
      <h1>Welcome to Doctor Dashboard</h1>
      <p>Hello, Dr. {user?.name || 'Doctor'}!</p>
      {/* Add your doctor dashboard content here */}
    </div>
  );
};

export default DoctorDashboard;