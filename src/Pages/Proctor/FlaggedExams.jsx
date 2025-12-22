import { useState, useEffect } from 'react';
import Layout from '../../Components/Layout';
import api from '../../Services/api';
import { toast } from 'react-toastify';

const FlaggedExams = () => {
  const [flaggedExams, setFlaggedExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedExam, setSelectedExam] = useState(null);

  useEffect(() => {
    fetchFlaggedExams();
  }, []);

  const fetchFlaggedExams = async () => {
    try {
      const response = await api.get('/proctoring/flagged');
      setFlaggedExams(response.data || []);
    } catch (error) {
      toast.error('Failed to fetch flagged exams');
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (examId, action) => {
    try {
      await api.put(`/proctoring/review/${examId}`, { action });
      toast.success(`Exam ${action === 'clear' ? 'cleared' : 'confirmed as violation'}`);
      fetchFlaggedExams();
      setSelectedExam(null);
    } catch (error) {
      toast.error('Failed to update review');
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: 'badge-info',
      medium: 'badge-warning',
      high: 'badge-error'
    };
    return colors[severity] || colors.medium;
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Flagged Exams</h1>
          <p className="text-sm text-text-muted">Review and investigate suspicious activities</p>
        </div>

        {flaggedExams.length > 0 ? (
          <div className="flex flex-col gap-4">
            {flaggedExams.map((item) => (
              <div key={item._id} className="card">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="avatar">
                      {item.student?.firstName?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">
                        {item.student?.firstName} {item.student?.lastName}
                      </p>
                      <p className="text-sm text-text-muted">{item.exam?.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`badge ${getSeverityColor(item.severity)}`}>
                      {item.severity} severity
                    </span>
                    <span className="badge-neutral">{item.violations?.length || 0} violations</span>
                    <button
                      onClick={() => setSelectedExam(item)}
                      className="btn-primary btn-sm"
                    >
                      Review
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-16">
            <svg className="w-16 h-16 mx-auto mb-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No Flagged Exams</h3>
            <p className="text-sm text-text-muted">
              All clear! No suspicious activities have been detected
            </p>
          </div>
        )}

        {selectedExam && (
          <div className="modal-overlay" onClick={() => setSelectedExam(null)}>
            <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-text-primary mb-5">Review Flagged Exam</h2>
              
              <div className="flex items-center gap-4 p-4 bg-surface rounded-xl mb-6">
                <div className="avatar">
                  {selectedExam.student?.firstName?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-text-primary">
                    {selectedExam.student?.firstName} {selectedExam.student?.lastName}
                  </p>
                  <p className="text-sm text-text-muted">{selectedExam.exam?.title}</p>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-text-primary mb-3">Violations</h3>
              <div className="flex flex-col gap-3 mb-6 max-h-[300px] overflow-y-auto">
                {selectedExam.violations?.map((violation, idx) => (
                  <div key={idx} className="p-4 bg-surface rounded-xl">
                    <div className="flex items-start justify-between mb-2">
                      <span className="font-medium text-text-primary">{violation.type}</span>
                      <span className={`badge ${getSeverityColor(violation.severity)}`}>
                        {violation.severity}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted">{violation.description}</p>
                    <p className="text-xs text-text-light mt-2">
                      {new Date(violation.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setSelectedExam(null)} className="btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={() => handleReview(selectedExam._id, 'clear')}
                  className="btn-success"
                >
                  Clear Flag
                </button>
                <button
                  onClick={() => handleReview(selectedExam._id, 'confirm')}
                  className="btn-error"
                >
                  Confirm Violation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default FlaggedExams;
