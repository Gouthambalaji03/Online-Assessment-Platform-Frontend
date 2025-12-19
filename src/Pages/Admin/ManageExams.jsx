import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../Components/Layout';
import api from '../../Services/api';
import { toast } from 'react-toastify';

const ManageExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const response = await api.get('/exams');
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

  const getStatusBadge = (status) => {
    const styles = {
      draft: 'bg-gray-500/20 text-gray-400',
      scheduled: 'bg-blue-500/20 text-blue-400',
      active: 'bg-green-500/20 text-green-400',
      completed: 'bg-purple-500/20 text-purple-400',
      cancelled: 'bg-red-500/20 text-red-400'
    };
    return styles[status] || styles.draft;
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Exams</h1>
            <p className="text-gray-400">Create, edit, and manage your assessments</p>
          </div>
          <Link to="/admin/exams/create" className="btn-primary flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Exam
          </Link>
        </div>

        {exams.length > 0 ? (
          <div className="table-container">
            <div className="grid grid-cols-12 table-header">
              <div className="col-span-4">Exam Title</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Schedule</div>
              <div className="col-span-1">Questions</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>
            {exams.map((exam) => (
              <div key={exam._id} className="grid grid-cols-12 table-row items-center">
                <div className="col-span-4">
                  <p className="font-medium">{exam.title}</p>
                  <p className="text-sm text-gray-400">{exam.duration} mins • {exam.totalMarks} marks</p>
                </div>
                <div className="col-span-2 text-gray-400">{exam.category}</div>
                <div className="col-span-2 text-sm">
                  <p>{new Date(exam.scheduledDate).toLocaleDateString()}</p>
                  <p className="text-gray-400">{exam.startTime} - {exam.endTime}</p>
                </div>
                <div className="col-span-1">{exam.questions?.length || 0}</div>
                <div className="col-span-1">
                  <span className={`badge ${getStatusBadge(exam.status)}`}>
                    {exam.status}
                  </span>
                </div>
                <div className="col-span-2 flex justify-end gap-2">
                  <Link
                    to={`/admin/exams/${exam._id}/edit`}
                    className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </Link>
                  <Link
                    to={`/admin/exams/${exam._id}/results`}
                    className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </Link>
                  <button
                    onClick={() => setDeleteModal(exam)}
                    className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No Exams Created</h3>
            <p className="text-gray-400 mb-4">Start by creating your first exam</p>
            <Link to="/admin/exams/create" className="btn-primary inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Exam
            </Link>
          </div>
        )}

        {deleteModal && (
          <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">Delete Exam</h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete "{deleteModal.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button onClick={() => setDeleteModal(null)} className="btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
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

