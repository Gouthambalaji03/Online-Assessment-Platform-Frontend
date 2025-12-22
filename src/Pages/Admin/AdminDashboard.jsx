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

  const quickActions = [
    { to: '/admin/exams/create', icon: 'M12 4v16m8-8H4', label: 'Create Exam', color: 'warning' },
    { to: '/admin/questions/create', icon: 'M12 4v16m8-8H4', label: 'Add Question', color: 'purple' },
    { to: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z', label: 'Manage Users', color: 'primary' },
    { to: '/admin/proctoring', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z', label: 'Proctoring', color: 'success' }
  ];

  const colorClasses = {
    primary: { bg: 'bg-primary/10', text: 'text-primary' },
    success: { bg: 'bg-success/10', text: 'text-success' },
    warning: { bg: 'bg-warning/10', text: 'text-warning' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500' }
  };

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
      <div className="animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Admin Dashboard</h1>
          <p className="text-sm text-text-muted">Overview of your assessment platform</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-text-primary mb-1">{examStats?.totalExams || 0}</p>
            <p className="text-sm text-text-muted">Total Exams</p>
            <div className="flex gap-3 mt-2 text-xs">
              <span className="text-success">{examStats?.activeExams || 0} active</span>
              <span className="text-warning">{examStats?.scheduledExams || 0} scheduled</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-text-primary mb-1">{questionStats?.totalQuestions || 0}</p>
            <p className="text-sm text-text-muted">Questions in Bank</p>
          </div>

          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-text-primary mb-1">{stats?.totalResults || 0}</p>
            <p className="text-sm text-text-muted">Total Submissions</p>
            <div className="flex gap-3 mt-2 text-xs">
              <span className="text-success">{stats?.passPercentage || 0}% pass rate</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold text-text-primary mb-1">{stats?.avgScore || 0}%</p>
            <p className="text-sm text-text-muted">Average Score</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-text-primary">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Link
                  key={action.to}
                  to={action.to}
                  className="block bg-surface rounded-xl p-5 text-center border border-border transition-all duration-200 hover:border-primary/30 hover:shadow-md no-underline"
                >
                  <div className={`w-12 h-12 rounded-xl ${colorClasses[action.color].bg} flex items-center justify-center mx-auto mb-3`}>
                    <svg className={`w-6 h-6 ${colorClasses[action.color].text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={action.icon} />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-text-primary">{action.label}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-text-primary">Recent Submissions</h2>
              <Link to="/admin/analytics" className="text-sm text-primary font-medium no-underline hover:underline">View All</Link>
            </div>
            {stats?.recentResults?.length > 0 ? (
              <div className="stack-sm">
                {stats.recentResults.slice(0, 5).map((result) => (
                  <div key={result._id} className="flex items-center justify-between p-3 bg-surface rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="avatar avatar-sm bg-border text-text-secondary">
                        {result.student?.firstName?.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          {result.student?.firstName} {result.student?.lastName}
                        </p>
                        <p className="text-xs text-text-muted">{result.exam?.title}</p>
                      </div>
                    </div>
                    <span className={`${result.isPassed ? 'badge-success' : 'badge-error'}`}>
                      {result.percentage?.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-text-muted py-8">No recent submissions</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-text-primary">Question Bank Overview</h2>
            <Link to="/admin/questions" className="text-sm text-primary font-medium no-underline hover:underline">Manage Questions</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-xs text-text-muted font-medium mb-3">By Difficulty</h3>
              <div className="stack-sm">
                {questionStats?.difficultyStats?.map((stat) => (
                  <div key={stat._id} className="flex items-center justify-between py-2 border-b border-surface-secondary last:border-0">
                    <span className="text-sm text-text-primary capitalize">{stat._id}</span>
                    <span className={`${
                      stat._id === 'easy' ? 'badge-success' :
                      stat._id === 'medium' ? 'badge-warning' : 'badge-error'
                    }`}>{stat.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs text-text-muted font-medium mb-3">By Type</h3>
              <div className="stack-sm">
                {questionStats?.typeStats?.map((stat) => (
                  <div key={stat._id} className="flex items-center justify-between py-2 border-b border-surface-secondary last:border-0">
                    <span className="text-sm text-text-primary capitalize">
                      {stat._id === 'mcq' ? 'Multiple Choice' : stat._id === 'true_false' ? 'True/False' : stat._id}
                    </span>
                    <span className="badge-info">{stat.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs text-text-muted font-medium mb-3">By Category</h3>
              <div className="stack-sm max-h-40 overflow-y-auto">
                {questionStats?.categoryStats?.slice(0, 5).map((stat) => (
                  <div key={stat._id} className="flex items-center justify-between py-2 border-b border-surface-secondary last:border-0">
                    <span className="text-sm text-text-primary truncate">{stat._id}</span>
                    <span className="badge-neutral">{stat.count}</span>
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
