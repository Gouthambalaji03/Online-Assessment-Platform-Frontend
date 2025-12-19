import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout';
import api from '../Services/api';
import { toast } from 'react-toastify';

const MyExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrolledExams();
  }, []);

  const fetchEnrolledExams = async () => {
    try {
      const response = await api.get('/exams/enrolled');
      setExams(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch enrolled exams');
    } finally {
      setLoading(false);
    }
  };

  const getExamStatus = (exam) => {
    const now = new Date();
    const examDate = new Date(exam.scheduledDate);
    
    if (exam.status === 'completed') return { status: 'Completed', color: 'text-gray-400', bg: 'bg-gray-500/20' };
    if (examDate < now) return { status: 'Expired', color: 'text-red-400', bg: 'bg-red-500/20' };
    if (exam.status === 'active') return { status: 'Active', color: 'text-green-400', bg: 'bg-green-500/20' };
    return { status: 'Upcoming', color: 'text-blue-400', bg: 'bg-blue-500/20' };
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
          <h1 className="text-3xl font-bold mb-2">My Exams</h1>
          <p className="text-gray-400">View and manage your enrolled assessments</p>
        </div>

        {exams.length > 0 ? (
          <div className="space-y-4">
            {exams.map((exam) => {
              const statusInfo = getExamStatus(exam);
              const isActive = statusInfo.status === 'Active' || statusInfo.status === 'Upcoming';
              
              return (
                <div key={exam._id} className="glass-card p-6 hover:border-orange-500/30 transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center flex-shrink-0">
                        <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-semibold">{exam.title}</h3>
                          <span className={`text-xs px-3 py-1 rounded-full ${statusInfo.bg} ${statusInfo.color}`}>
                            {statusInfo.status}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mb-3">{exam.description || 'No description'}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>{new Date(exam.scheduledDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{exam.startTime} - {exam.endTime}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{exam.duration} mins</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>{exam.totalMarks} marks</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3 ml-auto">
                      {isActive && (
                        <Link
                          to={`/exam/${exam._id}/start`}
                          className="btn-primary flex items-center gap-2"
                        >
                          Start Exam
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      )}
                      <Link
                        to={`/exam/${exam._id}/details`}
                        className="btn-secondary flex items-center gap-2"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No Enrolled Exams</h3>
            <p className="text-gray-400 mb-4">You haven't enrolled in any exams yet</p>
            <Link to="/exams" className="btn-primary inline-flex items-center gap-2">
              Browse Exams
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyExams;

