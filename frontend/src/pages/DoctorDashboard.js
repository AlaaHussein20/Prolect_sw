import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

const DoctorDashboard = () => {
  const [user] = useState(() => JSON.parse(localStorage.getItem('user')));
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('upcoming');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const fetchDoctorData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch doctor profile by userId
      const profileResponse = await axios.get(
        `http://localhost:5001/api/doctors/user/${user.id}`
      );
      setDoctorProfile(profileResponse.data);
      setEditedProfile(profileResponse.data);

      // Fetch appointments for this doctor
      const appointmentsResponse = await axios.get(
        `http://localhost:5001/api/appointments/doctor/${profileResponse.data._id}`
      );
      setAppointments(appointmentsResponse.data);
    } catch (err) {
      console.error('Error fetching doctor data:', err);
      setError(err.response?.data?.message || 'Failed to load doctor data');
    } finally {
      setLoading(false);
    }
  }, [user.id]);

  useEffect(() => {
    fetchDoctorData();
  }, [fetchDoctorData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleEditProfile = () => {
    setIsEditingProfile(true);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setEditedProfile(doctorProfile);
  };

  const handleProfileChange = (e) => {
    setEditedProfile({
      ...editedProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveProfile = async () => {
    try {
      setErrorMessage('');
      const response = await axios.put(
        `http://localhost:5001/api/doctors/${doctorProfile._id}`,
        editedProfile
      );
      setDoctorProfile(response.data.doctor);
      setIsEditingProfile(false);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to update profile');
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const getUpcomingAppointments = () => {
    const now = new Date();
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return (aptDate >= now && apt.status === 'scheduled') || 
             (aptDate >= now && apt.status !== 'completed' && apt.status !== 'canceled');
    });
  };

  const getPastAppointments = () => {
    const now = new Date();
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date);
      return aptDate < now || apt.status === 'completed' || apt.status === 'canceled';
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-message">Loading doctor dashboard...</div>
      </div>
    );
  }

  if (error && !doctorProfile) {
    return (
      <div className="dashboard-container">
        <div className="error-banner">{error}</div>
        <p>Please make sure you have a doctor profile set up.</p>
      </div>
    );
  }

  const upcomingAppointments = getUpcomingAppointments();
  const pastAppointments = getPastAppointments();

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h1>Doctor Dashboard</h1>
          <p className="welcome-text">Welcome back, Dr. {user?.name}!</p>
        </div>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>

      {/* Success and Error Messages */}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}

      {/* Profile Section */}
      <div className="profile-section">
        <div className="section-header">
          <h2>Profile Information</h2>
          {!isEditingProfile && (
            <button onClick={handleEditProfile} className="edit-button">
              Edit Profile
            </button>
          )}
        </div>
        {doctorProfile && (
          <div className="profile-content">
            {isEditingProfile ? (
              <div className="profile-edit-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Name:</label>
                    <input
                      type="text"
                      name="name"
                      value={editedProfile.name || ''}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Specialization:</label>
                    <input
                      type="text"
                      name="specialization"
                      value={editedProfile.specialization || ''}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={editedProfile.email || ''}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone:</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editedProfile.phone || ''}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Consultation Fees:</label>
                    <input
                      type="number"
                      name="fees"
                      value={editedProfile.fees || ''}
                      onChange={handleProfileChange}
                    />
                  </div>
                </div>
                <div className="form-actions">
                  <button onClick={handleSaveProfile} className="save-button">
                    Save Changes
                  </button>
                  <button onClick={handleCancelEdit} className="cancel-button">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-view">
                <div className="profile-item">
                  <span className="profile-label">Name:</span>
                  <span className="profile-value">{doctorProfile.name}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Specialization:</span>
                  <span className="profile-value">{doctorProfile.specialization}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Email:</span>
                  <span className="profile-value">{doctorProfile.email}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Phone:</span>
                  <span className="profile-value">{doctorProfile.phone || 'Not provided'}</span>
                </div>
                <div className="profile-item">
                  <span className="profile-label">Consultation Fees:</span>
                  <span className="profile-value">${doctorProfile.fees}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Appointments Section */}
      <div className="appointments-section">
        <h2>Appointments</h2>
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'upcoming' ? 'active' : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming ({upcomingAppointments.length})
          </button>
          <button
            className={`tab ${activeTab === 'past' ? 'active' : ''}`}
            onClick={() => setActiveTab('past')}
          >
            Past ({pastAppointments.length})
          </button>
        </div>

        <div className="appointments-list">
          {activeTab === 'upcoming' && (
            <>
              {upcomingAppointments.length === 0 ? (
                <p className="no-appointments">No upcoming appointments</p>
              ) : (
                upcomingAppointments.map((appointment) => (
                  <div key={appointment._id} className="appointment-card">
                    <div className="appointment-header">
                      <span className="appointment-date">
                        {formatDate(appointment.date)}
                      </span>
                      <span className="appointment-time">{appointment.time}</span>
                      <span className={`appointment-status ${appointment.status}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="appointment-body">
                      <h3>Patient Information</h3>
                      <div className="patient-info">
                        <p><strong>Name:</strong> {appointment.patient?.name}</p>
                        <p><strong>Email:</strong> {appointment.patient?.email}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}

          {activeTab === 'past' && (
            <>
              {pastAppointments.length === 0 ? (
                <p className="no-appointments">No past appointments</p>
              ) : (
                pastAppointments.map((appointment) => (
                  <div key={appointment._id} className="appointment-card past">
                    <div className="appointment-header">
                      <span className="appointment-date">
                        {formatDate(appointment.date)}
                      </span>
                      <span className="appointment-time">{appointment.time}</span>
                      <span className={`appointment-status ${appointment.status}`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="appointment-body">
                      <h3>Patient Information</h3>
                      <div className="patient-info">
                        <p><strong>Name:</strong> {appointment.patient?.name}</p>
                        <p><strong>Email:</strong> {appointment.patient?.email}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;