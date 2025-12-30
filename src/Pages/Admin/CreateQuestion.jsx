import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../Components/Layout';
import api from '../../Services/api';
import { toast } from 'react-toastify';

const CreateQuestion = () => {
  const { questionId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(questionId);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    questionText: '',
    questionType: 'mcq',
    options: ['', '', '', ''],
    correctAnswer: '',
    category: '',
    topic: '',
    difficultyLevel: 'medium',
    marks: 1,
    explanation: ''
  });

  useEffect(() => {
    if (isEdit) fetchQuestion();
  }, [questionId]);

  const fetchQuestion = async () => {
    try {
      const response = await api.get(`/questions/${questionId}`);
      const q = response.data;

      // Transform options from backend format [{optionText, isCorrect}] to simple strings
      const optionStrings = q.options?.length
        ? q.options.map(opt => opt.optionText || opt)
        : ['', '', '', ''];

      // Find the correct answer from options
      const correctOption = q.options?.find(opt => opt.isCorrect);
      const correctAnswerText = correctOption?.optionText || q.correctAnswer || '';

      setFormData({
        questionText: q.questionText,
        questionType: q.questionType,
        options: optionStrings,
        correctAnswer: correctAnswerText,
        category: q.category || '',
        topic: q.topic || '',
        difficultyLevel: q.difficultyLevel || 'medium',
        marks: q.marks || 1,
        explanation: q.explanation || ''
      });
    } catch (error) {
      toast.error('Failed to fetch question');
      navigate('/admin/questions');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.correctAnswer) {
      toast.error('Please select the correct answer');
      return;
    }
    setLoading(true);
    try {
      // Transform options array to match backend schema: [{optionText, isCorrect}]
      const transformedOptions = formData.questionType === 'mcq'
        ? formData.options
            .filter(o => o.trim())
            .map(optionText => ({
              optionText: optionText,
              isCorrect: optionText === formData.correctAnswer
            }))
        : undefined;

      const payload = {
        ...formData,
        options: transformedOptions
      };
      if (isEdit) {
        await api.put(`/questions/${questionId}`, payload);
        toast.success('Question updated successfully');
      } else {
        await api.post('/questions', payload);
        toast.success('Question created successfully');
      }
      navigate('/admin/questions');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save question');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ''] });
  };

  const removeOption = (index) => {
    if (formData.options.length <= 2) return;
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      options: newOptions,
      correctAnswer: formData.correctAnswer === formData.options[index] ? '' : formData.correctAnswer
    });
  };

  return (
    <Layout>
      <div className="animate-fade-in max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {isEdit ? 'Edit Question' : 'Create Question'}
          </h1>
          <p className="text-sm text-text-muted">
            {isEdit ? 'Update question details' : 'Add a new question to your question bank'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="card mb-6">
            <div className="flex flex-col gap-5">
              <div className="form-group">
                <label className="label">Question Text</label>
                <textarea
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  placeholder="Enter your question..."
                  className="textarea"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label">Question Type</label>
                  <select
                    value={formData.questionType}
                    onChange={(e) => setFormData({
                      ...formData,
                      questionType: e.target.value,
                      correctAnswer: ''
                    })}
                    className="select"
                  >
                    <option value="mcq">Multiple Choice</option>
                    <option value="true_false">True/False</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Difficulty</label>
                  <select
                    value={formData.difficultyLevel}
                    onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value })}
                    className="select"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {formData.questionType === 'mcq' && (
                <div className="form-group">
                  <label className="label">Options (Select the correct answer)</label>
                  <div className="flex flex-col gap-3">
                    {formData.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={formData.correctAnswer === option && option.trim() !== ''}
                          onChange={() => setFormData({ ...formData, correctAnswer: option })}
                          className="w-5 h-5 accent-success"
                          disabled={!option.trim()}
                        />
                        <input
                          type="text"
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          className="input flex-1"
                        />
                        {formData.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="p-2 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors border-none cursor-pointer"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  {formData.options.length < 6 && (
                    <button
                      type="button"
                      onClick={addOption}
                      className="mt-3 text-sm text-primary font-medium hover:underline"
                    >
                      + Add Option
                    </button>
                  )}
                </div>
              )}

              {formData.questionType === 'true_false' && (
                <div className="form-group">
                  <label className="label">Correct Answer</label>
                  <div className="flex gap-4">
                    {['True', 'False'].map((option) => (
                      <label
                        key={option}
                        className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl cursor-pointer transition-colors border-2 ${
                          formData.correctAnswer === option
                            ? 'border-success bg-success-light'
                            : 'border-border bg-surface hover:border-success/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="correctAnswer"
                          value={option}
                          checked={formData.correctAnswer === option}
                          onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                          className="w-5 h-5 accent-success"
                        />
                        <span className="font-medium text-text-primary">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="card mb-6">
            <h2 className="text-lg font-semibold text-text-primary mb-5">Additional Details</h2>
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="label">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g., Mathematics"
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Topic</label>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g., Algebra"
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Marks</label>
                  <input
                    type="number"
                    value={formData.marks}
                    onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
                    className="input"
                    min="1"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="label">Explanation (Optional)</label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Explain the correct answer..."
                  className="textarea"
                  rows={3}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/questions')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                isEdit ? 'Update Question' : 'Create Question'
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateQuestion;
