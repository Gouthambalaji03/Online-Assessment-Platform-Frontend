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

  const categoryColors = ['bg-primary', 'bg-success', 'bg-warning', 'bg-purple-500', 'bg-error'];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Analytics Dashboard</h1>
          <p className="text-sm text-text-muted">Comprehensive platform analytics and insights</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-text-primary mb-1">{dashboardStats?.totalResults || 0}</p>
            <p className="text-sm text-text-muted">Total Submissions</p>
          </div>

          <div className="card">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-text-primary mb-1">{dashboardStats?.passedResults || 0}</p>
            <p className="text-sm text-text-muted">Passed</p>
            <p className="text-xs text-success mt-1">{dashboardStats?.passPercentage || 0}% pass rate</p>
          </div>

          <div className="card">
            <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-text-primary mb-1">{dashboardStats?.failedResults || 0}</p>
            <p className="text-sm text-text-muted">Failed</p>
          </div>

          <div className="card">
            <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-text-primary mb-1">{dashboardStats?.avgScore || 0}%</p>
            <p className="text-sm text-text-muted">Average Score</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-lg font-semibold text-text-primary mb-5">Exam Status Distribution</h2>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-success"></div>
                  <span className="text-sm text-text-secondary">Active</span>
                </div>
                <span className="text-base font-semibold text-text-primary">{examStats?.activeExams || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <span className="text-sm text-text-secondary">Scheduled</span>
                </div>
                <span className="text-base font-semibold text-text-primary">{examStats?.scheduledExams || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm text-text-secondary">Completed</span>
                </div>
                <span className="text-base font-semibold text-text-primary">{examStats?.completedExams || 0}</span>
              </div>
            </div>
            {examStats?.totalExams > 0 && (
              <div className="mt-5 h-2 bg-border rounded overflow-hidden flex">
                <div className="h-full bg-success" style={{ width: `${(examStats?.activeExams / examStats?.totalExams) * 100}%` }}></div>
                <div className="h-full bg-primary" style={{ width: `${(examStats?.scheduledExams / examStats?.totalExams) * 100}%` }}></div>
                <div className="h-full bg-purple-500" style={{ width: `${(examStats?.completedExams / examStats?.totalExams) * 100}%` }}></div>
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-text-primary mb-5">Exams by Category</h2>
            <div className="flex flex-col gap-2">
              {examStats?.categoryStats?.map((stat, idx) => (
                <div key={stat._id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${categoryColors[idx % 5]}`}></div>
                    <span className="text-sm text-text-secondary">{stat._id}</span>
                  </div>
                  <span className="py-1 px-3 bg-border text-text-secondary text-sm font-medium rounded-md">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-lg font-semibold text-text-primary mb-5">Monthly Trends</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {dashboardStats?.monthlyTrend?.reverse().map((month) => (
              <div key={`${month._id.year}-${month._id.month}`} className="text-center p-4 bg-surface rounded-xl">
                <p className="text-2xl font-bold text-primary">{month.count}</p>
                <p className="text-sm text-text-muted mb-1">
                  {new Date(2024, month._id.month - 1).toLocaleString('default', { month: 'short' })}
                </p>
                <p className="text-xs text-text-light">{Number(month.avgScore || 0).toFixed(0)}% avg</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-text-primary mb-5">Recent Results</h2>
          <div className="flex flex-col gap-3">
            {dashboardStats?.recentResults?.map((result) => (
              <div key={result._id} className="flex items-center justify-between p-4 bg-surface rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="avatar">
                    {result.student?.firstName?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{result.student?.firstName} {result.student?.lastName}</p>
                    <p className="text-sm text-text-muted">{result.exam?.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-lg font-bold ${result.isPassed ? 'text-success' : 'text-error'}`}>
                      {Number(result.percentage || 0).toFixed(0)}%
                    </p>
                    <p className="text-xs text-text-light">
                      {new Date(result.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`badge ${result.isPassed ? 'badge-success' : 'badge-error'}`}>
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
