import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../Components/Layout';
import api from '../../Services/api';
import { toast } from 'react-toastify';

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(null);
  const [filters, setFilters] = useState({ category: '', difficulty: '', type: '' });

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/questions?limit=100');
      setQuestions(response.data.questions || []);
    } catch (error) {
      toast.error('Failed to fetch questions');
    } finally {
      setLoading(false);
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

  const filteredQuestions = questions.filter(q => {
    if (filters.category && q.category !== filters.category) return false;
    if (filters.difficulty && q.difficultyLevel !== filters.difficulty) return false;
    if (filters.type && q.questionType !== filters.type) return false;
    return true;
  });

  const categories = [...new Set(questions.map(q => q.category))];

  const getDifficultyColor = (level) => {
    const colors = {
      easy: 'bg-success-light text-success-dark',
      medium: 'bg-warning-light text-warning-dark',
      hard: 'bg-error-light text-error-dark'
    };
    return colors[level] || colors.medium;
  };

  const getTypeColor = (type) => {
    const colors = {
      mcq: 'bg-primary-100 text-primary',
      true_false: 'bg-info-light text-info-dark',
      short_answer: 'bg-purple-100 text-purple-600'
    };
    return colors[type] || colors.mcq;
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
            <h1 className="text-3xl font-bold text-text-primary mb-2">Question Bank</h1>
            <p className="text-sm text-text-muted">Manage your question repository</p>
          </div>
          <Link to="/admin/questions/create" className="btn-primary no-underline">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Question
          </Link>
        </div>

        <div className="card mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
              className="select min-w-[180px]"
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
              className="select min-w-[150px]"
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="select min-w-[150px]"
            >
              <option value="">All Types</option>
              <option value="mcq">Multiple Choice</option>
              <option value="true_false">True/False</option>
            </select>
          </div>
        </div>

        {filteredQuestions.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredQuestions.map((question, index) => (
              <div key={question._id} className="card hover:border-border-hover">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-primary font-semibold">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary font-medium mb-3 leading-relaxed">{question.questionText}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`badge ${getTypeColor(question.questionType)}`}>
                        {question.questionType === 'mcq' ? 'MCQ' : question.questionType === 'true_false' ? 'True/False' : 'Short Answer'}
                      </span>
                      <span className={`badge ${getDifficultyColor(question.difficultyLevel)}`}>
                        {question.difficultyLevel}
                      </span>
                      <span className="badge-neutral">{question.category}</span>
                      <span className="badge-info">{question.marks} marks</span>
                    </div>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Link
                      to={`/admin/questions/${question._id}/edit`}
                      className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => setDeleteModal(question)}
                      className="p-2 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors border-none cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-16">
            <svg className="w-16 h-16 mx-auto mb-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No Questions Found</h3>
            <p className="text-sm text-text-muted mb-5">Get started by creating your first question</p>
            <Link to="/admin/questions/create" className="btn-primary inline-flex no-underline">
              Create Question
            </Link>
          </div>
        )}

        {deleteModal && (
          <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-text-primary mb-4">Delete Question</h2>
              <p className="text-text-muted mb-6">
                Are you sure you want to delete this question? This action cannot be undone.
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

export default QuestionBank;
