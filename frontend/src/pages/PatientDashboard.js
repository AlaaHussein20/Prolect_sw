import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

// Theme configuration
const themes = {
  dark: {
    appBg: 'linear-gradient(145deg, #0c1410 0%, #0f1c15 40%, #13261c 100%)',
    textPrimary: '#e8f2ea',
    textMuted: 'rgba(232,242,234,0.6)',
    headerBorder: '1px solid rgba(46,125,92,0.2)',
    logoGradient: 'linear-gradient(135deg, #a8d5ba 0%, #6bbf8a 50%, #4b9b6e 100%)',
    heroBg: 'linear-gradient(135deg, rgba(168,213,186,0.16) 0%, rgba(107,191,138,0.14) 50%, rgba(75,155,110,0.14) 100%)',
    heroBorder: '1px solid rgba(107,191,138,0.22)',
    cardBg: 'linear-gradient(135deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0.014) 100%)',
    cardBorder: '1px solid rgba(107,191,138,0.18)',
    avatarGradient: 'linear-gradient(145deg, #a8d5ba 0%, #6bbf8a 100%)',
    badge1Bg: 'rgba(168,213,186,0.24)',
    badge1Text: '#f4fffa',
    badge2Bg: 'rgba(75,155,110,0.2)',
    badge2Text: '#e7fbf1',
    primaryGradient: 'linear-gradient(135deg, rgba(107,191,138,0.95) 0%, rgba(75,155,110,0.95) 100%)',
    primaryBorder: '1px solid rgba(75,155,110,0.3)',
    primaryText: '#0b1a12',
    profileBorder: '1px solid rgba(168,213,186,0.24)',
    profileBg: 'rgba(168,213,186,0.08)',
    profileText: '#f4fffa',
    slotBorder: '1px solid rgba(75,155,110,0.28)',
    slotShadow: '0 8px 24px rgba(75,155,110,0.12)',
    sidebarBorder: '1px solid rgba(75,155,110,0.22)',
    sidebarBg: 'linear-gradient(135deg, rgba(168,213,186,0.12), rgba(75,155,110,0.1))',
    sidebarCardBorder: '1px solid rgba(75,155,110,0.18)',
    sidebarCardBg: 'rgba(107,191,138,0.06)',
    cancelGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    cancelBorder: '1px solid rgba(239,68,68,0.3)',
    cancelText: '#fff',
    modalOverlay: 'rgba(12,20,16,0.7)',
    modalBg: '#0f1d17',
    modalBorder: '1px solid rgba(46,125,92,0.35)',
    inputBorder: '1px solid rgba(255,255,255,0.12)',
    inputBg: 'rgba(255,255,255,0.06)',
  },
  light: {
    appBg: 'linear-gradient(145deg, #f4fff7 0%, #eef9f2 40%, #e4f2e9 100%)',
    textPrimary: '#0f1a14',
    textMuted: 'rgba(15,26,20,0.7)',
    headerBorder: '1px solid rgba(75,155,110,0.15)',
    logoGradient: 'linear-gradient(135deg, #6bbf8a 0%, #4b9b6e 50%, #2e7d5c 100%)',
    heroBg: 'linear-gradient(135deg, rgba(168,213,186,0.32) 0%, rgba(107,191,138,0.26) 50%, rgba(75,155,110,0.22) 100%)',
    heroBorder: '1px solid rgba(107,191,138,0.3)',
    cardBg: 'rgba(255,255,255,0.9)',
    cardBorder: '1px solid rgba(107,191,138,0.2)',
    avatarGradient: 'linear-gradient(145deg, #6bbf8a 0%, #4b9b6e 100%)',
    badge1Bg: 'rgba(168,213,186,0.45)',
    badge1Text: '#0f1a14',
    badge2Bg: 'rgba(75,155,110,0.25)',
    badge2Text: '#0f1a14',
    primaryGradient: 'linear-gradient(135deg, #6bbf8a 0%, #4b9b6e 100%)',
    primaryBorder: '1px solid rgba(75,155,110,0.32)',
    primaryText: '#f6fff9',
    profileBorder: '1px solid rgba(75,155,110,0.35)',
    profileBg: 'rgba(168,213,186,0.35)',
    profileText: '#0f1a14',
    slotBorder: '1px solid rgba(75,155,110,0.32)',
    slotShadow: '0 8px 24px rgba(75,155,110,0.16)',
    sidebarBorder: '1px solid rgba(75,155,110,0.25)',
    sidebarBg: 'linear-gradient(135deg, rgba(168,213,186,0.24), rgba(107,191,138,0.22))',
    sidebarCardBorder: '1px solid rgba(75,155,110,0.2)',
    sidebarCardBg: 'rgba(255,255,255,0.94)',
    cancelGradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    cancelBorder: '1px solid rgba(239,68,68,0.3)',
    cancelText: '#fff',
    modalOverlay: 'rgba(0,0,0,0.35)',
    modalBg: '#f7fff9',
    modalBorder: '1px solid rgba(75,155,110,0.3)',
    inputBorder: '1px solid rgba(75,155,110,0.2)',
    inputBg: '#f8fff9',
  },
};


const PatientDashboard = () => {
  const navigate = useNavigate();
  
  // State management
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [slotsByDoctor, setSlotsByDoctor] = useState({});
  const [openSlotsDoctor, setOpenSlotsDoctor] = useState(null);
  const [error, setError] = useState('');
  const [profileDoctor, setProfileDoctor] = useState(null);
  const [themeName, setThemeName] = useState(() => {
    const saved = localStorage.getItem('patientTheme');
    return saved || 'light';
  });
  
  const theme = themes[themeName];
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user?._id;

  // Utility functions
  const formatSlotLabel = useCallback((date, time) => {
    const dayLabel = date
      ? new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
      : 'Any day';
    const timeLabel = time || 'Any time';
    return `${dayLabel} • ${timeLabel}`;
  }, []);

  const slotKey = useCallback((date, time) => {
    const dayKey = date ? new Date(date).toISOString().split('T')[0] : 'any-day';
    const timeKey = time || 'any-time';
    return `${dayKey}|${timeKey}`;
  }, []);

  const normalizeSlots = useCallback((slots = []) => {
    const fallbackSlots = ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'];
    
    if (!slots || slots.length === 0) {
      return fallbackSlots.map((time) => {
        const date = new Date();
        date.setDate(date.getDate() + 1); // Next day
        return {
          key: slotKey(date, time),
          label: formatSlotLabel(date, time),
          date,
          time,
        };
      });
    }
    
    return slots.map((slot) => {
      if (typeof slot === 'string') {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        return {
          key: slotKey(date, slot),
          label: formatSlotLabel(date, slot),
          date,
          time: slot,
        };
      }
      const dateValue = slot.date ? new Date(slot.date) : null;
      return {
        key: slotKey(dateValue, slot.time),
        label: formatSlotLabel(slot.date, slot.time),
        date: dateValue,
        time: slot.time,
      };
    });
  }, [formatSlotLabel, slotKey]);

  const buildSlotMap = useCallback((doctorList = []) => {
    return doctorList.reduce((acc, doc) => {
      acc[doc._id] = normalizeSlots(doc.availableSlots);
      return acc;
    }, {});
  }, [normalizeSlots]);

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  // Handler functions
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleThemeToggle = () => {
    const newTheme = themeName === 'dark' ? 'light' : 'dark';
    setThemeName(newTheme);
    localStorage.setItem('patientTheme', newTheme);
  };

  const handleBookTime = async (doctor, slot) => {
    try {
      if (!userId) {
        alert('Please log in to book an appointment');
        navigate('/login');
        return;
      }

      const payload = {
        patient: userId,
        doctor: doctor._id,
        date: slot.date || new Date(),
        time: slot.time || slot.label || 'Time not specified',
        status: 'scheduled',
      };

      const res = await axios.post('http://localhost:5001/api/appointments/book', payload);
      const savedAppointment = res.data.appointment || payload;
      const appointmentWithDoctor = { 
        ...savedAppointment, 
        doctor: savedAppointment.doctor || doctor 
      };

      setAppointments((prev) => [...prev, appointmentWithDoctor]);
      
      // Remove the booked slot from available slots
      setSlotsByDoctor((prev) => {
        const remaining = (prev[doctor._id] || []).filter((s) => s.key !== slot.key);
        return { ...prev, [doctor._id]: remaining };
      });
      
      setOpenSlotsDoctor(null);
      setError('');
      alert(`✅ Successfully booked ${slot.label} with Dr. ${doctor.name}`);
    } catch (err) {
      console.error('Failed to book appointment:', err);
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
      alert('❌ Failed to book appointment. Please try again.');
    }
  };

  const handleCancelAppointment = async (appointment) => {
    const confirmCancel = window.confirm(
      `Are you sure you want to cancel your appointment with Dr. ${appointment.doctor?.name || 'the doctor'}?`
    );
    
    if (!confirmCancel) return;

    try {
      const appointmentId = appointment._id;
      const doctorId = appointment.doctor?._id || appointment.doctor;
      
      await axios.patch(`http://localhost:5001/api/appointments/${appointmentId}/cancel`);

      setAppointments((prev) => prev.filter((apt) => apt._id !== appointmentId));
      
      // Add the slot back to available slots
      if (doctorId && appointment.date && appointment.time) {
        const dateValue = new Date(appointment.date);
        const key = slotKey(dateValue, appointment.time);
        const slot = {
          key,
          label: formatSlotLabel(dateValue, appointment.time),
          date: dateValue,
          time: appointment.time,
        };

        setSlotsByDoctor((prev) => {
          const existing = prev[doctorId] || [];
          const exists = existing.some((s) => s.key === key);
          if (exists) return prev;
          return { ...prev, [doctorId]: [...existing, slot].sort((a, b) => new Date(a.date) - new Date(b.date)) };
        });
      }
      
      setError('');
      alert('✅ Appointment cancelled successfully');
    } catch (err) {
      console.error('Failed to cancel appointment:', err);
      setError(err.response?.data?.error || 'Unable to cancel appointment. Please try again.');
      alert('❌ Failed to cancel appointment. Please try again.');
    }
  };

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        const [doctorsRes, appointmentsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/doctors'),
          axios.get('http://localhost:5001/api/appointments'),
        ]);

        const doctorsList = doctorsRes.data || [];
        setDoctors(doctorsList);
        setSlotsByDoctor(buildSlotMap(doctorsList));

        const myAppointments = (appointmentsRes.data || []).filter((apt) => {
          const patientId = apt.patient?._id || apt.patient;
          return patientId === userId && apt.status !== 'canceled';
        });
        setAppointments(myAppointments);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError(err.response?.data?.error || 'Failed to load data. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, buildSlotMap]);

  // Computed values
  const now = new Date();
  const upcomingAppointments = appointments
    .filter((apt) => new Date(apt.date) >= now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const specializationGroups = doctors.reduce((acc, doctor) => {
    const spec = doctor.specialization || 'Other';
    if (!acc[spec]) acc[spec] = [];
    acc[spec].push(doctor);
    return acc;
  }, {});

  const specializations = ['All', ...Object.keys(specializationGroups).sort()];

  const filteredDoctors = doctors.filter((doctor) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchLower) ||
      (doctor.specialization || '').toLowerCase().includes(searchLower);
    const matchesSpec = 
      selectedSpecialization === 'All' || 
      doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpec;
  });


  // Loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: theme.appBg,
        color: theme.textPrimary,
        fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Helvetica Neue', Arial, sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>Loading your dashboard...</div>
          <div style={{ fontSize: 14, color: theme.textMuted, marginTop: 8 }}>Please wait</div>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!user || !userId) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: theme.appBg,
        color: theme.textPrimary,
        fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Helvetica Neue', Arial, sans-serif",
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>Session expired</div>
          <div style={{ fontSize: 14, color: theme.textMuted, marginBottom: 20 }}>Please log in again</div>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: theme.primaryGradient,
              border: 'none',
              color: theme.primaryText,
              padding: '12px 24px',
              borderRadius: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 16,
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.appBg,
      color: theme.textPrimary,
      fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Helvetica Neue', Arial, sans-serif",
    }}>
      {/* Header */}
      <header style={{
        padding: '16px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: theme.headerBorder,
        flexWrap: 'wrap',
        gap: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flex: 1, minWidth: 300 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{
            fontSize: 26,
            fontWeight: 800,
            background: theme.logoGradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
            }}>
              vezeeto
            </span>
          </Link>
          <div style={{ position: 'relative', flex: 1, maxWidth: 480 }}>
            <span style={{ 
              position: 'absolute', 
              left: 14, 
              top: '50%', 
              transform: 'translateY(-50%)',
              fontSize: 18,
            }}>
              🔍
            </span>
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search doctors or specializations..."
              style={{
                width: '100%',
                padding: '12px 14px 12px 44px',
                borderRadius: 14,
                border: theme.inputBorder,
                background: theme.inputBg,
                color: theme.textPrimary,
                outline: 'none',
                fontSize: 14,
                transition: 'all 0.2s',
              }}
            />
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 600, color: theme.textPrimary }}>
              {user?.name || 'Patient'}
            </div>
            <div style={{ fontSize: 12, color: theme.textMuted }}>Patient</div>
          </div>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: '50%',
            background: theme.avatarGradient,
            display: 'grid',
            placeItems: 'center',
            fontWeight: 700,
            fontSize: 18,
            color: theme.primaryText,
          }}>
            {user?.name?.[0]?.toUpperCase() || 'P'}
          </div>
          <button
            onClick={handleThemeToggle}
            style={{
              background: theme.profileBg,
              border: theme.profileBorder,
              color: theme.profileText,
              padding: '10px 14px',
              borderRadius: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 14,
              transition: 'all 0.2s',
            }}
            title={`Switch to ${themeName === 'dark' ? 'light' : 'dark'} mode`}
          >
            {themeName === 'dark' ? '☀️ Light' : '🌙 Dark'}
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
          <button
            onClick={() => navigate('/appointment-history')}
            style={{
              background: theme.profileBg,
              border: theme.profileBorder,
              color: theme.profileText,
              padding: '10px 14px',
              borderRadius: 12,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 14,
              transition: 'all 0.2s',
            }}
            title="View Appointment History"
          >
            📜 History
          </button>
        </div>
      </header>

      <main style={{ padding: '28px 36px 48px' }}>
        {/* Hero Section */}
        <section style={{
          background: theme.heroBg,
          border: theme.heroBorder,
          borderRadius: 18,
          padding: '24px 28px',
          marginBottom: 24,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 300 }}>
              <div style={{ fontSize: 14, color: theme.textMuted, marginBottom: 4 }}>
                Welcome back, {user?.name || 'Patient'}! 👋
              </div>
              <h1 style={{ margin: '8px 0 16px', fontSize: 28, color: theme.textPrimary, fontWeight: 700 }}>
                Find Your Doctor & Book Instantly
              </h1>
              <div style={{ fontSize: 14, color: theme.textMuted, marginBottom: 16 }}>
                Filter by specialization:
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {specializations.map((spec) => (
                  <button
                    key={spec}
                    onClick={() => setSelectedSpecialization(spec)}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 12,
                      border: selectedSpecialization === spec 
                        ? 'none' 
                        : `1px solid ${theme.textMuted}`,
                      background: selectedSpecialization === spec 
                        ? theme.primaryGradient 
                        : 'transparent',
                      color: selectedSpecialization === spec 
                        ? theme.primaryText 
                        : theme.textPrimary,
                      cursor: 'pointer',
                      fontWeight: 600,
                      fontSize: 13,
                      transition: 'all 0.2s',
                    }}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ textAlign: 'right', minWidth: 200 }}>
              <div style={{ fontSize: 14, color: theme.textMuted, marginBottom: 8 }}>
                Available Doctors
              </div>
              <div style={{ fontSize: 42, fontWeight: 800, color: '#4b9b6e', marginBottom: 4 }}>
                {filteredDoctors.length}
              </div>
              <div style={{ fontSize: 13, color: theme.textMuted }}>
                Filter: <strong>{selectedSpecialization}</strong>
              </div>
              <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 8 }}>
                Your appointments: <strong>{upcomingAppointments.length}</strong>
              </div>
            </div>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div style={{
            marginBottom: 20,
            color: '#dc2626',
            padding: 14,
            borderRadius: 12,
            border: '1px solid rgba(239,68,68,0.3)',
            background: 'rgba(239,68,68,0.1)',
            fontWeight: 500,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Main Content Grid */}
        <section style={{ 
          display: 'grid', 
          gridTemplateColumns: '2fr 1fr', 
          gap: 24, 
          alignItems: 'start',
        }}>
          {/* Doctors List */}
          <div style={{ display: 'grid', gap: 16 }}>
            {filteredDoctors.length === 0 ? (
              <div style={{
                padding: 40,
                borderRadius: 16,
                border: theme.cardBorder,
                background: theme.cardBg,
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
                  No doctors found
                </div>
                <div style={{ fontSize: 14, color: theme.textMuted }}>
                  Try adjusting your search or filter
                </div>
              </div>
            ) : (
              filteredDoctors.map((doctor) => {
                const slots = slotsByDoctor[doctor._id] || [];
                const isOpen = openSlotsDoctor === doctor._id;
                
                return (
                  <div
                    key={doctor._id}
                    style={{
                      borderRadius: 16,
                      border: theme.cardBorder,
                      background: theme.cardBg,
                      padding: 20,
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'auto 1fr auto',
                      gap: 18,
                      alignItems: 'center',
                    }}>
                      {/* Doctor Avatar */}
                      <div style={{
                        width: 80,
                        height: 80,
                        borderRadius: 20,
                        background: theme.avatarGradient,
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 36,
                        color: theme.primaryText,
                        fontWeight: 800,
                      }}>
                        👨‍⚕️
                      </div>

                      {/* Doctor Info */}
                      <div>
                        <div style={{ 
                          fontWeight: 700, 
                          fontSize: 20, 
                          color: theme.textPrimary,
                          marginBottom: 8,
                        }}>
                          Dr. {doctor.name}
                        </div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 8 }}>
                          <span style={{ 
                            padding: '6px 12px', 
                            borderRadius: 10, 
                            background: theme.badge1Bg, 
                            color: theme.badge1Text, 
                            fontSize: 12,
                            fontWeight: 600,
                          }}>
                            {doctor.specialization || 'General'}
                          </span>
                          <span style={{ 
                            padding: '6px 12px', 
                            borderRadius: 10, 
                            background: theme.badge2Bg, 
                            color: theme.badge2Text, 
                            fontSize: 12,
                            fontWeight: 600,
                          }}>
                            ${doctor.fees || 50} consultation
                          </span>
                          <span style={{ 
                            padding: '6px 12px', 
                            borderRadius: 10, 
                            background: theme.badge2Bg, 
                            color: theme.badge2Text, 
                            fontSize: 12,
                            fontWeight: 600,
                          }}>
                            {slots.length} {slots.length === 1 ? 'slot' : 'slots'} available
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <button
                          onClick={() => setOpenSlotsDoctor(isOpen ? null : doctor._id)}
                          style={{
                            background: theme.primaryGradient,
                            border: theme.primaryBorder,
                            color: theme.primaryText,
                            padding: '12px 18px',
                            borderRadius: 12,
                            fontWeight: 700,
                            cursor: 'pointer',
                            minWidth: 130,
                            boxShadow: theme.slotShadow,
                            fontSize: 14,
                            transition: 'all 0.2s',
                          }}
                        >
                          {isOpen ? '▲ Hide Slots' : '📅 Book Now'}
                        </button>
                        <button
                          onClick={() => setProfileDoctor(doctor)}
                          style={{
                            border: theme.profileBorder,
                            background: theme.profileBg,
                            color: theme.profileText,
                            padding: '10px 18px',
                            borderRadius: 12,
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontSize: 13,
                            transition: 'all 0.2s',
                          }}
                        >
                          👤 View Profile
                        </button>
                      </div>
                    </div>

                    {/* Available Slots */}
                    {isOpen && (
                      <div style={{ marginTop: 20, paddingTop: 20, borderTop: theme.headerBorder }}>
                        <div style={{ 
                          fontSize: 14, 
                          fontWeight: 600, 
                          marginBottom: 12,
                          color: theme.textPrimary,
                        }}>
                          Available Time Slots:
                        </div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          {slots.length === 0 ? (
                            <span style={{ color: theme.textMuted, fontSize: 14 }}>
                              No slots available at the moment
                            </span>
                          ) : (
                            slots.map((slot) => (
                              <button
                                key={slot.key || slot.label}
                                onClick={() => handleBookTime(doctor, slot)}
                                style={{
                                  background: theme.primaryGradient,
                                  border: theme.slotBorder,
                                  color: theme.primaryText,
                                  padding: '12px 16px',
                                  borderRadius: 12,
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  boxShadow: theme.slotShadow,
                                  fontSize: 13,
                                  transition: 'all 0.2s',
                                }}
                              >
                                {slot.label}
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Sidebar - Upcoming Appointments */}
          <aside style={{ display: 'grid', gap: 16, position: 'sticky', top: 20 }}>
            <div style={{
              borderRadius: 16,
              border: theme.sidebarBorder,
              background: theme.sidebarBg,
              padding: 20,
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12, 
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: theme.headerBorder,
              }}>
                <span style={{ fontSize: 24 }}>📅</span>
                <h3 style={{ margin: 0, color: theme.textPrimary, fontSize: 18 }}>
                  Upcoming Appointments
                </h3>
              </div>
              
              {upcomingAppointments.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '32px 16px',
                  color: theme.textMuted,
                }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>
                    No upcoming appointments
                  </div>
                  <div style={{ fontSize: 12, marginTop: 4 }}>
                    Book a doctor to get started
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {upcomingAppointments.slice(0, 5).map((apt) => (
                    <div
                      key={apt._id}
                      style={{
                        padding: 16,
                        borderRadius: 12,
                        border: theme.sidebarCardBorder,
                        background: theme.sidebarCardBg,
                        transition: 'all 0.2s',
                      }}
                    >
                      <div style={{ 
                        fontWeight: 700, 
                        color: theme.textPrimary,
                        fontSize: 15,
                        marginBottom: 6,
                      }}>
                        Dr. {apt.doctor?.name || 'Doctor'}
                      </div>
                      <div style={{ 
                        fontSize: 13, 
                        color: theme.textMuted,
                        marginBottom: 4,
                      }}>
                        📅 {formatDate(apt.date)}
                      </div>
                      <div style={{ 
                        fontSize: 13, 
                        color: theme.textMuted,
                        marginBottom: 12,
                      }}>
                        🕒 {apt.time}
                      </div>
                      <button
                        onClick={() => handleCancelAppointment(apt)}
                        style={{
                          width: '100%',
                          background: theme.cancelGradient,
                          border: theme.cancelBorder,
                          color: theme.cancelText,
                          padding: '10px 14px',
                          borderRadius: 10,
                          fontWeight: 700,
                          cursor: 'pointer',
                          fontSize: 13,
                          transition: 'all 0.2s',
                        }}
                      >
                        ❌ Cancel Appointment
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </section>
      </main>

      {/* Doctor Profile Modal */}
      {profileDoctor && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: theme.modalOverlay,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            zIndex: 1000,
          }}
          onClick={() => setProfileDoctor(null)}
        >
          <div 
            style={{
              width: '100%',
              maxWidth: 520,
              background: theme.modalBg,
              borderRadius: 20,
              border: theme.modalBorder,
              padding: 28,
              boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              marginBottom: 20,
              paddingBottom: 16,
              borderBottom: theme.headerBorder,
            }}>
              <div>
                <h3 style={{ margin: 0, color: theme.textPrimary, fontSize: 22 }}>
                  Dr. {profileDoctor.name}
                </h3>
                <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 4 }}>
                  Doctor Profile
                </div>
              </div>
              <button
                onClick={() => setProfileDoctor(null)}
                style={{
                  background: theme.cancelGradient,
                  border: 'none',
                  color: '#fff',
                  padding: '8px 16px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 14,
                }}
              >
                ✕ Close
              </button>
            </div>

            <div style={{ display: 'grid', gap: 16, color: theme.textPrimary }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12,
                padding: 14,
                background: theme.cardBg,
                borderRadius: 12,
                border: theme.cardBorder,
              }}>
                <span style={{ fontSize: 24 }}>🏥</span>
                <div>
                  <div style={{ fontSize: 12, color: theme.textMuted }}>Specialization</div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>
                    {profileDoctor.specialization || 'N/A'}
                  </div>
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 12,
                padding: 14,
                background: theme.cardBg,
                borderRadius: 12,
                border: theme.cardBorder,
              }}>
                <span style={{ fontSize: 24 }}>💰</span>
                <div>
                  <div style={{ fontSize: 12, color: theme.textMuted }}>Consultation Fee</div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>
                    ${profileDoctor.fees || 0}
                  </div>
                </div>
              </div>

              {profileDoctor.email && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12,
                  padding: 14,
                  background: theme.cardBg,
                  borderRadius: 12,
                  border: theme.cardBorder,
                }}>
                  <span style={{ fontSize: 24 }}>✉️</span>
                  <div>
                    <div style={{ fontSize: 12, color: theme.textMuted }}>Email</div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>
                      {profileDoctor.email}
                    </div>
                  </div>
                </div>
              )}

              {profileDoctor.phone && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 12,
                  padding: 14,
                  background: theme.cardBg,
                  borderRadius: 12,
                  border: theme.cardBorder,
                }}>
                  <span style={{ fontSize: 24 }}>📞</span>
                  <div>
                    <div style={{ fontSize: 12, color: theme.textMuted }}>Phone</div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>
                      {profileDoctor.phone}
                    </div>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 8 }}>
                <div style={{ 
                  fontSize: 14, 
                  fontWeight: 600, 
                  marginBottom: 12,
                  color: theme.textPrimary,
                }}>
                  📅 Available Time Slots:
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {(slotsByDoctor[profileDoctor._id] || []).length === 0 ? (
                    <span style={{ color: theme.textMuted, fontSize: 13 }}>
                      No slots available
                    </span>
                  ) : (
                    (slotsByDoctor[profileDoctor._id] || []).map((slot) => (
                      <span
                        key={slot.key || slot.label}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 10,
                          border: theme.cardBorder,
                          background: theme.cardBg,
                          fontSize: 13,
                          fontWeight: 600,
                        }}
                      >
                        {slot.label}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
