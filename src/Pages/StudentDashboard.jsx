import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout';
import api from '../Services/api';
import { useAuth } from '../Context/AuthContext';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [analyticsRes, enrolledRes, resultsRes] = await Promise.all([
        api.get('/results/my-analytics'),
        api.get('/exams/enrolled'),
        api.get('/results/my-results?limit=5')
      ]);

      setStats(analyticsRes.data);
      setUpcomingExams(enrolledRes.data.filter(e => new Date(e.scheduledDate) >= new Date()));
      setRecentResults(resultsRes.data.results || []);
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
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome back, {user?.firstName}!</h1>
          <p className="text-sm text-text-muted">Here's your assessment overview</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="badge-info">Total</span>
            </div>
            <p className="text-3xl font-bold text-text-primary mb-1">{stats?.totalExams || 0}</p>
            <p className="text-sm text-text-muted">Exams Taken</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="badge-success">Passed</span>
            </div>
            <p className="text-3xl font-bold text-text-primary mb-1">{stats?.passedExams || 0}</p>
            <p className="text-sm text-text-muted">Exams Passed</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="badge-warning">Average</span>
            </div>
            <p className="text-3xl font-bold text-text-primary mb-1">{stats?.avgPercentage || 0}%</p>
            <p className="text-sm text-text-muted">Average Score</p>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="badge-neutral">Upcoming</span>
            </div>
            <p className="text-3xl font-bold text-text-primary mb-1">{upcomingExams.length}</p>
            <p className="text-sm text-text-muted">Scheduled Exams</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-text-primary">Upcoming Exams</h2>
              <Link to="/exams" className="text-sm text-primary font-medium no-underline hover:underline">View All</Link>
            </div>
            {upcomingExams.length > 0 ? (
              <div className="stack-sm">
                {upcomingExams.slice(0, 4).map((exam) => (
                  <div key={exam._id} className="flex items-center justify-between p-4 bg-surface rounded-xl">
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary mb-1">{exam.title}</h3>
                      <p className="text-xs text-text-muted">
                        {new Date(exam.scheduledDate).toLocaleDateString()} at {exam.startTime}
                      </p>
                    </div>
                    <Link 
                      to={`/exam/${exam._id}/start`} 
                      className="py-2 px-4 bg-primary-50 text-primary rounded-lg text-xs font-medium no-underline hover:bg-primary/20 transition-colors"
                    >
                      Take Exam
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state py-10">
                <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="empty-state-text">No upcoming exams</p>
                <Link to="/exams" className="text-sm text-primary font-medium no-underline hover:underline">Browse available exams</Link>
              </div>
            )}
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-text-primary">Recent Results</h2>
              <Link to="/results" className="text-sm text-primary font-medium no-underline hover:underline">View All</Link>
            </div>
            {recentResults.length > 0 ? (
              <div className="stack-sm">
                {recentResults.map((result) => (
                  <div key={result._id} className="flex items-center justify-between p-4 bg-surface rounded-xl">
                    <div>
                      <h3 className="text-sm font-semibold text-text-primary mb-1">{result.exam?.title}</h3>
                      <p className="text-xs text-text-muted">
                        {new Date(result.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${result.isPassed ? 'text-success' : 'text-error'}`}>
                        {result.percentage?.toFixed(1)}%
                      </p>
                      <span className={`inline-block py-1 px-2.5 text-xs font-medium rounded-md mt-1 ${
                        result.isPassed ? 'bg-success-light text-success-dark' : 'bg-error-light text-error-dark'
                      }`}>
                        {result.isPassed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state py-10">
                <svg className="empty-state-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="empty-state-text">No results yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
