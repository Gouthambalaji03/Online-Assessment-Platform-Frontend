import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../Components/Layout';
import api from '../../Services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [recentExams, setRecentExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [examsRes, resultsRes] = await Promise.all([
        api.get('/exams/stats'),
        api.get('/results/dashboard')
      ]);
      setStats({
        totalExams: examsRes.data.totalExams || 0,
        activeExams: examsRes.data.activeExams || 0,
        completedExams: examsRes.data.completedExams || 0,
        totalSubmissions: resultsRes.data.totalResults || 0,
        passRate: resultsRes.data.passPercentage || 0,
        avgScore: resultsRes.data.avgScore || 0
      });
      const exams = await api.get('/exams?limit=5&sort=-createdAt');
      setRecentExams(exams.data.exams || []);
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-surface-secondary text-text-muted',
      scheduled: 'bg-primary-100 text-primary',
      active: 'bg-success-light text-success-dark',
      completed: 'bg-info-light text-info-dark'
    };
    return colors[status] || colors.draft;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-border border-t-primary rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-1 sm:mb-2">Admin Dashboard</h1>
          <p className="text-xs sm:text-sm text-text-muted">Manage your assessment platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8">
          <div className="card p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="badge-info text-xs hidden sm:inline-block">Total</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-text-primary mb-0.5 sm:mb-1">{stats.totalExams}</p>
            <p className="text-xs sm:text-sm text-text-muted">Total Exams</p>
          </div>

          <div className="card p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-success/10 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="badge-success text-xs hidden sm:inline-block">Active</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-text-primary mb-0.5 sm:mb-1">{stats.activeExams}</p>
            <p className="text-xs sm:text-sm text-text-muted">Active Exams</p>
          </div>

          <div className="card p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-warning/10 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="badge-warning text-xs hidden sm:inline-block">Submissions</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-text-primary mb-0.5 sm:mb-1">{stats.totalSubmissions}</p>
            <p className="text-xs sm:text-sm text-text-muted">Total Submissions</p>
          </div>

          <div className="card p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-emerald-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-text-primary mb-0.5 sm:mb-1">{stats.passRate}%</p>
            <p className="text-xs sm:text-sm text-text-muted">Pass Rate</p>
          </div>

          <div className="card p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-purple-500/10 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-text-primary mb-0.5 sm:mb-1">{Number(stats.avgScore || 0).toFixed(0)}%</p>
            <p className="text-xs sm:text-sm text-text-muted">Average Score</p>
          </div>

          <div className="card p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-info/10 flex items-center justify-center">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-text-primary mb-0.5 sm:mb-1">{stats.completedExams}</p>
            <p className="text-xs sm:text-sm text-text-muted">Completed Exams</p>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Exams */}
          <div className="card p-4 sm:p-5 md:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h2 className="text-base sm:text-lg font-semibold text-text-primary">Recent Exams</h2>
              <Link to="/admin/exams" className="text-xs sm:text-sm text-primary font-medium no-underline hover:underline">View All</Link>
            </div>
            {recentExams.length > 0 ? (
              <div className="flex flex-col gap-2 sm:gap-3">
                {recentExams.map((exam) => (
                  <div key={exam._id} className="flex items-center justify-between p-3 sm:p-4 bg-surface rounded-lg sm:rounded-xl gap-3">
                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-text-primary text-xs sm:text-sm truncate">{exam.title}</p>
                        <p className="text-xs text-text-muted">{new Date(exam.scheduledDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <span className={`badge ${getStatusColor(exam.status)} text-xs shrink-0`}>
                      {exam.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 sm:py-10">
                <p className="text-text-muted text-sm">No exams yet</p>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="card p-4 sm:p-5 md:p-6">
            <h2 className="text-base sm:text-lg font-semibold text-text-primary mb-4 sm:mb-5">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <Link to="/admin/exams/create" className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-primary/5 rounded-lg sm:rounded-xl hover:bg-primary/10 transition-colors no-underline group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-text-primary">Create Exam</span>
              </Link>
              <Link to="/admin/questions/create" className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-success/5 rounded-lg sm:rounded-xl hover:bg-success/10 transition-colors no-underline group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-text-primary">Add Question</span>
              </Link>
              <Link to="/admin/users" className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-purple-500/5 rounded-lg sm:rounded-xl hover:bg-purple-500/10 transition-colors no-underline group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-text-primary">Manage Users</span>
              </Link>
              <Link to="/admin/analytics" className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-warning/5 rounded-lg sm:rounded-xl hover:bg-warning/10 transition-colors no-underline group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-md sm:rounded-lg bg-warning/10 flex items-center justify-center group-hover:bg-warning/20 transition-colors shrink-0">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <span className="text-xs sm:text-sm font-medium text-text-primary">Analytics</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
