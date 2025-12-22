import { useState, useEffect } from 'react';
import Layout from '../../Components/Layout';
import api from '../../Services/api';
import { toast } from 'react-toastify';

const LiveSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/proctoring/active-sessions');
      setSessions(response.data || []);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateExam = async (resultId) => {
    if (!window.confirm('Are you sure you want to terminate this exam?')) return;
    try {
      await api.post(`/proctoring/terminate/${resultId}`, { reason: 'Terminated by proctor' });
      toast.success('Exam terminated successfully');
      fetchSessions();
    } catch (error) {
      toast.error('Failed to terminate exam');
    }
  };

  const containerStyle = {
    animation: 'fadeIn 0.3s ease-out'
  };

  const headerStyle = {
    marginBottom: '32px'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: '#64748B'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px'
  };

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0'
  };

  const sessionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px'
  };

  const avatarStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600',
    color: '#FFFFFF',
    position: 'relative'
  };

  const onlineIndicatorStyle = {
    position: 'absolute',
    bottom: '-2px',
    right: '-2px',
    width: '14px',
    height: '14px',
    backgroundColor: '#10B981',
    borderRadius: '50%',
    border: '3px solid #FFFFFF'
  };

  const studentNameStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1E293B'
  };

  const examTitleStyle = {
    fontSize: '13px',
    color: '#64748B'
  };

  const statsRowStyle = {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px'
  };

  const statItemStyle = {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: '10px',
    padding: '12px',
    textAlign: 'center'
  };

  const statValueStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1E293B'
  };

  const statLabelStyle = {
    fontSize: '11px',
    color: '#64748B',
    textTransform: 'uppercase'
  };

  const badgeStyle = (type) => {
    const colors = {
      warning: { bg: '#FEF3C7', text: '#D97706' },
      danger: { bg: '#FEE2E2', text: '#DC2626' },
      success: { bg: '#D1FAE5', text: '#059669' }
    };
    const c = colors[type] || colors.success;
    return {
      display: 'inline-block',
      padding: '4px 10px',
      fontSize: '12px',
      fontWeight: '500',
      backgroundColor: c.bg,
      color: c.text,
      borderRadius: '6px'
    };
  };

  const terminateBtnStyle = {
    width: '100%',
    padding: '12px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#EF4444',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease'
  };

  const emptyStateStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '64px 24px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0'
  };

  const spinnerContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh'
  };

  const spinnerStyle = {
    width: '48px',
    height: '48px',
    border: '4px solid #E2E8F0',
    borderTop: '4px solid #10B981',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const pulseDotStyle = {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#10B981',
    animation: 'pulse 2s infinite'
  };

  if (loading) {
    return (
      <Layout>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={spinnerContainerStyle}>
          <div style={spinnerStyle}></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            <span style={pulseDotStyle}></span>
            Live Sessions
          </h1>
          <p style={subtitleStyle}>Monitor active exam sessions in real-time</p>
        </div>

        {sessions.length > 0 ? (
          <div style={gridStyle}>
            {sessions.map((session) => (
              <div key={session._id} style={cardStyle}>
                <div style={sessionHeaderStyle}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={avatarStyle}>
                      {session.student?.firstName?.charAt(0)}
                      <span style={onlineIndicatorStyle}></span>
                    </div>
                    <div>
                      <p style={studentNameStyle}>
                        {session.student?.firstName} {session.student?.lastName}
                      </p>
                      <p style={examTitleStyle}>{session.exam?.title}</p>
                    </div>
                  </div>
                  {session.flagCount > 0 && (
                    <span style={badgeStyle(session.flagCount > 3 ? 'danger' : 'warning')}>
                      {session.flagCount} flags
                    </span>
                  )}
                </div>

                <div style={statsRowStyle}>
                  <div style={statItemStyle}>
                    <p style={statValueStyle}>{session.progress || 0}%</p>
                    <p style={statLabelStyle}>Progress</p>
                  </div>
                  <div style={statItemStyle}>
                    <p style={statValueStyle}>{session.timeRemaining || '--'}</p>
                    <p style={statLabelStyle}>Time Left</p>
                  </div>
                  <div style={statItemStyle}>
                    <p style={statValueStyle}>{session.answeredCount || 0}</p>
                    <p style={statLabelStyle}>Answered</p>
                  </div>
                </div>

                <button
                  onClick={() => handleTerminateExam(session._id)}
                  style={terminateBtnStyle}
                >
                  <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Terminate Exam
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={emptyStateStyle}>
            <svg style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: '#CBD5E1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1E293B', marginBottom: '8px' }}>No Active Sessions</h3>
            <p style={{ fontSize: '14px', color: '#64748B' }}>There are no students currently taking exams</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LiveSessions;
