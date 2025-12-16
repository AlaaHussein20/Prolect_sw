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
  const [availableSlots, setAvailableSlots] = useState([]);
  const [slotDate, setSlotDate] = useState('');
  const [slotTime, setSlotTime] = useState('');
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('doctorDarkMode');
    return saved ? JSON.parse(saved) : false;
  });
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
      setAvailableSlots(profileResponse.data.availableSlots || []);

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

  useEffect(() => {
    // Apply dark mode to body and html on mount
    if (darkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.remove('dark-mode');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.remove('dark-mode');
    };
  }, [darkMode]);

  const handleToggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('doctorDarkMode', JSON.stringify(newDarkMode));
    
    // Apply dark mode to body and html
    if (newDarkMode) {
      document.body.classList.add('dark-mode');
      document.documentElement.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
      document.documentElement.classList.remove('dark-mode');
    }
  };

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

  const formatSlotLabel = (slot) => {
    if (!slot) return '';
    if (typeof slot === 'string') return slot;
    const dateLabel = slot.date
      ? new Date(slot.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      : 'Any day';
    const timeLabel = slot.time || 'Any time';
    return `${dateLabel} • ${timeLabel}`;
  };

  const handleAddSlot = () => {
    if (!slotDate || !slotTime) {
      setErrorMessage('Please choose both day and time');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    const newSlot = { date: slotDate, time: slotTime };
    const exists = availableSlots.some(
      (s) => s.date === newSlot.date && s.time === newSlot.time
    );
    if (exists) {
      setErrorMessage('Slot already added');
      setTimeout(() => setErrorMessage(''), 3000);
      return;
    }

    setAvailableSlots((prev) => [...prev, newSlot]);
    setSlotDate('');
    setSlotTime('');
  };

  const handleRemoveSlot = (index) => {
    setAvailableSlots((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveSlots = async () => {
    try {
      setErrorMessage('');
      const response = await axios.put(
        `http://localhost:5001/api/doctors/${doctorProfile._id}/slots`,
        { availableSlots }
      );
      setDoctorProfile(response.data.doctor);
      setAvailableSlots(response.data.doctor.availableSlots || []);
      setSuccessMessage('Availability updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error saving slots:', err);
      setErrorMessage(err.response?.data?.message || 'Failed to save availability');
      setTimeout(() => setErrorMessage(''), 4000);
    }
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
    <div className={`dashboard-container ${darkMode ? 'dark-mode' : ''}`}>
      {/* Toolbar */}
      <header style={{
        padding: '16px 36px',
        background: darkMode ? '#232b3e' : '#fff',
        borderBottom: darkMode ? '1px solid rgba(107, 191, 138, 0.2)' : '1px solid rgba(107, 191, 138, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{
            fontSize: 26,
            fontWeight: 800,
            background: darkMode 
              ? 'linear-gradient(135deg, #a8d5ba 0%, #6bbf8a 50%, #4b9b6e 100%)'
              : 'linear-gradient(135deg, #6bbf8a 0%, #4b9b6e 50%, #2e7d5c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
          }}>
            vezeeto
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600, color: darkMode ? '#e8f2ea' : '#0f1a14' }}>
              Dr. {user?.name || 'Doctor'}
            </div>
            <div style={{ fontSize: 12, color: darkMode ? 'rgba(232,242,234,0.6)' : 'rgba(15,26,20,0.7)' }}>
              Doctor
            </div>
          </div>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: darkMode 
              ? 'linear-gradient(145deg, #a8d5ba 0%, #6bbf8a 100%)'
              : 'linear-gradient(145deg, #6bbf8a 0%, #4b9b6e 100%)',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 700,
            fontSize: 18,
            color: '#0b1a12',
          }}>
            {user?.name?.[0]?.toUpperCase() || 'D'}
          </div>
          <button
            onClick={handleToggleDarkMode}
            style={{
              background: darkMode ? 'rgba(168,213,186,0.08)' : 'rgba(168,213,186,0.35)',
              border: darkMode ? '1px solid rgba(168,213,186,0.24)' : '1px solid rgba(75,155,110,0.35)',
              color: darkMode ? '#f4fffa' : '#0f1a14',
              padding: '10px 14px',
              borderRadius: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 14,
              transition: 'all 0.2s',
            }}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              color: '#fff',
              padding: '10px 16px',
              borderRadius: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 14,
              transition: 'all 0.2s',
            }}
          >
            Logout
          </button>
        </div>
      </header>

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

      {/* Availability Section */}
      <div className="appointments-section" style={{ marginTop: '20px' }}>
        <h2>Availability</h2>
        <p className="subtitle">Add your free days and time slots so patients can book easily.</p>
        <div className="form-row" style={{ gap: '12px', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Day</label>
            <input
              type="date"
              value={slotDate}
              onChange={(e) => setSlotDate(e.target.value)}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Time</label>
            <input
              type="time"
              value={slotTime}
              onChange={(e) => setSlotTime(e.target.value)}
            />
          </div>
          <button onClick={handleAddSlot} className="save-button" style={{ height: '48px', alignSelf: 'center' }}>
            + Add Slot
          </button>
        </div>

        <div className="appointments-list" style={{ marginTop: '12px' }}>
          {availableSlots.length === 0 ? (
            <p className="no-appointments">No slots added yet</p>
          ) : (
            availableSlots.map((slot, idx) => (
              <div key={`${slot.date}-${slot.time}-${idx}`} className="appointment-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="appointment-header" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <span className="appointment-date">{formatSlotLabel(slot)}</span>
                  </div>
                </div>
                <button className="cancel-button" onClick={() => handleRemoveSlot(idx)}>
                  Remove
                </button>
              </div>
            ))
          )}
        </div>

        <div className="form-actions" style={{ justifyContent: 'flex-end' }}>
          <button onClick={handleSaveSlots} className="save-button">
            Save Availability
          </button>
        </div>
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