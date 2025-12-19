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

  const getDifficultyBadge = (level) => {
    const styles = {
      easy: 'bg-green-500/20 text-green-400',
      medium: 'bg-yellow-500/20 text-yellow-400',
      hard: 'bg-red-500/20 text-red-400'
    };
    return styles[level] || styles.medium;
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
            <h1 className="text-3xl font-bold mb-2">Question Bank</h1>
            <p className="text-gray-400">Manage your question repository</p>
          </div>
          <Link to="/admin/questions/create" className="btn-primary flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Question
          </Link>
        </div>

        <div className="glass-card p-4 mb-6">
          <div className="flex flex-wrap gap-4">
            <select
              className="input-field w-auto"
              value={filters.category}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              className="input-field w-auto"
              value={filters.difficulty}
              onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
            >
              <option value="">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
            <select
              className="input-field w-auto"
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
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question._id} className="glass-card p-6 hover:border-orange-500/30 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium mb-3">{question.questionText}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="badge bg-slate-700">{question.category}</span>
                      <span className="badge bg-slate-700">{question.topic}</span>
                      <span className={`badge ${getDifficultyBadge(question.difficultyLevel)}`}>
                        {question.difficultyLevel}
                      </span>
                      <span className="badge badge-info">
                        {question.questionType === 'mcq' ? 'MCQ' : 'True/False'}
                      </span>
                      <span className="badge bg-orange-500/20 text-orange-400">{question.marks} marks</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewModal(question)}
                      className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <Link
                      to={`/admin/questions/${question._id}/edit`}
                      className="p-2 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => setDeleteModal(question)}
                      className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No Questions Found</h3>
            <p className="text-gray-400 mb-4">Start building your question bank</p>
            <Link to="/admin/questions/create" className="btn-primary inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Question
            </Link>
          </div>
        )}

        {viewModal && (
          <div className="modal-overlay" onClick={() => setViewModal(null)}>
            <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Question Details</h2>
                <button onClick={() => setViewModal(null)} className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Question</p>
                  <p className="font-medium">{viewModal.questionText}</p>
                </div>
                {viewModal.questionType === 'mcq' && (
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Options</p>
                    <div className="space-y-2">
                      {viewModal.options.map((opt, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-lg ${
                            opt.isCorrect ? 'bg-green-500/20 border border-green-500/50' : 'bg-slate-800/50'
                          }`}
                        >
                          <span className="mr-2">{String.fromCharCode(65 + idx)}.</span>
                          {opt.optionText}
                          {opt.isCorrect && <span className="ml-2 text-green-400">(Correct)</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {viewModal.questionType === 'true_false' && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Correct Answer</p>
                    <p className="font-medium capitalize">{viewModal.correctAnswer}</p>
                  </div>
                )}
                {viewModal.explanation && (
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Explanation</p>
                    <p className="text-gray-300">{viewModal.explanation}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {deleteModal && (
          <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">Delete Question</h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete this question? This action cannot be undone.
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

export default QuestionBank;

