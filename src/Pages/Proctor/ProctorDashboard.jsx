import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../Components/Layout';
import api from '../../Services/api';
import { toast } from 'react-toastify';

const ProctorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activeSessions, setActiveSessions] = useState([]);
  const [recentFlags, setRecentFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activeRes, logsRes] = await Promise.all([
        api.get('/proctoring/stats'),
        api.get('/proctoring/active-sessions'),
        api.get('/proctoring/logs?limit=10')
      ]);
      setStats(statsRes.data);
      setActiveSessions(activeRes.data || []);
      setRecentFlags(logsRes.data.logs || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateExam = async (resultId) => {
    if (!window.confirm('Are you sure you want to terminate this exam?')) return;
    try {
      await api.post(`/proctoring/terminate/${resultId}`, { reason: 'Terminated by proctor' });
      toast.success('Exam terminated successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to terminate exam');
    }
  };

  const getSeverityStyle = (severity) => {
    const styles = {
      low: { bg: '#DBEAFE', dot: '#3B82F6' },
      medium: { bg: '#FEF3C7', dot: '#F59E0B' },
      high: { bg: '#FED7AA', dot: '#F97316' },
      critical: { bg: '#FEE2E2', dot: '#EF4444' }
    };
    return styles[severity] || styles.low;
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
    marginBottom: '8px'
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: '#64748B'
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  };

  const statCardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0'
  };

  const statContentStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const iconBoxStyle = (color) => ({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: `${color}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  const statValueStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1E293B'
  };

  const statLabelStyle = {
    fontSize: '13px',
    color: '#64748B'
  };

  const sectionGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px'
  };

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0'
  };

  const cardHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '20px'
  };

  const cardTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1E293B',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  };

  const linkStyle = {
    fontSize: '14px',
    color: '#2563EB',
    textDecoration: 'none',
    fontWeight: '500'
  };

  const sessionItemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: '#F8FAFC',
    borderRadius: '12px',
    marginBottom: '12px'
  };

  const avatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#FFFFFF',
    position: 'relative'
  };

  const onlineIndicatorStyle = {
    position: 'absolute',
    bottom: '-2px',
    right: '-2px',
    width: '12px',
    height: '12px',
    backgroundColor: '#10B981',
    borderRadius: '50%',
    border: '2px solid #F8FAFC'
  };

  const badgeStyle = (type) => {
    const colors = {
      warning: { bg: '#FEF3C7', text: '#D97706' },
      danger: { bg: '#FEE2E2', text: '#DC2626' }
    };
    const c = colors[type] || colors.warning;
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
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#EF4444'
  };

  const activityItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#F8FAFC',
    borderRadius: '10px',
    marginBottom: '8px'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#64748B'
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
    width: '8px',
    height: '8px',
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
          <h1 style={titleStyle}>Proctor Dashboard</h1>
          <p style={subtitleStyle}>Monitor exam sessions in real-time</p>
        </div>

        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={statContentStyle}>
              <div style={iconBoxStyle('#10B981')}>
                <div style={pulseDotStyle}></div>
              </div>
              <div>
                <p style={statValueStyle}>{activeSessions.length}</p>
                <p style={statLabelStyle}>Live Sessions</p>
              </div>
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={statContentStyle}>
              <div style={iconBoxStyle('#F59E0B')}>
                <svg style={{ width: '24px', height: '24px', color: '#F59E0B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p style={statValueStyle}>{stats?.pendingReview || 0}</p>
                <p style={statLabelStyle}>Pending Review</p>
              </div>
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={statContentStyle}>
              <div style={iconBoxStyle('#EF4444')}>
                <svg style={{ width: '24px', height: '24px', color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <div>
                <p style={{ ...statValueStyle, color: '#EF4444' }}>
                  {stats?.severityStats?.find(s => s._id === 'critical')?.count || 0}
                </p>
                <p style={statLabelStyle}>Critical Flags</p>
              </div>
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={statContentStyle}>
              <div style={iconBoxStyle('#2563EB')}>
                <svg style={{ width: '24px', height: '24px', color: '#2563EB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p style={statValueStyle}>{stats?.totalLogs || 0}</p>
                <p style={statLabelStyle}>Total Events</p>
              </div>
            </div>
          </div>
        </div>

        <div style={sectionGridStyle}>
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h2 style={cardTitleStyle}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', animation: 'pulse 2s infinite' }}></span>
                Active Sessions
              </h2>
              <Link to="/proctor/sessions" style={linkStyle}>View All</Link>
            </div>
            {activeSessions.length > 0 ? (
              <div>
                {activeSessions.slice(0, 5).map((session) => (
                  <div key={session._id} style={sessionItemStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={avatarStyle}>
                        {session.student?.firstName?.charAt(0)}
                        <span style={onlineIndicatorStyle}></span>
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                          {session.student?.firstName} {session.student?.lastName}
                        </p>
                        <p style={{ fontSize: '12px', color: '#64748B' }}>{session.exam?.title}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {session.flagCount > 0 && (
                        <span style={badgeStyle('warning')}>{session.flagCount} flags</span>
                      )}
                      <button
                        onClick={() => handleTerminateExam(session._id)}
                        style={terminateBtnStyle}
                        title="Terminate Exam"
                      >
                        <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={emptyStateStyle}>
                <svg style={{ width: '48px', height: '48px', margin: '0 auto 16px', color: '#CBD5E1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p>No active sessions</p>
              </div>
            )}
          </div>

          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h2 style={cardTitleStyle}>Recent Activity</h2>
              <Link to="/proctor/logs" style={linkStyle}>View All</Link>
            </div>
            {recentFlags.length > 0 ? (
              <div>
                {recentFlags.slice(0, 6).map((log) => {
                  const severityStyle = getSeverityStyle(log.severity);
                  return (
                    <div key={log._id} style={activityItemStyle}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: severityStyle.dot, flexShrink: 0 }}></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: '13px', fontWeight: '500', color: '#1E293B', textTransform: 'capitalize', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {log.eventType?.replace(/_/g, ' ')}
                        </p>
                        <p style={{ fontSize: '12px', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {log.student?.firstName} {log.student?.lastName}
                        </p>
                      </div>
                      <span style={{ fontSize: '11px', color: '#94A3B8', whiteSpace: 'nowrap' }}>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={emptyStateStyle}>
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProctorDashboard;
