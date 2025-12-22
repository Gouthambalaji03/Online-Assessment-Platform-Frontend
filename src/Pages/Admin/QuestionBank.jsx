import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../Components/Layout';
import api from '../../Services/api';
import { toast } from 'react-toastify';

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: '', difficulty: '', type: '' });
  const [categories, setCategories] = useState([]);
  const [deleteModal, setDeleteModal] = useState(null);
  const [viewModal, setViewModal] = useState(null);

  useEffect(() => {
    fetchQuestions();
    fetchCategories();
  }, [filters]);

  const fetchQuestions = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.difficulty) params.append('difficultyLevel', filters.difficulty);
      if (filters.type) params.append('questionType', filters.type);

      const response = await api.get(`/questions?${params.toString()}`);
      setQuestions(response.data.questions || []);
    } catch (error) {
      toast.error('Failed to fetch questions');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/questions/categories');
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleDelete = async (questionId) => {
    try {
      await api.delete(`/questions/${questionId}`);
      toast.success('Question deleted successfully');
      setQuestions(questions.filter(q => q._id !== questionId));
      setDeleteModal(null);
    } catch (error) {
      toast.error('Failed to delete question');
    }
  };

  const getDifficultyStyle = (level) => {
    const styles = {
      easy: { bg: '#D1FAE5', text: '#059669' },
      medium: { bg: '#FEF3C7', text: '#D97706' },
      hard: { bg: '#FEE2E2', text: '#DC2626' }
    };
    return styles[level] || styles.medium;
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

  const filterContainerStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0'
  };

  const filterRowStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px'
  };

  const selectStyle = {
    padding: '10px 16px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1E293B',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '180px'
  };

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0',
    transition: 'all 0.2s ease'
  };

  const badgeStyle = (bg, text) => ({
    display: 'inline-block',
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: bg,
    color: text,
    borderRadius: '6px',
    marginRight: '8px',
    marginBottom: '8px'
  });

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
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '64px 24px',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0'
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
    maxWidth: '600px',
    width: '100%',
    margin: '0 16px',
    maxHeight: '80vh',
    overflowY: 'auto',
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
            <h1 style={titleStyle}>Question Bank</h1>
            <p style={subtitleStyle}>Manage your question repository</p>
          </div>
          <Link to="/admin/questions/create" style={createBtnStyle}>
            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Question
          </Link>
        </div>

        <div style={filterContainerStyle}>
          <div style={filterRowStyle}>
            <select
              style={selectStyle}
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              style={selectStyle}
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select
              style={selectStyle}
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="mcq">Multiple Choice</option>
              <option value="true_false">True/False</option>
            </select>
          </div>
        </div>

        {questions.length > 0 ? (
          <div>
            {questions.map((question) => {
              const diffStyle = getDifficultyStyle(question.difficultyLevel);
              return (
                <div key={question._id} style={cardStyle}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '15px', fontWeight: '500', color: '#1E293B', marginBottom: '12px', lineHeight: '1.5' }}>
                        {question.questionText}
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                        <span style={badgeStyle('#F1F5F9', '#475569')}>{question.category}</span>
                        <span style={badgeStyle('#F1F5F9', '#475569')}>{question.topic}</span>
                        <span style={badgeStyle(diffStyle.bg, diffStyle.text)}>{question.difficultyLevel}</span>
                        <span style={badgeStyle('#DBEAFE', '#1D4ED8')}>
                          {question.questionType === 'mcq' ? 'MCQ' : 'True/False'}
                        </span>
                        <span style={badgeStyle('#FEF3C7', '#D97706')}>{question.marks} marks</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button onClick={() => setViewModal(question)} style={actionBtnStyle('#2563EB')}>
                        <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <Link to={`/admin/questions/${question._id}/edit`} style={actionBtnStyle('#10B981')}>
                        <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button onClick={() => setDeleteModal(question)} style={actionBtnStyle('#EF4444')}>
                        <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={emptyStateStyle}>
            <svg style={{ width: '64px', height: '64px', margin: '0 auto 16px', color: '#CBD5E1' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1E293B', marginBottom: '8px' }}>No Questions Found</h3>
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>Start building your question bank</p>
            <Link to="/admin/questions/create" style={createBtnStyle}>
              <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Question
            </Link>
          </div>
        )}

        {viewModal && (
          <div style={modalOverlayStyle} onClick={() => setViewModal(null)}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B' }}>Question Details</h2>
                <button onClick={() => setViewModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                  <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div>
                <div style={{ marginBottom: '20px' }}>
                  <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>Question</p>
                  <p style={{ fontSize: '15px', fontWeight: '500', color: '#1E293B', lineHeight: '1.5' }}>{viewModal.questionText}</p>
                </div>
                {viewModal.questionType === 'mcq' && (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '10px', textTransform: 'uppercase', fontWeight: '600' }}>Options</p>
                    <div>
                      {viewModal.options.map((opt, idx) => (
                        <div
                          key={idx}
                          style={{
                            padding: '12px 16px',
                            marginBottom: '8px',
                            borderRadius: '8px',
                            backgroundColor: opt.isCorrect ? '#D1FAE5' : '#F8FAFC',
                            border: opt.isCorrect ? '1px solid #10B981' : '1px solid #E2E8F0'
                          }}
                        >
                          <span style={{ fontWeight: '600', color: '#64748B', marginRight: '8px' }}>{String.fromCharCode(65 + idx)}.</span>
                          <span style={{ color: '#1E293B' }}>{opt.optionText}</span>
                          {opt.isCorrect && <span style={{ marginLeft: '8px', color: '#059669', fontWeight: '500' }}>(Correct)</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {viewModal.questionType === 'true_false' && (
                  <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>Correct Answer</p>
                    <p style={{ fontSize: '15px', fontWeight: '500', color: '#1E293B', textTransform: 'capitalize' }}>{viewModal.correctAnswer}</p>
                  </div>
                )}
                {viewModal.explanation && (
                  <div>
                    <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '6px', textTransform: 'uppercase', fontWeight: '600' }}>Explanation</p>
                    <p style={{ fontSize: '14px', color: '#475569', lineHeight: '1.5' }}>{viewModal.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {deleteModal && (
          <div style={modalOverlayStyle} onClick={() => setDeleteModal(null)}>
            <div style={{ ...modalContentStyle, maxWidth: '400px' }} onClick={e => e.stopPropagation()}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>Delete Question</h2>
              <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>
                Are you sure you want to delete this question? This action cannot be undone.
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

export default QuestionBank;
