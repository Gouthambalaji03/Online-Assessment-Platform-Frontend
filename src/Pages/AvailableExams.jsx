import { useState, useEffect } from 'react';
import Layout from '../Components/Layout';
import api from '../Services/api';
import { toast } from 'react-toastify';

const AvailableExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await api.get('/exams/available');
      setExams(response.data.exams || []);
    } catch (error) {
      toast.error('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (examId) => {
    setEnrolling(examId);
    try {
      await api.post(`/exams/${examId}/enroll`);
      toast.success('Successfully enrolled in exam!');
      fetchExams();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setEnrolling(null);
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
    marginBottom: '8px'
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: '#64748B'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px'
  };

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0',
    transition: 'all 0.2s ease'
  };

  const cardHeaderStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '16px'
  };

  const iconBoxStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const badgeStyle = {
    display: 'inline-block',
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: '#FEF3C7',
    color: '#D97706',
    borderRadius: '6px'
  };

  const examTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: '8px'
  };

  const examDescStyle = {
    fontSize: '14px',
    color: '#64748B',
    marginBottom: '16px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  };

  const detailsContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginBottom: '20px'
  };

  const detailItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    color: '#64748B'
  };

  const enrollBtnStyle = {
    width: '100%',
    padding: '12px 20px',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
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

  const enrollBtnDisabledStyle = {
    ...enrollBtnStyle,
    backgroundColor: '#94A3B8',
    cursor: 'not-allowed'
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
          <h1 style={titleStyle}>Available Exams</h1>
          <p style={subtitleStyle}>Browse and enroll in upcoming assessments</p>
        </div>

        {exams.length > 0 ? (
          <div style={gridStyle}>
            {exams.map((exam) => (
              <div key={exam._id} style={cardStyle}>
                <div style={cardHeaderStyle}>
                  <div style={iconBoxStyle}>
                    <svg style={{ width: '24px', height: '24px', color: '#2563EB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  {exam.isProctored && (
                    <span style={badgeStyle}>Proctored</span>
                  )}
                </div>

                <h3 style={examTitleStyle}>{exam.title}</h3>
                <p style={examDescStyle}>{exam.description || 'No description available'}</p>

                <div style={detailsContainerStyle}>
                  <div style={detailItemStyle}>
                    <svg style={{ width: '16px', height: '16px', color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(exam.scheduledDate).toLocaleDateString()}</span>
                  </div>
                  <div style={detailItemStyle}>
                    <svg style={{ width: '16px', height: '16px', color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{exam.duration} minutes</span>
                  </div>
                  <div style={detailItemStyle}>
                    <svg style={{ width: '16px', height: '16px', color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <span>{exam.totalMarks} marks</span>
                  </div>
                </div>

                <button
                  onClick={() => handleEnroll(exam._id)}
                  disabled={enrolling === exam._id}
                  style={enrolling === exam._id ? enrollBtnDisabledStyle : enrollBtnStyle}
                >
                  {enrolling === exam._id ? (
                    <>
                      <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid #FFFFFF', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                      Enrolling...
                    </>
                  ) : (
                    <>
                      Enroll Now
                      <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div style={emptyStateStyle}>
            <svg style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: '#CBD5E1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1E293B', marginBottom: '8px' }}>No Exams Available</h3>
            <p style={{ fontSize: '14px', color: '#64748B' }}>Check back later for upcoming assessments</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AvailableExams;
