import { useState, useEffect } from 'react';
import Layout from '../../Components/Layout';
import api from '../../Services/api';
import { toast } from 'react-toastify';

const FlaggedExams = () => {
  const [flaggedExams, setFlaggedExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchFlaggedExams();
  }, []);

  const fetchFlaggedExams = async () => {
    try {
      const response = await api.get('/proctoring/flagged');
      setFlaggedExams(response.data || []);
    } catch (error) {
      console.error('Failed to fetch flagged exams:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewComplete = async (resultId, action) => {
    try {
      await api.put(`/proctoring/review/${resultId}`, { action, reviewNotes: '' });
      toast.success('Review completed');
      fetchFlaggedExams();
    } catch (error) {
      toast.error('Failed to complete review');
    }
  };

  const getSeverityStyle = (severity) => {
    const styles = {
      low: { bg: '#DBEAFE', text: '#1D4ED8', label: 'Low' },
      medium: { bg: '#FEF3C7', text: '#D97706', label: 'Medium' },
      high: { bg: '#FED7AA', text: '#EA580C', label: 'High' },
      critical: { bg: '#FEE2E2', text: '#DC2626', label: 'Critical' }
    };
    return styles[severity] || styles.low;
  };

  const filteredExams = filter === 'all'
    ? flaggedExams
    : flaggedExams.filter(exam => exam.severity === filter);

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

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0',
    marginBottom: '16px'
  };

  const cardHeaderStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '16px'
  };

  const studentInfoStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const avatarStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: '#F1F5F9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: '600',
    color: '#475569'
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

  const flagsContainerStyle = {
    backgroundColor: '#F8FAFC',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px'
  };

  const flagItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '8px 0',
    borderBottom: '1px solid #E2E8F0'
  };

  const actionsContainerStyle = {
    display: 'flex',
    gap: '12px'
  };

  const actionBtnStyle = (type) => {
    const styles = {
      approve: { bg: '#D1FAE5', color: '#059669' },
      reject: { bg: '#FEE2E2', color: '#DC2626' }
    };
    const s = styles[type] || styles.approve;
    return {
      flex: 1,
      padding: '12px',
      backgroundColor: s.bg,
      color: s.color,
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
    borderTop: '4px solid #EF4444',
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
          <h1 style={titleStyle}>Flagged Exams</h1>
          <p style={subtitleStyle}>Review exams that have been flagged for suspicious activity</p>
        </div>

        <div style={filterContainerStyle}>
          {['all', 'critical', 'high', 'medium', 'low'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={filterBtnStyle(filter === f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {filteredExams.length > 0 ? (
          <div>
            {filteredExams.map((exam) => {
              const severityStyle = getSeverityStyle(exam.severity);
              return (
                <div key={exam._id} style={cardStyle}>
                  <div style={cardHeaderStyle}>
                    <div style={studentInfoStyle}>
                      <div style={avatarStyle}>
                        {exam.student?.firstName?.charAt(0)}
                      </div>
                      <div>
                        <p style={studentNameStyle}>
                          {exam.student?.firstName} {exam.student?.lastName}
                        </p>
                        <p style={examTitleStyle}>{exam.exam?.title}</p>
                      </div>
                    </div>
                    <span style={{
                      display: 'inline-block',
                      padding: '6px 12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: severityStyle.bg,
                      color: severityStyle.text,
                      borderRadius: '8px'
                    }}>
                      {severityStyle.label}
                    </span>
                  </div>

                  <div style={flagsContainerStyle}>
                    <p style={{ fontSize: '13px', fontWeight: '600', color: '#475569', marginBottom: '12px' }}>
                      Flags ({exam.flags?.length || 0})
                    </p>
                    {exam.flags?.slice(0, 5).map((flag, idx) => (
                      <div key={idx} style={flagItemStyle}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: getSeverityStyle(flag.severity).text
                        }}></div>
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '13px', fontWeight: '500', color: '#1E293B', textTransform: 'capitalize' }}>
                            {flag.eventType?.replace(/_/g, ' ')}
                          </p>
                          <p style={{ fontSize: '12px', color: '#64748B' }}>
                            {new Date(flag.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={actionsContainerStyle}>
                    <button
                      onClick={() => handleReviewComplete(exam._id, 'approve')}
                      style={actionBtnStyle('approve')}
                    >
                      <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Approve
                    </button>
                    <button
                      onClick={() => handleReviewComplete(exam._id, 'reject')}
                      style={actionBtnStyle('reject')}
                    >
                      <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Invalidate
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={emptyStateStyle}>
            <svg style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: '#CBD5E1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1E293B', marginBottom: '8px' }}>No Flagged Exams</h3>
            <p style={{ fontSize: '14px', color: '#64748B' }}>All exams are clear of suspicious activity</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FlaggedExams;
