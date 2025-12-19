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
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Overview of your assessment platform</p>
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
            <p className="text-3xl font-bold">{examStats?.totalExams || 0}</p>
            <p className="text-gray-400 text-sm">Total Exams</p>
            <div className="flex gap-2 mt-2 text-xs">
              <span className="text-green-400">{examStats?.activeExams || 0} active</span>
              <span className="text-yellow-400">{examStats?.scheduledExams || 0} scheduled</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold">{questionStats?.totalQuestions || 0}</p>
            <p className="text-gray-400 text-sm">Questions in Bank</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold">{stats?.totalResults || 0}</p>
            <p className="text-gray-400 text-sm">Total Submissions</p>
            <p className="text-xs text-green-400 mt-2">{stats?.passPercentage || 0}% pass rate</p>
          </div>

          <div className="stat-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold">{stats?.avgScore || 0}%</p>
            <p className="text-gray-400 text-sm">Average Score</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Quick Actions</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/exams/create" className="stat-card text-center hover:border-orange-500/50">
                <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="font-medium">Create Exam</p>
              </Link>
              <Link to="/admin/questions/create" className="stat-card text-center hover:border-purple-500/50">
                <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <p className="font-medium">Add Question</p>
              </Link>
              <Link to="/admin/users" className="stat-card text-center hover:border-blue-500/50">
                <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="font-medium">Manage Users</p>
              </Link>
              <Link to="/admin/proctoring" className="stat-card text-center hover:border-green-500/50">
                <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <p className="font-medium">Proctoring</p>
              </Link>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Submissions</h2>
              <Link to="/admin/analytics" className="text-orange-400 hover:text-orange-300 text-sm">View All</Link>
            </div>
            {stats?.recentResults?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentResults.slice(0, 5).map((result) => (
                  <div key={result._id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm">
                        {result.student?.firstName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{result.student?.firstName} {result.student?.lastName}</p>
                        <p className="text-xs text-gray-400">{result.exam?.title}</p>
                      </div>
                    </div>
                    <span className={`badge ${result.isPassed ? 'badge-success' : 'badge-danger'}`}>
                      {result.percentage?.toFixed(0)}%
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-8">No recent submissions</p>
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Question Bank Overview</h2>
            <Link to="/admin/questions" className="text-orange-400 hover:text-orange-300 text-sm">Manage Questions</Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm text-gray-400 mb-3">By Difficulty</h3>
              <div className="space-y-2">
                {questionStats?.difficultyStats?.map((stat) => (
                  <div key={stat._id} className="flex items-center justify-between">
                    <span className="capitalize">{stat._id}</span>
                    <span className={`badge ${
                      stat._id === 'easy' ? 'badge-success' : 
                      stat._id === 'medium' ? 'badge-warning' : 'badge-danger'
                    }`}>{stat.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm text-gray-400 mb-3">By Type</h3>
              <div className="space-y-2">
                {questionStats?.typeStats?.map((stat) => (
                  <div key={stat._id} className="flex items-center justify-between">
                    <span className="capitalize">{stat._id === 'mcq' ? 'Multiple Choice' : stat._id === 'true_false' ? 'True/False' : stat._id}</span>
                    <span className="badge badge-info">{stat.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm text-gray-400 mb-3">By Category</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {questionStats?.categoryStats?.slice(0, 5).map((stat) => (
                  <div key={stat._id} className="flex items-center justify-between">
                    <span className="truncate">{stat._id}</span>
                    <span className="badge bg-slate-700 text-gray-300">{stat.count}</span>
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

