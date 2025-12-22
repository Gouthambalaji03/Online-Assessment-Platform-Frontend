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

  const getStatusStyle = (status) => {
    const styles = {
      draft: { bg: '#F1F5F9', text: '#64748B' },
      scheduled: { bg: '#DBEAFE', text: '#1D4ED8' },
      active: { bg: '#D1FAE5', text: '#059669' },
      completed: { bg: '#F3E8FF', text: '#7C3AED' },
      cancelled: { bg: '#FEE2E2', text: '#DC2626' }
    };
    return styles[status] || styles.draft;
  };

  const containerStyle = {
    animation: 'fadeIn 0.3s ease-out'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: '#64748B'
  };

  const createBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 24px',
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const tableContainerStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0',
    overflow: 'hidden'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const thStyle = {
    padding: '16px 20px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    backgroundColor: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0'
  };

  const tdStyle = {
    padding: '16px 20px',
    fontSize: '14px',
    color: '#1E293B',
    borderBottom: '1px solid #F1F5F9'
  };

  const actionBtnStyle = (color) => ({
    padding: '8px',
    backgroundColor: `${color}15`,
    color: color,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  const emptyStateStyle = {
    padding: '64px 24px',
    textAlign: 'center'
  };

  const spinnerContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh'
  };

  const spinnerStyle = {
    width: '48px',
    height: '48px',
    border: '4px solid #E2E8F0',
    borderTop: '4px solid #2563EB',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    inset: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '50'
  };

  const modalContentStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '400px',
    width: '100%',
    margin: '0 16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  };

  if (loading) {
    return (
      <Layout>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={spinnerContainerStyle}>
          <div style={spinnerStyle}></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Manage Exams</h1>
            <p style={subtitleStyle}>Create, edit, and manage your assessments</p>
          </div>
          <Link to="/admin/exams/create" style={createBtnStyle}>
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Exam
          </Link>
        </div>

        {exams.length > 0 ? (
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Exam Title</th>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Schedule</th>
                  <th style={thStyle}>Questions</th>
                  <th style={thStyle}>Status</th>
                  <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => {
                  const statusStyle = getStatusStyle(exam.status);
                  return (
                    <tr key={exam._id}>
                      <td style={tdStyle}>
                        <p style={{ fontWeight: '600', color: '#1E293B', marginBottom: '4px' }}>{exam.title}</p>
                        <p style={{ fontSize: '13px', color: '#64748B' }}>{exam.duration} mins • {exam.totalMarks} marks</p>
                      </td>
                      <td style={{ ...tdStyle, color: '#64748B' }}>{exam.category}</td>
                      <td style={tdStyle}>
                        <p style={{ fontSize: '14px', color: '#1E293B' }}>{new Date(exam.scheduledDate).toLocaleDateString()}</p>
                        <p style={{ fontSize: '13px', color: '#64748B' }}>{exam.startTime} - {exam.endTime}</p>
                      </td>
                      <td style={tdStyle}>{exam.questions?.length || 0}</td>
                      <td style={tdStyle}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          fontSize: '12px',
                          fontWeight: '500',
                          backgroundColor: statusStyle.bg,
                          color: statusStyle.text,
                          borderRadius: '6px',
                          textTransform: 'capitalize'
                        }}>
                          {exam.status}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'right' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <Link to={`/admin/exams/${exam._id}/edit`} style={actionBtnStyle('#2563EB')}>
                            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button onClick={() => setDeleteModal(exam)} style={actionBtnStyle('#EF4444')}>
                            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ ...tableContainerStyle, ...emptyStateStyle }}>
            <svg style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: '#CBD5E1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1E293B', marginBottom: '8px' }}>No Exams Created</h3>
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>Start by creating your first exam</p>
            <Link to="/admin/exams/create" style={createBtnStyle}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Exam
            </Link>
          </div>
        )}

        {deleteModal && (
          <div style={modalOverlayStyle} onClick={() => setDeleteModal(null)}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>Delete Exam</h2>
              <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>
                Are you sure you want to delete "{deleteModal.title}"? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => setDeleteModal(null)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#F1F5F9',
                    color: '#64748B',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal._id)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
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
