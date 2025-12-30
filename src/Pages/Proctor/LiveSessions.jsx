import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../Components/Layout';
import api from '../../Services/api';
import { toast } from 'react-toastify';

const LiveSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await api.get('/proctoring/active-sessions');
      setSessions(response.data || []);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlagSession = async (sessionId) => {
    try {
      await api.post(`/proctoring/flag/${sessionId}`);
      toast.success('Session flagged for review');
      fetchSessions();
    } catch (error) {
      toast.error('Failed to flag session');
    }
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
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Live Sessions</h1>
          <p className="text-sm text-text-muted">Monitor ongoing proctored exam sessions</p>
        </div>

        {sessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessions.map((session) => (
              <div key={session._id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      {session.student?.firstName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">
                        {session.student?.firstName} {session.student?.lastName}
                      </p>
                      <p className="text-xs text-text-muted">{session.student?.email}</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                </div>

                <p className="text-sm text-text-secondary mb-4">{session.exam?.title}</p>

                <div className="aspect-video bg-black rounded-lg overflow-hidden mb-4">
                  {session.lastSnapshot ? (
                    <img
                      src={session.lastSnapshot}
                      alt="Live feed"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-light">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-text-muted">Violations</span>
                  <span className={`badge ${session.violations > 0 ? 'badge-warning' : 'badge-success'}`}>
                    {session.violations || 0}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Link
                    to={`/proctor/sessions/${session._id}`}
                    className="btn-primary btn-sm flex-1 no-underline"
                  >
                    View Details
                  </Link>
                <button
                    onClick={() => handleFlagSession(session._id)}
                    className="btn-ghost btn-sm"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-16">
            <svg className="w-16 h-16 mx-auto mb-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No Active Sessions</h3>
            <p className="text-sm text-text-muted">
              There are no proctored exams in progress at the moment
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LiveSessions;
