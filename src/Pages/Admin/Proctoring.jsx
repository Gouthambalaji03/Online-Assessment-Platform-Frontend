import { useState, useEffect } from 'react';
import Layout from '../../Components/Layout';
import api from '../../Services/api';
import { toast } from 'react-toastify';

const Proctoring = () => {
  const [stats, setStats] = useState(null);
  const [flaggedExams, setFlaggedExams] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchProctoringData();
  }, []);

  const fetchProctoringData = async () => {
    try {
      const [statsRes, flaggedRes, activeRes] = await Promise.all([
        api.get('/proctoring/stats'),
        api.get('/proctoring/flagged'),
        api.get('/proctoring/active-sessions')
      ]);
      setStats(statsRes.data);
      setFlaggedExams(flaggedRes.data.results || []);
      setActiveSessions(activeRes.data || []);
    } catch (error) {
      console.error('Failed to fetch proctoring data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminateExam = async (resultId) => {
    if (!window.confirm('Are you sure you want to terminate this exam?')) return;
    try {
      await api.post(`/proctoring/terminate/${resultId}`, { reason: 'Terminated by admin' });
      toast.success('Exam terminated successfully');
      fetchProctoringData();
    } catch (error) {
      toast.error('Failed to terminate exam');
    }
  };

  const getSeverityBadge = (severity) => {
    const styles = {
      low: 'bg-blue-500/20 text-blue-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      high: 'bg-orange-500/20 text-orange-400',
      critical: 'bg-red-500/20 text-red-400'
    };
    return styles[severity] || styles.low;
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
          <h1 className="text-3xl font-bold mb-2">Proctoring Management</h1>
          <p className="text-gray-400">Monitor exam sessions and review flagged incidents</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <p className="text-3xl font-bold text-blue-400">{activeSessions.length}</p>
            <p className="text-gray-400 text-sm">Active Sessions</p>
          </div>
          <div className="stat-card">
            <p className="text-3xl font-bold text-red-400">{flaggedExams.length}</p>
            <p className="text-gray-400 text-sm">Flagged Exams</p>
          </div>
          <div className="stat-card">
            <p className="text-3xl font-bold text-yellow-400">{stats?.pendingReview || 0}</p>
            <p className="text-gray-400 text-sm">Pending Review</p>
          </div>
          <div className="stat-card">
            <p className="text-3xl font-bold text-green-400">{stats?.totalLogs || 0}</p>
            <p className="text-gray-400 text-sm">Total Events</p>
          </div>
        </div>

        <div className="glass-card overflow-hidden">
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'overview' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('active')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'active' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              Active Sessions ({activeSessions.length})
            </button>
            <button
              onClick={() => setActiveTab('flagged')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'flagged' ? 'text-orange-400 border-b-2 border-orange-400' : 'text-gray-400 hover:text-white'
              }`}
            >
              Flagged Exams ({flaggedExams.length})
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Event Types</h3>
                  <div className="space-y-2">
                    {stats?.eventTypeStats?.map((stat) => (
                      <div key={stat._id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <span className="capitalize">{stat._id?.replace(/_/g, ' ')}</span>
                        <span className="badge bg-slate-700">{stat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">By Severity</h3>
                  <div className="space-y-2">
                    {stats?.severityStats?.map((stat) => (
                      <div key={stat._id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <span className="capitalize">{stat._id}</span>
                        <span className={`badge ${getSeverityBadge(stat._id)}`}>{stat.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Recent Events</h3>
                  <div className="space-y-2">
                    {stats?.recentLogs?.slice(0, 5).map((log) => (
                      <div key={log._id} className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className={`badge ${getSeverityBadge(log.severity)}`}>{log.severity}</span>
                          <div>
                            <p className="font-medium capitalize">{log.eventType?.replace(/_/g, ' ')}</p>
                            <p className="text-sm text-gray-400">{log.student?.firstName} {log.student?.lastName}</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'active' && (
              <div className="space-y-4">
                {activeSessions.length > 0 ? (
                  activeSessions.map((session) => (
                    <div key={session._id} className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                            {session.student?.firstName?.charAt(0)}
                          </div>
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-slate-800"></span>
                        </div>
                        <div>
                          <p className="font-medium">{session.student?.firstName} {session.student?.lastName}</p>
                          <p className="text-sm text-gray-400">{session.exam?.title}</p>
                          <p className="text-xs text-gray-500">Started {new Date(session.startedAt).toLocaleTimeString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm">
                            <span className="text-yellow-400">{session.flagCount || 0}</span> flags
                          </p>
                          <p className="text-xs text-gray-400">
                            {session.exam?.duration} min duration
                          </p>
                        </div>
                        <button
                          onClick={() => handleTerminateExam(session._id)}
                          className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 text-sm"
                        >
                          Terminate
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p>No active exam sessions</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'flagged' && (
              <div className="space-y-4">
                {flaggedExams.length > 0 ? (
                  flaggedExams.map((result) => (
                    <div key={result._id} className="p-4 bg-slate-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">{result.student?.firstName} {result.student?.lastName}</p>
                            <p className="text-sm text-gray-400">{result.exam?.title}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="badge badge-danger">{result.proctoringFlags?.length} flags</span>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(result.submittedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {result.proctoringFlags?.slice(0, 3).map((flag, idx) => (
                          <div key={idx} className="text-sm p-2 bg-slate-900/50 rounded flex items-center gap-2">
                            <span className="text-yellow-400">⚠</span>
                            <span className="capitalize">{flag.type?.replace(/_/g, ' ')}</span>
                            <span className="text-gray-500 text-xs ml-auto">
                              {new Date(flag.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                        ))}
                        {result.proctoringFlags?.length > 3 && (
                          <p className="text-xs text-gray-500 text-center">
                            +{result.proctoringFlags.length - 3} more flags
                          </p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No flagged exams</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Proctoring;

