import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../Components/Layout';
import api from '../../Services/api';
import { toast } from 'react-toastify';

const ProctorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [activeSessions, setActiveSessions] = useState([]);
  const [recentFlags, setRecentFlags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, activeRes, logsRes] = await Promise.all([
        api.get('/proctoring/stats'),
        api.get('/proctoring/active-sessions'),
        api.get('/proctoring/logs?limit=10')
      ]);
      setStats(statsRes.data);
      setActiveSessions(activeRes.data || []);
      setRecentFlags(logsRes.data.logs || []);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateExam = async (resultId) => {
    if (!window.confirm('Are you sure you want to terminate this exam?')) return;
    try {
      await api.post(`/proctoring/terminate/${resultId}`, { reason: 'Terminated by proctor' });
      toast.success('Exam terminated successfully');
      fetchDashboardData();
    } catch (error) {
      toast.error('Failed to terminate exam');
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'text-blue-400',
      medium: 'text-yellow-400',
      high: 'text-orange-400',
      critical: 'text-red-400'
    };
    return colors[severity] || colors.low;
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
          <h1 className="text-3xl font-bold mb-2">Proctor Dashboard</h1>
          <p className="text-gray-400">Monitor exam sessions in real-time</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              </div>
              <div>
                <p className="text-3xl font-bold">{activeSessions.length}</p>
                <p className="text-gray-400 text-sm">Live Sessions</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold">{stats?.pendingReview || 0}</p>
                <p className="text-gray-400 text-sm">Pending Review</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-red-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold text-red-400">
                  {stats?.severityStats?.find(s => s._id === 'critical')?.count || 0}
                </p>
                <p className="text-gray-400 text-sm">Critical Flags</p>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-3xl font-bold">{stats?.totalLogs || 0}</p>
                <p className="text-gray-400 text-sm">Total Events</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Active Sessions
              </h2>
              <Link to="/proctor/sessions" className="text-orange-400 hover:text-orange-300 text-sm">View All</Link>
            </div>
            {activeSessions.length > 0 ? (
              <div className="space-y-4">
                {activeSessions.slice(0, 5).map((session) => (
                  <div key={session._id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                          {session.student?.firstName?.charAt(0)}
                        </div>
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-slate-800"></span>
                      </div>
                      <div>
                        <p className="font-medium">{session.student?.firstName} {session.student?.lastName}</p>
                        <p className="text-xs text-gray-400">{session.exam?.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {session.flagCount > 0 && (
                        <span className="badge badge-warning">{session.flagCount} flags</span>
                      )}
                      <button
                        onClick={() => handleTerminateExam(session._id)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                        title="Terminate Exam"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p>No active sessions</p>
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <Link to="/proctor/logs" className="text-orange-400 hover:text-orange-300 text-sm">View All</Link>
            </div>
            {recentFlags.length > 0 ? (
              <div className="space-y-3">
                {recentFlags.slice(0, 6).map((log) => (
                  <div key={log._id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${getSeverityColor(log.severity).replace('text', 'bg')}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate capitalize">
                        {log.eventType?.replace(/_/g, ' ')}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {log.student?.firstName} {log.student?.lastName}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProctorDashboard;

