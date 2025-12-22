import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../Components/Layout';
import api from '../../Services/api';

const ProctorDashboard = () => {
  const [stats, setStats] = useState({});
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [sessionsRes, flaggedRes] = await Promise.all([
        api.get('/proctoring/active-sessions'),
        api.get('/proctoring/flagged')
      ]);
      setActiveSessions(sessionsRes.data || []);
      setStats({
        activeSessions: sessionsRes.data?.length || 0,
        flaggedExams: flaggedRes.data?.length || 0
      });
    } catch (error) {
      console.error('Failed to fetch dashboard:', error);
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Proctor Dashboard</h1>
          <p className="text-sm text-text-muted">Monitor ongoing exams and review flagged sessions</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="badge-success">Live</span>
            </div>
            <p className="text-3xl font-bold text-text-primary mb-1">{stats.activeSessions}</p>
            <p className="text-sm text-text-muted">Active Sessions</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                </svg>
              </div>
              <span className="badge-error">Alert</span>
            </div>
            <p className="text-3xl font-bold text-text-primary mb-1">{stats.flaggedExams}</p>
            <p className="text-sm text-text-muted">Flagged Exams</p>
          </div>

          <Link to="/proctor/sessions" className="card hover:border-border-hover no-underline group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
            <p className="font-semibold text-text-primary group-hover:text-primary transition-colors">Live Sessions</p>
            <p className="text-sm text-text-muted">Monitor ongoing exams</p>
          </Link>

          <Link to="/proctor/flagged" className="card hover:border-border-hover no-underline group">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
            </div>
            <p className="font-semibold text-text-primary group-hover:text-primary transition-colors">Review Flagged</p>
            <p className="text-sm text-text-muted">Check suspicious activity</p>
          </Link>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-text-primary">Active Exam Sessions</h2>
            <Link to="/proctor/sessions" className="text-sm text-primary font-medium no-underline hover:underline">View All</Link>
          </div>
          {activeSessions.length > 0 ? (
            <div className="flex flex-col gap-3">
              {activeSessions.slice(0, 5).map((session) => (
                <div key={session._id} className="flex items-center justify-between p-4 bg-surface rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      {session.student?.firstName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">
                        {session.student?.firstName} {session.student?.lastName}
                      </p>
                      <p className="text-sm text-text-muted">{session.exam?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {session.violations > 0 && (
                      <span className="badge-warning">{session.violations} warnings</span>
                    )}
                    <Link
                      to={`/proctor/sessions/${session._id}`}
                      className="btn-secondary btn-sm no-underline"
                    >
                      Monitor
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <svg className="w-12 h-12 mx-auto mb-3 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p className="text-text-muted">No active sessions</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ProctorDashboard;
