import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../Components/Layout';
import api from '../../Services/api';

const Proctoring = () => {
  const [activeSessions, setActiveSessions] = useState([]);
  const [flaggedExams, setFlaggedExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sessions, flagged] = await Promise.all([
        api.get('/proctoring/active-sessions'),
        api.get('/proctoring/flagged')
      ]);
      setActiveSessions(sessions.data || []);
      setFlaggedExams(flagged.data || []);
    } catch (error) {
      console.error('Failed to fetch proctoring data:', error);
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Proctoring Overview</h1>
          <p className="text-sm text-text-muted">Monitor and manage proctored exam sessions</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-text-primary mb-1">{activeSessions.length}</p>
            <p className="text-sm text-text-muted">Active Sessions</p>
          </div>

          <div className="card">
            <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-text-primary mb-1">{flaggedExams.length}</p>
            <p className="text-sm text-text-muted">Flagged for Review</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-text-primary">Active Sessions</h2>
            </div>
            {activeSessions.length > 0 ? (
              <div className="flex flex-col gap-3">
                {activeSessions.slice(0, 5).map((session) => (
                  <div key={session._id} className="flex items-center justify-between p-4 bg-surface rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        {session.student?.firstName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">
                          {session.student?.firstName} {session.student?.lastName}
                        </p>
                        <p className="text-xs text-text-muted">{session.exam?.title}</p>
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-text-muted">No active sessions</p>
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-text-primary">Flagged Exams</h2>
            </div>
            {flaggedExams.length > 0 ? (
              <div className="flex flex-col gap-3">
                {flaggedExams.slice(0, 5).map((exam) => (
                  <div key={exam._id} className="flex items-center justify-between p-4 bg-surface rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        {exam.student?.firstName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">
                          {exam.student?.firstName} {exam.student?.lastName}
                        </p>
                        <p className="text-xs text-text-muted">{exam.exam?.title}</p>
                      </div>
                    </div>
                    <span className="badge-error">{exam.violations?.length || 0} violations</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-text-muted">No flagged exams</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Proctoring;
