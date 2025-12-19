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

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Comprehensive platform analytics and insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold">{dashboardStats?.totalResults || 0}</p>
            <p className="text-gray-400 text-sm">Total Submissions</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold">{dashboardStats?.passedResults || 0}</p>
            <p className="text-gray-400 text-sm">Passed</p>
            <p className="text-xs text-green-400 mt-1">{dashboardStats?.passPercentage || 0}% pass rate</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold">{dashboardStats?.failedResults || 0}</p>
            <p className="text-gray-400 text-sm">Failed</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold">{dashboardStats?.avgScore || 0}%</p>
            <p className="text-gray-400 text-sm">Average Score</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-6">Exam Status Distribution</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Active</span>
                </div>
                <span className="font-bold">{examStats?.activeExams || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Scheduled</span>
                </div>
                <span className="font-bold">{examStats?.scheduledExams || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>Completed</span>
                </div>
                <span className="font-bold">{examStats?.completedExams || 0}</span>
              </div>
            </div>
            <div className="mt-6 h-4 bg-slate-800 rounded-full overflow-hidden flex">
              {examStats?.totalExams > 0 && (
                <>
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${(examStats?.activeExams / examStats?.totalExams) * 100}%` }}
                  ></div>
                  <div 
                    className="h-full bg-blue-500" 
                    style={{ width: `${(examStats?.scheduledExams / examStats?.totalExams) * 100}%` }}
                  ></div>
                  <div 
                    className="h-full bg-purple-500" 
                    style={{ width: `${(examStats?.completedExams / examStats?.totalExams) * 100}%` }}
                  ></div>
                </>
              )}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-xl font-semibold mb-6">Exams by Category</h2>
            <div className="space-y-3">
              {examStats?.categoryStats?.map((stat, idx) => (
                <div key={stat._id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#ef4444'][idx % 5] }}
                    ></div>
                    <span>{stat._id}</span>
                  </div>
                  <span className="badge bg-slate-700">{stat.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="glass-card p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Monthly Trends</h2>
          <div className="grid md:grid-cols-6 gap-4">
            {dashboardStats?.monthlyTrend?.reverse().map((month) => (
              <div key={`${month._id.year}-${month._id.month}`} className="text-center p-4 bg-slate-800/50 rounded-lg">
                <p className="text-2xl font-bold text-orange-400">{month.count}</p>
                <p className="text-sm text-gray-400">
                  {new Date(2024, month._id.month - 1).toLocaleString('default', { month: 'short' })}
                </p>
                <p className="text-xs text-gray-500">{month.avgScore?.toFixed(0)}% avg</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="text-xl font-semibold mb-6">Recent Results</h2>
          <div className="space-y-3">
            {dashboardStats?.recentResults?.map((result) => (
              <div key={result._id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    {result.student?.firstName?.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium">{result.student?.firstName} {result.student?.lastName}</p>
                    <p className="text-sm text-gray-400">{result.exam?.title}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className={`text-lg font-bold ${result.isPassed ? 'text-green-400' : 'text-red-400'}`}>
                      {result.percentage?.toFixed(0)}%
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(result.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`badge ${result.isPassed ? 'badge-success' : 'badge-danger'}`}>
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

