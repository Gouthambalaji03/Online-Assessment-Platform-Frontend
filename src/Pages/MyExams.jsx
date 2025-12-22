import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout';
import api from '../Services/api';
import { toast } from 'react-toastify';

const MyExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledExams();
  }, []);

  const fetchEnrolledExams = async () => {
    try {
      const response = await api.get('/exams/enrolled');
      setExams(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch enrolled exams');
    } finally {
      setLoading(false);
    }
  };

  const getExamStatus = (exam) => {
    const now = new Date();
    const examDate = new Date(exam.scheduledDate);

    if (exam.status === 'completed') return { status: 'Completed', type: 'neutral' };
    if (examDate < now) return { status: 'Expired', type: 'danger' };
    if (exam.status === 'active') return { status: 'Active', type: 'success' };
    return { status: 'Upcoming', type: 'info' };
  };

  const getBadgeStyle = (type) => {
    const colors = {
      success: { bg: '#D1FAE5', text: '#059669' },
      danger: { bg: '#FEE2E2', text: '#DC2626' },
      info: { bg: '#DBEAFE', text: '#1D4ED8' },
      neutral: { bg: '#F1F5F9', text: '#475569' }
    };
    const c = colors[type] || colors.info;
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

  const examCardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0',
    marginBottom: '16px',
    transition: 'all 0.2s ease'
  };

  const examContentStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const examTopRowStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px'
  };

  const iconBoxStyle = {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  };

  const examInfoStyle = {
    flex: 1
  };

  const examTitleRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '6px',
    flexWrap: 'wrap'
  };

  const examTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1E293B'
  };

  const examDescStyle = {
    fontSize: '14px',
    color: '#64748B',
    marginBottom: '12px'
  };

  const metaContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px'
  };

  const metaItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: '#64748B'
  };

  const actionsContainerStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'flex-end',
    marginTop: '8px'
  };

  const primaryBtnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'all 0.2s ease'
  };

  const secondaryBtnStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: '#F1F5F9',
    color: '#475569',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
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
          <h1 style={titleStyle}>My Exams</h1>
          <p style={subtitleStyle}>View and manage your enrolled assessments</p>
        </div>

        {exams.length > 0 ? (
          <div>
            {exams.map((exam) => {
              const statusInfo = getExamStatus(exam);
              const isActive = statusInfo.status === 'Active' || statusInfo.status === 'Upcoming';

              return (
                <div key={exam._id} style={examCardStyle}>
                  <div style={examContentStyle}>
                    <div style={examTopRowStyle}>
                      <div style={iconBoxStyle}>
                        <svg style={{ width: '28px', height: '28px', color: '#2563EB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div style={examInfoStyle}>
                        <div style={examTitleRowStyle}>
                          <h3 style={examTitleStyle}>{exam.title}</h3>
                          <span style={getBadgeStyle(statusInfo.type)}>
                            {statusInfo.status}
                          </span>
                        </div>
                        <p style={examDescStyle}>{exam.description || 'No description'}</p>
                        <div style={metaContainerStyle}>
                          <div style={metaItemStyle}>
                            <svg style={{ width: '16px', height: '16px', color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(exam.scheduledDate).toLocaleDateString()}</span>
                          </div>
                          <div style={metaItemStyle}>
                            <svg style={{ width: '16px', height: '16px', color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{exam.startTime} - {exam.endTime}</span>
                          </div>
                          <div style={metaItemStyle}>
                            <svg style={{ width: '16px', height: '16px', color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{exam.duration} mins</span>
                          </div>
                          <div style={metaItemStyle}>
                            <svg style={{ width: '16px', height: '16px', color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{exam.totalMarks} marks</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div style={actionsContainerStyle}>
                      {isActive && (
                        <Link to={`/exam/${exam._id}/start`} style={primaryBtnStyle}>
                          Start Exam
                          <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      )}
                      <Link to={`/exam/${exam._id}/details`} style={secondaryBtnStyle}>
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={emptyStateStyle}>
            <svg style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: '#CBD5E1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1E293B', marginBottom: '8px' }}>No Enrolled Exams</h3>
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '20px' }}>You haven't enrolled in any exams yet</p>
            <Link to="/exams" style={primaryBtnStyle}>
              Browse Exams
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyExams;
