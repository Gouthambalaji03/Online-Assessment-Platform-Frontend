import { useState, useEffect } from 'react';
import Layout from '../../Components/Layout';
import api from '../../Services/api';

const Analytics = () => {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [examStats, setExamStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [dashboard, exams] = await Promise.all([
        api.get('/results/dashboard'),
        api.get('/exams/stats')
      ]);
      setDashboardStats(dashboard.data);
      setExamStats(exams.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
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

  const statIconStyle = (color) => ({
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: `${color}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px'
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

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0'
  };

  const cardTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: '20px'
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

  const categoryColors = ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'];

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
          <h1 style={titleStyle}>Analytics Dashboard</h1>
          <p style={subtitleStyle}>Comprehensive platform analytics and insights</p>
        </div>

        <div style={statsGridStyle}>
          <div style={statCardStyle}>
            <div style={statIconStyle('#2563EB')}>
              <svg style={{ width: '24px', height: '24px', color: '#2563EB' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p style={statValueStyle}>{dashboardStats?.totalResults || 0}</p>
            <p style={statLabelStyle}>Total Submissions</p>
          </div>

          <div style={statCardStyle}>
            <div style={statIconStyle('#10B981')}>
              <svg style={{ width: '24px', height: '24px', color: '#10B981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p style={statValueStyle}>{dashboardStats?.passedResults || 0}</p>
            <p style={statLabelStyle}>Passed</p>
            <p style={{ fontSize: '12px', color: '#10B981', marginTop: '4px' }}>{dashboardStats?.passPercentage || 0}% pass rate</p>
          </div>

          <div style={statCardStyle}>
            <div style={statIconStyle('#EF4444')}>
              <svg style={{ width: '24px', height: '24px', color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p style={statValueStyle}>{dashboardStats?.failedResults || 0}</p>
            <p style={statLabelStyle}>Failed</p>
          </div>

          <div style={statCardStyle}>
            <div style={statIconStyle('#F59E0B')}>
              <svg style={{ width: '24px', height: '24px', color: '#F59E0B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p style={statValueStyle}>{dashboardStats?.avgScore || 0}%</p>
            <p style={statLabelStyle}>Average Score</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px', marginBottom: '32px' }}>
          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>Exam Status Distribution</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#10B981' }}></div>
                  <span style={{ fontSize: '14px', color: '#475569' }}>Active</span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B' }}>{examStats?.activeExams || 0}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2563EB' }}></div>
                  <span style={{ fontSize: '14px', color: '#475569' }}>Scheduled</span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B' }}>{examStats?.scheduledExams || 0}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#8B5CF6' }}></div>
                  <span style={{ fontSize: '14px', color: '#475569' }}>Completed</span>
                </div>
                <span style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B' }}>{examStats?.completedExams || 0}</span>
              </div>
            </div>
            {examStats?.totalExams > 0 && (
              <div style={{ marginTop: '20px', height: '8px', backgroundColor: '#E2E8F0', borderRadius: '4px', overflow: 'hidden', display: 'flex' }}>
                <div style={{ height: '100%', backgroundColor: '#10B981', width: `${(examStats?.activeExams / examStats?.totalExams) * 100}%` }}></div>
                <div style={{ height: '100%', backgroundColor: '#2563EB', width: `${(examStats?.scheduledExams / examStats?.totalExams) * 100}%` }}></div>
                <div style={{ height: '100%', backgroundColor: '#8B5CF6', width: `${(examStats?.completedExams / examStats?.totalExams) * 100}%` }}></div>
              </div>
            )}
          </div>

          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>Exams by Category</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {examStats?.categoryStats?.map((stat, idx) => (
                <div key={stat._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', backgroundColor: '#F8FAFC', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: categoryColors[idx % 5] }}></div>
                    <span style={{ fontSize: '14px', color: '#475569' }}>{stat._id}</span>
                  </div>
                  <span style={{ display: 'inline-block', padding: '4px 12px', backgroundColor: '#E2E8F0', color: '#475569', fontSize: '13px', fontWeight: '500', borderRadius: '6px' }}>{stat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ ...cardStyle, marginBottom: '32px' }}>
          <h2 style={cardTitleStyle}>Monthly Trends</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
            {dashboardStats?.monthlyTrend?.reverse().map((month) => (
              <div key={`${month._id.year}-${month._id.month}`} style={{ textAlign: 'center', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
                <p style={{ fontSize: '24px', fontWeight: '700', color: '#2563EB' }}>{month.count}</p>
                <p style={{ fontSize: '13px', color: '#64748B', marginBottom: '4px' }}>
                  {new Date(2024, month._id.month - 1).toLocaleString('default', { month: 'short' })}
                </p>
                <p style={{ fontSize: '12px', color: '#94A3B8' }}>{month.avgScore?.toFixed(0)}% avg</p>
              </div>
            ))}
          </div>
        </div>

        <div style={cardStyle}>
          <h2 style={cardTitleStyle}>Recent Results</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {dashboardStats?.recentResults?.map((result) => (
              <div key={result._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    {result.student?.firstName?.charAt(0)}
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', color: '#1E293B', marginBottom: '2px' }}>{result.student?.firstName} {result.student?.lastName}</p>
                    <p style={{ fontSize: '13px', color: '#64748B' }}>{result.exam?.title}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '18px', fontWeight: '700', color: result.isPassed ? '#10B981' : '#EF4444' }}>
                      {result.percentage?.toFixed(0)}%
                    </p>
                    <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                      {new Date(result.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span style={{
                    display: 'inline-block',
                    padding: '6px 12px',
                    fontSize: '12px',
                    fontWeight: '500',
                    backgroundColor: result.isPassed ? '#D1FAE5' : '#FEE2E2',
                    color: result.isPassed ? '#059669' : '#DC2626',
                    borderRadius: '6px'
                  }}>
                    {result.isPassed ? 'Pass' : 'Fail'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
