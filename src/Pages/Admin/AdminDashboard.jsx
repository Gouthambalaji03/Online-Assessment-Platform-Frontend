import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../Components/Layout';
import api from '../../Services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [examStats, setExamStats] = useState(null);
  const [questionStats, setQuestionStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [resultStats, exams, questions] = await Promise.all([
        api.get('/results/dashboard'),
        api.get('/exams/stats'),
        api.get('/questions/stats')
      ]);
      setStats(resultStats.data);
      setExamStats(exams.data);
      setQuestionStats(questions.data);
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
    alignItems: 'flex-start',
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

  const statMetaStyle = {
    display: 'flex',
    gap: '12px',
    marginTop: '8px',
    fontSize: '12px'
  };

  const sectionGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '24px',
    marginBottom: '24px'
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

  const quickActionsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  };

  const actionCardStyle = {
    backgroundColor: '#F8FAFC',
    borderRadius: '12px',
    padding: '20px',
    textAlign: 'center',
    textDecoration: 'none',
    border: '1px solid #E2E8F0',
    transition: 'all 0.2s ease',
    cursor: 'pointer'
  };

  const actionIconStyle = (color) => ({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: `${color}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px'
  });

  const actionLabelStyle = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1E293B'
  };

  const submissionItemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    backgroundColor: '#F8FAFC',
    borderRadius: '10px',
    marginBottom: '8px'
  };

  const avatarStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    backgroundColor: '#E2E8F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569'
  };

  const badgeStyle = (type) => {
    const colors = {
      success: { bg: '#D1FAE5', text: '#059669' },
      danger: { bg: '#FEE2E2', text: '#DC2626' },
      warning: { bg: '#FEF3C7', text: '#D97706' },
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

  const overviewGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px'
  };

  const overviewSectionStyle = {
    padding: '0'
  };

  const overviewTitleStyle = {
    fontSize: '13px',
    color: '#64748B',
    marginBottom: '12px',
    fontWeight: '500'
  };

  const overviewItemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid #F1F5F9'
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
          <h1 style={titleStyle}>Admin Dashboard</h1>
          <p style={subtitleStyle}>Overview of your assessment platform</p>
        </div>

        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={statHeaderStyle}>
              <div style={iconBoxStyle('#2563EB')}>
                <svg style={{ width: '24px', height: '24px', color: '#2563EB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p style={statValueStyle}>{examStats?.totalExams || 0}</p>
            <p style={statLabelStyle}>Total Exams</p>
            <div style={statMetaStyle}>
              <span style={{ color: '#10B981' }}>{examStats?.activeExams || 0} active</span>
              <span style={{ color: '#F59E0B' }}>{examStats?.scheduledExams || 0} scheduled</span>
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={statHeaderStyle}>
              <div style={iconBoxStyle('#8B5CF6')}>
                <svg style={{ width: '24px', height: '24px', color: '#8B5CF6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p style={statValueStyle}>{questionStats?.totalQuestions || 0}</p>
            <p style={statLabelStyle}>Questions in Bank</p>
          </div>

          <div style={statCardStyle}>
            <div style={statHeaderStyle}>
              <div style={iconBoxStyle('#10B981')}>
                <svg style={{ width: '24px', height: '24px', color: '#10B981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p style={statValueStyle}>{stats?.totalResults || 0}</p>
            <p style={statLabelStyle}>Total Submissions</p>
            <div style={statMetaStyle}>
              <span style={{ color: '#10B981' }}>{stats?.passPercentage || 0}% pass rate</span>
            </div>
          </div>

          <div style={statCardStyle}>
            <div style={statHeaderStyle}>
              <div style={iconBoxStyle('#F59E0B')}>
                <svg style={{ width: '24px', height: '24px', color: '#F59E0B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p style={statValueStyle}>{stats?.avgScore || 0}%</p>
            <p style={statLabelStyle}>Average Score</p>
          </div>
        </div>

        <div style={sectionGridStyle}>
          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h2 style={cardTitleStyle}>Quick Actions</h2>
            </div>
            <div style={quickActionsGridStyle}>
              <Link to="/admin/exams/create" style={actionCardStyle}>
                <div style={actionIconStyle('#F59E0B')}>
                  <svg style={{ width: '24px', height: '24px', color: '#F59E0B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p style={actionLabelStyle}>Create Exam</p>
              </Link>
              <Link to="/admin/questions/create" style={actionCardStyle}>
                <div style={actionIconStyle('#8B5CF6')}>
                  <svg style={{ width: '24px', height: '24px', color: '#8B5CF6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p style={actionLabelStyle}>Add Question</p>
              </Link>
              <Link to="/admin/users" style={actionCardStyle}>
                <div style={actionIconStyle('#2563EB')}>
                  <svg style={{ width: '24px', height: '24px', color: '#2563EB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p style={actionLabelStyle}>Manage Users</p>
              </Link>
              <Link to="/admin/proctoring" style={actionCardStyle}>
                <div style={actionIconStyle('#10B981')}>
                  <svg style={{ width: '24px', height: '24px', color: '#10B981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <p style={actionLabelStyle}>Proctoring</p>
              </Link>
            </div>
          </div>

          <div style={cardStyle}>
            <div style={cardHeaderStyle}>
              <h2 style={cardTitleStyle}>Recent Submissions</h2>
              <Link to="/admin/analytics" style={linkStyle}>View All</Link>
            </div>
            {stats?.recentResults?.length > 0 ? (
              <div>
                {stats.recentResults.slice(0, 5).map((result) => (
                  <div key={result._id} style={submissionItemStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={avatarStyle}>
                        {result.student?.firstName?.charAt(0)}
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>
                          {result.student?.firstName} {result.student?.lastName}
                        </p>
                        <p style={{ fontSize: '12px', color: '#64748B' }}>{result.exam?.title}</p>
                      </div>
                    </div>
                    <span style={badgeStyle(result.isPassed ? 'success' : 'danger')}>
                      {result.percentage?.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: '#64748B', padding: '32px 0' }}>No recent submissions</p>
            )}
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <h2 style={cardTitleStyle}>Question Bank Overview</h2>
            <Link to="/admin/questions" style={linkStyle}>Manage Questions</Link>
          </div>
          <div style={overviewGridStyle}>
            <div style={overviewSectionStyle}>
              <h3 style={overviewTitleStyle}>By Difficulty</h3>
              <div>
                {questionStats?.difficultyStats?.map((stat) => (
                  <div key={stat._id} style={overviewItemStyle}>
                    <span style={{ fontSize: '14px', color: '#1E293B', textTransform: 'capitalize' }}>{stat._id}</span>
                    <span style={badgeStyle(
                      stat._id === 'easy' ? 'success' :
                      stat._id === 'medium' ? 'warning' : 'danger'
                    )}>{stat.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={overviewSectionStyle}>
              <h3 style={overviewTitleStyle}>By Type</h3>
              <div>
                {questionStats?.typeStats?.map((stat) => (
                  <div key={stat._id} style={overviewItemStyle}>
                    <span style={{ fontSize: '14px', color: '#1E293B', textTransform: 'capitalize' }}>
                      {stat._id === 'mcq' ? 'Multiple Choice' : stat._id === 'true_false' ? 'True/False' : stat._id}
                    </span>
                    <span style={badgeStyle('info')}>{stat.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={overviewSectionStyle}>
              <h3 style={overviewTitleStyle}>By Category</h3>
              <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                {questionStats?.categoryStats?.slice(0, 5).map((stat) => (
                  <div key={stat._id} style={overviewItemStyle}>
                    <span style={{ fontSize: '14px', color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stat._id}</span>
                    <span style={badgeStyle('neutral')}>{stat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
