import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../Components/Layout';
import api from '../../Services/api';
import { toast } from 'react-toastify';

const ManageExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchExams();
  }, [statusFilter]);

  const fetchExams = async () => {
    try {
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const response = await api.get(`/exams${params}`);
      setExams(response.data.exams || []);
    } catch (error) {
      toast.error('Failed to fetch exams');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (examId) => {
    try {
      await api.delete(`/exams/${examId}`);
      toast.success('Exam deleted successfully');
      setExams(exams.filter(e => e._id !== examId));
      setDeleteModal(null);
    } catch (error) {
      toast.error('Failed to delete exam');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-surface-secondary text-text-muted',
      scheduled: 'bg-primary-100 text-primary',
      active: 'bg-success-light text-success-dark',
      completed: 'bg-info-light text-info-dark',
      cancelled: 'bg-error-light text-error-dark'
    };
    return colors[status] || colors.draft;
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Manage Exams</h1>
            <p className="text-sm text-text-muted">Create and manage your assessments</p>
          </div>
          <Link to="/admin/exams/create" className="btn-primary no-underline">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Exam
          </Link>
        </div>

        <div className="card mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="select max-w-[200px]"
          >
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {exams.length > 0 ? (
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header text-left">Exam</th>
                  <th className="table-header text-left">Schedule</th>
                  <th className="table-header text-center">Duration</th>
                  <th className="table-header text-center">Status</th>
                  <th className="table-header text-center">Enrolled</th>
                  <th className="table-header text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam._id} className="table-row">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary">{exam.title}</p>
                          <p className="text-xs text-text-muted">{exam.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <p className="text-sm text-text-primary">{new Date(exam.scheduledDate).toLocaleDateString()}</p>
                      <p className="text-xs text-text-muted">{exam.startTime} - {exam.endTime}</p>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className="text-sm text-text-secondary">{exam.duration} min</span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className={`badge ${getStatusColor(exam.status)}`}>
                        {exam.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className="text-sm font-medium text-text-primary">{exam.enrolledStudents?.length || 0}</span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/exams/${exam._id}/edit`}
                          className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <Link
                          to={`/admin/exams/${exam._id}/proctors`}
                          className="p-2 rounded-lg bg-warning/10 text-warning hover:bg-warning/20 transition-colors"
                          title="Assign Proctors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => setDeleteModal(exam)}
                          className="p-2 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors border-none cursor-pointer"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="card text-center py-16">
            <svg className="w-16 h-16 mx-auto mb-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No Exams Yet</h3>
            <p className="text-sm text-text-muted mb-5">Create your first exam to get started</p>
            <Link to="/admin/exams/create" className="btn-primary inline-flex no-underline">
              Create Exam
            </Link>
          </div>
        )}

        {deleteModal && (
          <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-text-primary mb-4">Delete Exam</h2>
              <p className="text-text-muted mb-6">
                Are you sure you want to delete "{deleteModal.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteModal(null)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteModal._id)} className="btn-error">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ManageExams;
