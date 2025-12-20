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
          <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-[#1E293B] mb-2">Welcome back, {user?.firstName}!</h1>
          <p className="text-[#64748B]">Here's your assessment overview</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="data-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#2563EB]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#2563EB]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="badge badge-info">Total</span>
            </div>
            <p className="value">{stats?.totalExams || 0}</p>
            <p className="label">Exams Taken</p>
          </div>

          <div className="data-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="badge badge-success">Passed</span>
            </div>
            <p className="value">{stats?.passedExams || 0}</p>
            <p className="label">Exams Passed</p>
          </div>

          <div className="data-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#F59E0B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <span className="badge badge-warning">Average</span>
            </div>
            <p className="value">{stats?.avgPercentage || 0}%</p>
            <p className="label">Average Score</p>
          </div>

          <div className="data-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-[#8B5CF6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="badge badge-neutral">Upcoming</span>
            </div>
            <p className="value">{upcomingExams.length}</p>
            <p className="label">Scheduled Exams</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#1E293B]">Upcoming Exams</h2>
              <Link to="/exams" className="link text-sm">View All</Link>
            </div>
            {upcomingExams.length > 0 ? (
              <div className="space-y-4">
                {upcomingExams.slice(0, 4).map((exam) => (
                  <div key={exam._id} className="flex items-center justify-between p-4 bg-[#F1F5F9] rounded-xl">
                    <div>
                      <h3 className="font-medium text-[#1E293B]">{exam.title}</h3>
                      <p className="text-sm text-[#64748B]">
                        {new Date(exam.scheduledDate).toLocaleDateString()} at {exam.startTime}
                      </p>
                    </div>
                    <Link
                      to={`/exam/${exam._id}/start`}
                      className="px-4 py-2 bg-[#2563EB]/10 text-[#2563EB] rounded-lg text-sm font-medium hover:bg-[#2563EB]/20 transition-colors"
                    >
                      Take Exam
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto mb-4 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-[#64748B]">No upcoming exams</p>
                <Link to="/exams" className="link text-sm mt-2 inline-block">Browse available exams</Link>
              </div>
            )}
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#1E293B]">Recent Results</h2>
              <Link to="/results" className="link text-sm">View All</Link>
            </div>
            {recentResults.length > 0 ? (
              <div className="space-y-4">
                {recentResults.map((result) => (
                  <div key={result._id} className="flex items-center justify-between p-4 bg-[#F1F5F9] rounded-xl">
                    <div>
                      <h3 className="font-medium text-[#1E293B]">{result.exam?.title}</h3>
                      <p className="text-sm text-[#64748B]">
                        {new Date(result.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-lg font-bold ${result.isPassed ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                        {result.percentage?.toFixed(1)}%
                      </p>
                      <span className={`badge ${result.isPassed ? 'badge-success' : 'badge-danger'}`}>
                        {result.isPassed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 mx-auto mb-4 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-[#64748B]">No results yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
