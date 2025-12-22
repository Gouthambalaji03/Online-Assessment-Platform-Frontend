import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout';
import api from '../Services/api';
import { toast } from 'react-toastify';

const MyExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming');

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await api.get('/exams/enrolled');
      setExams(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const filteredExams = exams.filter(exam => {
    const examDate = new Date(exam.scheduledDate);
    if (filter === 'upcoming') return examDate >= now;
    if (filter === 'past') return examDate < now;
    return true;
  });

  const getExamStatus = (exam) => {
    const examDate = new Date(exam.scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (examDate.toDateString() === new Date().toDateString()) {
      return { label: 'Today', color: 'bg-warning-light text-warning-dark' };
    }
    if (examDate < today) {
      return { label: 'Completed', color: 'bg-success-light text-success-dark' };
    }
    const daysLeft = Math.ceil((examDate - today) / (1000 * 60 * 60 * 24));
    if (daysLeft <= 7) {
      return { label: `${daysLeft} day${daysLeft > 1 ? 's' : ''} left`, color: 'bg-primary-100 text-primary' };
    }
    return { label: 'Scheduled', color: 'bg-info-light text-info-dark' };
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">My Exams</h1>
          <p className="text-sm text-text-muted">View and manage your enrolled exams</p>
        </div>

        <div className="tab-group mb-6 max-w-sm">
          {['upcoming', 'past', 'all'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`tab-item ${filter === tab ? 'active' : ''}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {filteredExams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExams.map((exam) => {
              const status = getExamStatus(exam);
              return (
                <div key={exam._id} className="card hover:border-border-hover">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <span className={`badge ${status.color}`}>{status.label}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-text-primary mb-2">{exam.title}</h3>
                  <p className="text-sm text-text-muted mb-4 truncate-2">
                    {exam.description || 'No description available'}
                  </p>

                  <div className="flex flex-col gap-2 mb-5">
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <svg className="w-4 h-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{new Date(exam.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <svg className="w-4 h-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{exam.startTime} - {exam.endTime}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-muted">
                      <svg className="w-4 h-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{exam.duration} minutes</span>
                    </div>
                  </div>

                  {new Date(exam.scheduledDate) >= now ? (
                    <Link 
                      to={`/exam/${exam._id}/start`} 
                      className="btn-primary w-full no-underline"
                    >
                      Start Exam
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  ) : (
                    <Link 
                      to="/results" 
                      className="btn-secondary w-full no-underline"
                    >
                      View Result
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card text-center py-16">
            <svg className="w-16 h-16 mx-auto mb-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No Exams Found</h3>
            <p className="text-sm text-text-muted mb-5">
              {filter === 'upcoming' ? "You don't have any upcoming exams" : "No exams in this category"}
            </p>
            <Link to="/exams" className="btn-primary inline-flex no-underline">
              Browse Exams
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyExams;
