import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout';
import api from '../Services/api';
import { useAuth } from '../Context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, enrolledRes, resultsRes] = await Promise.all([
        api.get('/results/my-analytics'),
        api.get('/exams/enrolled'),
        api.get('/results/my-results?limit=5')
      ]);

      setStats(analyticsRes.data);
      setUpcomingExams(enrolledRes.data.filter(e => new Date(e.scheduledDate) >= new Date()));
      setRecentResults(resultsRes.data.results || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
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

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
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

  const statHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px'
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

  const badgeStyle = (type) => {
    const colors = {
      info: { bg: '#DBEAFE', text: '#1D4ED8' },
      success: { bg: '#D1FAE5', text: '#059669' },
      warning: { bg: '#FEF3C7', text: '#D97706' },
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

  const statValueStyle = {
    fontSize: '32px',
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: '4px'
  };

  const statLabelStyle = {
    fontSize: '14px',
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
    color: '#1E293B'
  };

  const linkStyle = {
    fontSize: '14px',
    color: '#2563EB',
    textDecoration: 'none',
    fontWeight: '500'
  };

  const examItemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: '#F8FAFC',
    borderRadius: '12px',
    marginBottom: '12px'
  };

  const examTitleStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: '4px'
  };

  const examDateStyle = {
    fontSize: '13px',
    color: '#64748B'
  };

  const takeExamBtnStyle = {
    padding: '8px 16px',
    backgroundColor: '#EFF6FF',
    color: '#2563EB',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'all 0.2s ease'
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '40px 20px'
  };

  const emptyIconStyle = {
    width: '48px',
    height: '48px',
    margin: '0 auto 16px',
    color: '#CBD5E1'
  };

  const emptyTextStyle = {
    fontSize: '14px',
    color: '#64748B',
    marginBottom: '8px'
  };

  const resultItemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: '#F8FAFC',
    borderRadius: '12px',
    marginBottom: '12px'
  };

  const scoreStyle = (passed) => ({
    fontSize: '18px',
    fontWeight: '700',
    color: passed ? '#10B981' : '#EF4444'
  });

  const resultBadgeStyle = (passed) => ({
    display: 'inline-block',
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: passed ? '#D1FAE5' : '#FEE2E2',
    color: passed ? '#059669' : '#DC2626',
    borderRadius: '6px',
    marginTop: '4px'
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
          <h1 style={titleStyle}>Welcome back, {user?.firstName}!</h1>
          <p style={subtitleStyle}>Here's your assessment overview</p>
        </div>

        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={statHeaderStyle}>
              <div style={iconBoxStyle('#2563EB')}>
                <svg style={{ width: '24px', height: '24px', color: '#2563EB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span style={badgeStyle('info')}>Total</span>
            </div>
            <p style={statValueStyle}>{stats?.totalExams || 0}</p>
            <p style={statLabelStyle}>Exams Taken</p>
          </div>

          <div style={statCardStyle}>
            <div style={statHeaderStyle}>
              <div style={iconBoxStyle('#10B981')}>
                <svg style={{ width: '24px', height: '24px', color: '#10B981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span style={badgeStyle('success')}>Passed</span>
            </div>
            <p style={statValueStyle}>{stats?.passedExams || 0}</p>
            <p style={statLabelStyle}>Exams Passed</p>
          </div>

          <div style={statCardStyle}>
            <div style={statHeaderStyle}>
              <div style={iconBoxStyle('#F59E0B')}>
                <svg style={{ width: '24px', height: '24px', color: '#F59E0B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span style={badgeStyle('warning')}>Average</span>
            </div>
            <p style={statValueStyle}>{stats?.avgPercentage || 0}%</p>
            <p style={statLabelStyle}>Average Score</p>
          </div>

          <div style={statCardStyle}>
            <div style={statHeaderStyle}>
              <div style={iconBoxStyle('#8B5CF6')}>
                <svg style={{ width: '24px', height: '24px', color: '#8B5CF6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span style={badgeStyle('neutral')}>Upcoming</span>
            </div>
            <p style={statValueStyle}>{upcomingExams.length}</p>
            <p style={statLabelStyle}>Scheduled Exams</p>
          </div>
        </div>

        <div style={sectionGridStyle}>
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h2 style={cardTitleStyle}>Upcoming Exams</h2>
              <Link to="/exams" style={linkStyle}>View All</Link>
            </div>
            {upcomingExams.length > 0 ? (
              <div>
                {upcomingExams.slice(0, 4).map((exam) => (
                  <div key={exam._id} style={examItemStyle}>
                    <div>
                      <h3 style={examTitleStyle}>{exam.title}</h3>
                      <p style={examDateStyle}>
                        {new Date(exam.scheduledDate).toLocaleDateString()} at {exam.startTime}
                      </p>
                    </div>
                    <Link to={`/exam/${exam._id}/start`} style={takeExamBtnStyle}>
                      Take Exam
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div style={emptyStateStyle}>
                <svg style={emptyIconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p style={emptyTextStyle}>No upcoming exams</p>
                <Link to="/exams" style={linkStyle}>Browse available exams</Link>
              </div>
            )}
          </div>

          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h2 style={cardTitleStyle}>Recent Results</h2>
              <Link to="/results" style={linkStyle}>View All</Link>
            </div>
            {recentResults.length > 0 ? (
              <div>
                {recentResults.map((result) => (
                  <div key={result._id} style={resultItemStyle}>
                    <div>
                      <h3 style={examTitleStyle}>{result.exam?.title}</h3>
                      <p style={examDateStyle}>
                        {new Date(result.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={scoreStyle(result.isPassed)}>
                        {result.percentage?.toFixed(1)}%
                      </p>
                      <span style={resultBadgeStyle(result.isPassed)}>
                        {result.isPassed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={emptyStateStyle}>
                <svg style={emptyIconStyle} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p style={emptyTextStyle}>No results yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
