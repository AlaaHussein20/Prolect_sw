import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import API_URL from '../config/api';
import '../styles/Dashboard.css';
import Footer from '../components/Footer';

const themes = {
  dark: {
    appBg: 'linear-gradient(145deg, #0c1410 0%, #0f1c15 40%, #13261c 100%)',
    textPrimary: '#e8f2ea',
    textMuted: 'rgba(232,242,234,0.6)',
    headerBorder: '1px solid rgba(46,125,92,0.2)',
    cardBg: 'linear-gradient(135deg, rgba(255,255,255,0.028) 0%, rgba(255,255,255,0.014) 100%)',
    cardBorder: '1px solid rgba(107,191,138,0.18)',
    primaryGradient: 'linear-gradient(135deg, rgba(107,191,138,0.95) 0%, rgba(75,155,110,0.95) 100%)',
    primaryText: '#0b1a12',
    inputBorder: '1px solid rgba(255,255,255,0.12)',
    inputBg: 'rgba(255,255,255,0.06)',
  },
  light: {
    appBg: 'linear-gradient(145deg, #f4fff7 0%, #eef9f2 40%, #e4f2e9 100%)',
    textPrimary: '#0f1a14',
    textMuted: 'rgba(15,26,20,0.7)',
    headerBorder: '1px solid rgba(75,155,110,0.15)',
    cardBg: 'rgba(255,255,255,0.9)',
    cardBorder: '1px solid rgba(107,191,138,0.2)',
    primaryGradient: 'linear-gradient(135deg, #6bbf8a 0%, #4b9b6e 100%)',
    primaryText: '#f6fff9',
    inputBorder: '1px solid rgba(75,155,110,0.2)',
    inputBg: '#f8fff9',
  },
};

const AppointmentHistory = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc'); // desc = newest first
  const [specializationFilter, setSpecializationFilter] = useState('All');
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('appTheme') === 'dark';
  });

  const theme = isDark ? themes.dark : themes.light;
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const userId = user?._id;

  const handleThemeChange = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);
    localStorage.setItem('appTheme', newIsDark ? 'dark' : 'light');
  };

  useEffect(() => {
    const fetchHistory = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/api/appointments`);
        const all = res.data || [];

        const now = new Date();
        // past appointments for this user (status not canceled)
        const myPast = all.filter((apt) => {
          const patientId = apt.patient?._id || apt.patient;
          const aptDate = new Date(apt.date);
          return (
            patientId === userId &&
            apt.status !== 'canceled' &&
            aptDate < now
          );
        }).map((apt) => ({ ...apt, dateObj: new Date(apt.date) }));

        setAppointments(myPast);
        setError('');
      } catch (err) {
        console.error('Failed to load appointment history', err);
        setError(err.response?.data?.error || 'Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [userId]);

  const specializations = useMemo(() => {
    const set = new Set(appointments.map((a) => a.doctor?.specialization || 'Other'));
    return ['All', ...Array.from(set).sort()];
  }, [appointments]);

  const filtered = useMemo(() => {
    let list = appointments.slice();
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((a) => (a.doctor?.name || '').toLowerCase().includes(s) || (a.notes || '').toLowerCase().includes(s));
    }
    if (specializationFilter !== 'All') {
      list = list.filter((a) => (a.doctor?.specialization || 'Other') === specializationFilter);
    }
    list.sort((a, b) => (sort === 'asc' ? a.dateObj - b.dateObj : b.dateObj - a.dateObj));
    return list;
  }, [appointments, search, sort, specializationFilter]);

  const formatDate = (d) => {
    try {
      return new Date(d).toLocaleDateString();
    } catch (e) { return d; }
  };

  return (
    <div style={{ minHeight: '100vh', background: theme.appBg, color: theme.textPrimary, fontFamily: "'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Helvetica Neue', Arial, sans-serif" }}>
      <header style={{
        padding: '16px 36px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: theme.headerBorder,
        flexWrap: 'wrap',
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: isDark ? '#1a2a1f' : '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, flex: 1 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <span style={{
            fontSize: 26,
            fontWeight: 800,
            background: isDark
              ? 'linear-gradient(135deg, #a8d5ba 0%, #6bbf8a 50%, #4b9b6e 100%)'
              : 'linear-gradient(135deg, #6bbf8a 0%, #4b9b6e 50%, #2e7d5c 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            cursor: 'pointer',
            }}>
              vezeeto
            </span>
          </Link>
          <div style={{ fontSize: 14, color: theme.textMuted, fontWeight: 500 }}>Your Medical Platform</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button 
            onClick={handleThemeChange}
            style={{
              background: 'transparent',
              border: `1px solid ${theme.textMuted}`,
              color: theme.textPrimary,
              cursor: 'pointer',
              fontSize: 18,
              padding: '6px 10px',
              borderRadius: 8,
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(107,191,138,0.1)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
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
            background: isDark
              ? 'linear-gradient(145deg, #a8d5ba 0%, #6bbf8a 100%)'
              : 'linear-gradient(145deg, #6bbf8a 0%, #4b9b6e 100%)',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 700,
            fontSize: 18,
            color: theme.primaryText,
          }}>
            {user?.name?.[0]?.toUpperCase() || 'P'}
          </div>
          <button 
            onClick={() => navigate('/patient-dashboard')} 
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
          >
            ← Dashboard
          </button>
        </div>
      </header>

      <main style={{ padding: 28 }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'grid', gap: 16 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <input placeholder="Search by doctor or notes..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1, padding: '10px 12px', borderRadius: 10, border: theme.inputBorder, background: theme.inputBg, color: theme.textPrimary }} />

            <select value={specializationFilter} onChange={(e) => setSpecializationFilter(e.target.value)} style={{ padding: '10px 12px', borderRadius: 10, border: theme.inputBorder, background: theme.inputBg, color: theme.textPrimary }}>
              {specializations.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ padding: '10px 12px', borderRadius: 10, border: theme.inputBorder, background: theme.inputBg, color: theme.textPrimary }}>
              <option value="desc">Newest first</option>
              <option value="asc">Oldest first</option>
            </select>
          </div>

          {error && <div style={{ color: '#dc2626', padding: 12, borderRadius: 8, background: 'rgba(239,68,68,0.06)' }}>{error}</div>}

          {loading ? (
            <div style={{ padding: 40, borderRadius: 12, background: theme.cardBg, border: theme.cardBorder, color: theme.textMuted }}>Loading history...</div>
          ) : filtered.length === 0 ? (
            <div style={{ padding: 40, borderRadius: 12, background: theme.cardBg, border: theme.cardBorder, color: theme.textMuted }}>No past appointments found.</div>
          ) : (
            filtered.map((apt) => (
              <div key={apt._id} className="appointment-card" style={{ background: theme.cardBg, border: theme.cardBorder }}>
                <div className="appointment-header">
                  <div>
                    <div className="appointment-date" style={{ color: theme.textPrimary }}>{apt.doctor?.name ? `Dr. ${apt.doctor.name}` : 'Doctor'}</div>
                    <div style={{ color: theme.textMuted, fontSize: 13 }}>📅 {formatDate(apt.date)} • 🕒 {apt.time}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 700, color: theme.textPrimary }}>{apt.doctor?.specialization || 'General'}</div>
                    <div style={{ fontSize: 13, color: theme.textMuted, marginTop: 6 }}>${apt.doctor?.fees || 0} fee</div>
                  </div>
                </div>

                <div style={{ marginTop: 12, color: theme.textMuted }}>
                  <div style={{ fontWeight: 600, color: theme.textPrimary, marginBottom: 6 }}>Visit notes</div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{apt.notes || 'No notes available.'}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer theme={theme} />
    </div>
  );
};

export default AppointmentHistory;
