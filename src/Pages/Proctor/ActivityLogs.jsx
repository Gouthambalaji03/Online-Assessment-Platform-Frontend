import { useState, useEffect } from 'react';
import Layout from '../../Components/Layout';
import api from '../../Services/api';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, [page, filter]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const severity = filter !== 'all' ? `&severity=${filter}` : '';
      const response = await api.get(`/proctoring/logs?page=${page}&limit=20${severity}`);
      setLogs(response.data.logs || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityStyle = (severity) => {
    const styles = {
      low: { bg: '#DBEAFE', text: '#1D4ED8', dot: '#3B82F6' },
      medium: { bg: '#FEF3C7', text: '#D97706', dot: '#F59E0B' },
      high: { bg: '#FED7AA', text: '#EA580C', dot: '#F97316' },
      critical: { bg: '#FEE2E2', text: '#DC2626', dot: '#EF4444' }
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

  const filterContainerStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  };

  const filterBtnStyle = (isActive) => ({
    padding: '10px 20px',
    backgroundColor: isActive ? '#2563EB' : '#FFFFFF',
    color: isActive ? '#FFFFFF' : '#64748B',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  });

  const tableContainerStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0',
    overflow: 'hidden'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const thStyle = {
    padding: '16px 20px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    backgroundColor: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0'
  };

  const tdStyle = {
    padding: '16px 20px',
    fontSize: '14px',
    color: '#1E293B',
    borderBottom: '1px solid #F1F5F9'
  };

  const paginationStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '24px'
  };

  const pageBtnStyle = (isActive, isDisabled) => ({
    padding: '10px 16px',
    backgroundColor: isActive ? '#2563EB' : '#FFFFFF',
    color: isActive ? '#FFFFFF' : isDisabled ? '#CBD5E1' : '#64748B',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease'
  });

  const emptyStateStyle = {
    padding: '64px 24px',
    textAlign: 'center'
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
    borderTop: '4px solid #2563EB',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  if (loading && logs.length === 0) {
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
          <h1 style={titleStyle}>Activity Logs</h1>
          <p style={subtitleStyle}>Complete history of proctoring events and activities</p>
        </div>

        <div style={filterContainerStyle}>
          {['all', 'critical', 'high', 'medium', 'low'].map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              style={filterBtnStyle(filter === f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div style={tableContainerStyle}>
          {logs.length > 0 ? (
            <>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th style={thStyle}>Event</th>
                    <th style={thStyle}>Student</th>
                    <th style={thStyle}>Exam</th>
                    <th style={thStyle}>Severity</th>
                    <th style={thStyle}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => {
                    const severityStyle = getSeverityStyle(log.severity);
                    return (
                      <tr key={log._id}>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: severityStyle.dot
                            }}></div>
                            <span style={{ textTransform: 'capitalize' }}>
                              {log.eventType?.replace(/_/g, ' ')}
                            </span>
                          </div>
                        </td>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: '#F1F5F9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '12px',
                              fontWeight: '600',
                              color: '#475569'
                            }}>
                              {log.student?.firstName?.charAt(0)}
                            </div>
                            <span>{log.student?.firstName} {log.student?.lastName}</span>
                          </div>
                        </td>
                        <td style={{ ...tdStyle, color: '#64748B' }}>
                          {log.exam?.title || '-'}
                        </td>
                        <td style={tdStyle}>
                          <span style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            fontSize: '12px',
                            fontWeight: '500',
                            backgroundColor: severityStyle.bg,
                            color: severityStyle.text,
                            borderRadius: '6px',
                            textTransform: 'capitalize'
                          }}>
                            {log.severity}
                          </span>
                        </td>
                        <td style={{ ...tdStyle, color: '#64748B' }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div style={paginationStyle}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  style={pageBtnStyle(false, page === 1)}
                >
                  Previous
                </button>
                <span style={{ padding: '0 16px', color: '#64748B', fontSize: '14px' }}>
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  style={pageBtnStyle(false, page === totalPages)}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div style={emptyStateStyle}>
              <svg style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: '#CBD5E1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1E293B', marginBottom: '8px' }}>No Activity Logs</h3>
              <p style={{ fontSize: '14px', color: '#64748B' }}>No proctoring events have been recorded yet</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ActivityLogs;
