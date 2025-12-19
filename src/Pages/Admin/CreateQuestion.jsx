import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../Components/Layout';
import api from '../../Services/api';
import { toast } from 'react-toastify';

const CreateQuestion = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    questionText: '',
    questionType: 'mcq',
    options: [
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false }
    ],
    correctAnswer: 'true',
    category: '',
    topic: '',
    difficultyLevel: 'medium',
    marks: 1,
    negativeMarks: 0,
    explanation: ''
  });

  useEffect(() => {
    if (questionId) {
      fetchQuestionDetails();
    }
  }, [questionId]);

  const fetchQuestionDetails = async () => {
    try {
      const response = await api.get(`/questions/${questionId}`);
      setFormData(response.data);
    } catch (error) {
      toast.error('Failed to fetch question details');
    }
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    if (field === 'isCorrect') {
      newOptions.forEach((opt, i) => {
        opt.isCorrect = i === index;
      });
    } else {
      newOptions[index][field] = value;
    }
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({
      ...formData,
      options: [...formData.options, { optionText: '', isCorrect: false }]
    });
  };

  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      setFormData({ ...formData, options: newOptions });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.questionType === 'mcq') {
      if (!formData.options.some(opt => opt.isCorrect)) {
        toast.error('Please select a correct answer');
        return;
      }
      if (formData.options.some(opt => !opt.optionText.trim())) {
        toast.error('All options must have text');
        return;
      }
    }

    setLoading(true);
    try {
      if (questionId) {
        await api.put(`/questions/${questionId}`, formData);
        toast.success('Question updated successfully');
      } else {
        await api.post('/questions', formData);
        toast.success('Question created successfully');
      }
      navigate('/admin/questions');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="animate-fadeIn max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{questionId ? 'Edit Question' : 'Create New Question'}</h1>
          <p className="text-gray-400">Add a question to your question bank</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Question Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Question Type</label>
                <select
                  className="input-field"
                  value={formData.questionType}
                  onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
                >
                  <option value="mcq">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Question Text</label>
                <textarea
                  className="input-field min-h-24"
                  placeholder="Enter your question"
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  required
                />
              </div>

              {formData.questionType === 'mcq' ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">Answer Options</label>
                    <button
                      type="button"
                      onClick={addOption}
                      className="text-sm text-orange-400 hover:text-orange-300"
                    >
                      + Add Option
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={option.isCorrect}
                          onChange={() => handleOptionChange(index, 'isCorrect', true)}
                          className="w-5 h-5 text-orange-500"
                        />
                        <span className="w-8 h-8 rounded-lg bg-slate-700 flex items-center justify-center text-sm">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <input
                          type="text"
                          className="input-field flex-1"
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          value={option.optionText}
                          onChange={(e) => handleOptionChange(index, 'optionText', e.target.value)}
                          required
                        />
                        {formData.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">Select the correct answer using the radio button</p>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Correct Answer</label>
                  <select
                    className="input-field"
                    value={formData.correctAnswer}
                    onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                  >
                    <option value="true">True</option>
                    <option value="false">False</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Classification</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Mathematics, Science"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Topic</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Algebra, Physics"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Difficulty Level</label>
                <select
                  className="input-field"
                  value={formData.difficultyLevel}
                  onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value })}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Marks</label>
                <input
                  type="number"
                  className="input-field"
                  min="1"
                  value={formData.marks}
                  onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Negative Marks</label>
                <input
                  type="number"
                  className="input-field"
                  min="0"
                  step="0.25"
                  value={formData.negativeMarks}
                  onChange={(e) => setFormData({ ...formData, negativeMarks: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Explanation (Optional)</label>
              <textarea
                className="input-field min-h-20"
                placeholder="Explain the correct answer (shown to students after submission)"
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/admin/questions')} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  {questionId ? 'Update Question' : 'Create Question'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateQuestion;

