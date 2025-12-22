import { useState, useEffect } from 'react';
import Layout from '../../Components/Layout';
import api from '../../Services/api';
import { toast } from 'react-toastify';

const Proctoring = () => {
  const [stats, setStats] = useState(null);
  const [flaggedExams, setFlaggedExams] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProctoringData();
  }, []);

  const fetchProctoringData = async () => {
    try {
      const [statsRes, flaggedRes, activeRes] = await Promise.all([
        api.get('/proctoring/stats'),
        api.get('/proctoring/flagged'),
        api.get('/proctoring/active-sessions')
      ]);
      setStats(statsRes.data);
      setFlaggedExams(flaggedRes.data.results || []);
      setActiveSessions(activeRes.data || []);
    } catch (error) {
      console.error('Failed to fetch proctoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateExam = async (resultId) => {
    if (!window.confirm('Are you sure you want to terminate this exam?')) return;
    try {
      await api.post(`/proctoring/terminate/${resultId}`, { reason: 'Terminated by admin' });
      toast.success('Exam terminated successfully');
      fetchProctoringData();
    } catch (error) {
      toast.error('Failed to terminate exam');
    }
  };

  const getSeverityStyle = (severity) => {
    const styles = {
      low: { bg: '#DBEAFE', text: '#1D4ED8' },
      medium: { bg: '#FEF3C7', text: '#D97706' },
      high: { bg: '#FED7AA', text: '#EA580C' },
      critical: { bg: '#FEE2E2', text: '#DC2626' }
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
    gap: '20px',
    marginBottom: '32px'
  };

  const statCardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0'
  };

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0',
    overflow: 'hidden'
  };

  const tabContainerStyle = {
    display: 'flex',
    borderBottom: '1px solid #E2E8F0'
  };

  const tabStyle = (isActive) => ({
    padding: '16px 24px',
    fontSize: '14px',
    fontWeight: '500',
    color: isActive ? '#2563EB' : '#64748B',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: isActive ? '2px solid #2563EB' : '2px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });

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
    borderTop: '4px solid #2563EB',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
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
      `}</style>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>Proctoring Management</h1>
          <p style={subtitleStyle}>Monitor exam sessions and review flagged incidents</p>
        </div>

        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <p style={{ fontSize: '32px', fontWeight: '700', color: '#2563EB', marginBottom: '4px' }}>{activeSessions.length}</p>
            <p style={{ fontSize: '14px', color: '#64748B' }}>Active Sessions</p>
          </div>
          <div style={statCardStyle}>
            <p style={{ fontSize: '32px', fontWeight: '700', color: '#EF4444', marginBottom: '4px' }}>{flaggedExams.length}</p>
            <p style={{ fontSize: '14px', color: '#64748B' }}>Flagged Exams</p>
          </div>
          <div style={statCardStyle}>
            <p style={{ fontSize: '32px', fontWeight: '700', color: '#F59E0B', marginBottom: '4px' }}>{stats?.pendingReview || 0}</p>
            <p style={{ fontSize: '14px', color: '#64748B' }}>Pending Review</p>
          </div>
          <div style={statCardStyle}>
            <p style={{ fontSize: '32px', fontWeight: '700', color: '#10B981', marginBottom: '4px' }}>{stats?.totalLogs || 0}</p>
            <p style={{ fontSize: '14px', color: '#64748B' }}>Total Events</p>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={tabContainerStyle}>
            <button onClick={() => setActiveTab('overview')} style={tabStyle(activeTab === 'overview')}>
              Overview
            </button>
            <button onClick={() => setActiveTab('active')} style={tabStyle(activeTab === 'active')}>
              Active Sessions ({activeSessions.length})
            </button>
            <button onClick={() => setActiveTab('flagged')} style={tabStyle(activeTab === 'flagged')}>
              Flagged Exams ({flaggedExams.length})
            </button>
          </div>

          <div style={{ padding: '24px' }}>
            {activeTab === 'overview' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B', marginBottom: '16px' }}>Event Types</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {stats?.eventTypeStats?.map((stat) => (
                      <div key={stat._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                        <span style={{ fontSize: '14px', color: '#475569', textTransform: 'capitalize' }}>{stat._id?.replace(/_/g, ' ')}</span>
                        <span style={{ padding: '4px 12px', backgroundColor: '#E2E8F0', color: '#475569', fontSize: '13px', fontWeight: '500', borderRadius: '6px' }}>{stat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B', marginBottom: '16px' }}>By Severity</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {stats?.severityStats?.map((stat) => {
                      const sevStyle = getSeverityStyle(stat._id);
                      return (
                        <div key={stat._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                          <span style={{ fontSize: '14px', color: '#475569', textTransform: 'capitalize' }}>{stat._id}</span>
                          <span style={{ padding: '4px 12px', backgroundColor: sevStyle.bg, color: sevStyle.text, fontSize: '13px', fontWeight: '500', borderRadius: '6px' }}>{stat.count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B', marginBottom: '16px' }}>Recent Events</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {stats?.recentLogs?.slice(0, 5).map((log) => {
                      const sevStyle = getSeverityStyle(log.severity);
                      return (
                        <div key={log._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span style={{ padding: '4px 10px', backgroundColor: sevStyle.bg, color: sevStyle.text, fontSize: '12px', fontWeight: '500', borderRadius: '6px', textTransform: 'capitalize' }}>{log.severity}</span>
                            <div>
                              <p style={{ fontSize: '14px', fontWeight: '500', color: '#1E293B', textTransform: 'capitalize' }}>{log.eventType?.replace(/_/g, ' ')}</p>
                              <p style={{ fontSize: '13px', color: '#64748B' }}>{log.student?.firstName} {log.student?.lastName}</p>
                            </div>
                          </div>
                          <span style={{ fontSize: '13px', color: '#64748B' }}>
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'active' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {activeSessions.length > 0 ? (
                  activeSessions.map((session) => (
                    <div key={session._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ position: 'relative' }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            fontSize: '18px',
                            fontWeight: '600'
                          }}>
                            {session.student?.firstName?.charAt(0)}
                          </div>
                          <span style={{
                            position: 'absolute',
                            bottom: '-2px',
                            right: '-2px',
                            width: '14px',
                            height: '14px',
                            backgroundColor: '#10B981',
                            borderRadius: '50%',
                            border: '2px solid #F8FAFC'
                          }}></span>
                        </div>
                        <div>
                          <p style={{ fontWeight: '600', color: '#1E293B', marginBottom: '4px' }}>{session.student?.firstName} {session.student?.lastName}</p>
                          <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '2px' }}>{session.exam?.title}</p>
                          <p style={{ fontSize: '12px', color: '#94A3B8' }}>Started {new Date(session.startedAt).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '14px', marginBottom: '4px' }}>
                            <span style={{ color: '#F59E0B', fontWeight: '600' }}>{session.flagCount || 0}</span>
                            <span style={{ color: '#64748B' }}> flags</span>
                          </p>
                          <p style={{ fontSize: '12px', color: '#94A3B8' }}>{session.exam?.duration} min duration</p>
                        </div>
                        <button
                          onClick={() => handleTerminateExam(session._id)}
                          style={{
                            padding: '10px 16px',
                            backgroundColor: '#FEE2E2',
                            color: '#DC2626',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: '500',
                            cursor: 'pointer'
                          }}
                        >
                          Terminate
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px', color: '#64748B' }}>
                    <svg style={{ width: '64px', height: '64px', margin: '0 auto 16px', opacity: 0.5 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p>No active exam sessions</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'flagged' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {flaggedExams.length > 0 ? (
                  flaggedExams.map((result) => (
                    <div key={result._id} style={{ padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            backgroundColor: '#FEE2E2',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <svg style={{ width: '20px', height: '20px', color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                          <div>
                            <p style={{ fontWeight: '600', color: '#1E293B' }}>{result.student?.firstName} {result.student?.lastName}</p>
                            <p style={{ fontSize: '13px', color: '#64748B' }}>{result.exam?.title}</p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ display: 'inline-block', padding: '4px 10px', backgroundColor: '#FEE2E2', color: '#DC2626', fontSize: '12px', fontWeight: '500', borderRadius: '6px' }}>
                            {result.proctoringFlags?.length} flags
                          </span>
                          <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>
                            {new Date(result.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {result.proctoringFlags?.slice(0, 3).map((flag, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: '#FFFFFF', borderRadius: '6px', fontSize: '13px' }}>
                            <span style={{ color: '#F59E0B' }}>⚠</span>
                            <span style={{ color: '#475569', textTransform: 'capitalize' }}>{flag.type?.replace(/_/g, ' ')}</span>
                            <span style={{ marginLeft: 'auto', color: '#94A3B8', fontSize: '12px' }}>
                              {new Date(flag.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        ))}
                        {result.proctoringFlags?.length > 3 && (
                          <p style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', paddingTop: '4px' }}>
                            +{result.proctoringFlags.length - 3} more flags
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '48px', color: '#64748B' }}>
                    <svg style={{ width: '64px', height: '64px', margin: '0 auto 16px', opacity: 0.5 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No flagged exams</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Proctoring;
