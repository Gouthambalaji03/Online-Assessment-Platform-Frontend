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

  // Inline styles
  const containerStyle = {
    maxWidth: '800px',
    animation: 'fadeIn 0.3s ease-out'
  };

  const headerStyle = {
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

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  };

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0'
  };

  const cardTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: '16px'
  };

  const fieldGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569',
    marginBottom: '8px'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '14px',
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '96px',
    resize: 'vertical'
  };

  const textareaSmallStyle = {
    ...inputStyle,
    minHeight: '80px',
    resize: 'vertical'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  };

  const optionRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  };

  const radioStyle = {
    width: '20px',
    height: '20px',
    accentColor: '#2563EB',
    cursor: 'pointer'
  };

  const optionLabelStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: '#F1F5F9',
    color: '#475569',
    border: '1px solid #E2E8F0',
    flexShrink: 0
  };

  const removeButtonStyle = {
    padding: '8px',
    borderRadius: '8px',
    color: '#EF4444',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const addOptionButtonStyle = {
    fontSize: '14px',
    color: '#2563EB',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500'
  };

  const hintStyle = {
    fontSize: '12px',
    color: '#94A3B8',
    marginTop: '8px'
  };

  const buttonRowStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '16px'
  };

  const cancelButtonStyle = {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#475569',
    backgroundColor: '#F1F5F9',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const submitButtonStyle = {
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '500',
    color: '#FFFFFF',
    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    border: 'none',
    borderRadius: '10px',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.7 : 1,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease'
  };

  const spinnerStyle = {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid #FFFFFF',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const optionHeaderStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px'
  };

  return (
    <Layout>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>{questionId ? 'Edit Question' : 'Create New Question'}</h1>
          <p style={subtitleStyle}>Add a question to your question bank</p>
        </div>

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>Question Details</h2>
            <div style={fieldGroupStyle}>
              <div>
                <label style={labelStyle}>Question Type</label>
                <select
                  style={inputStyle}
                  value={formData.questionType}
                  onChange={(e) => setFormData({ ...formData, questionType: e.target.value })}
                >
                  <option value="mcq">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Question Text</label>
                <textarea
                  style={textareaStyle}
                  placeholder="Enter your question"
                  value={formData.questionText}
                  onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                  required
                />
              </div>

              {formData.questionType === 'mcq' ? (
                <div>
                  <div style={optionHeaderStyle}>
                    <label style={{ ...labelStyle, marginBottom: 0 }}>Answer Options</label>
                    <button
                      type="button"
                      onClick={addOption}
                      style={addOptionButtonStyle}
                    >
                      + Add Option
                    </button>
                  </div>
                  <div>
                    {formData.options.map((option, index) => (
                      <div key={index} style={optionRowStyle}>
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={option.isCorrect}
                          onChange={() => handleOptionChange(index, 'isCorrect', true)}
                          style={radioStyle}
                        />
                        <span style={optionLabelStyle}>
                          {String.fromCharCode(65 + index)}
                        </span>
                        <input
                          type="text"
                          style={{ ...inputStyle, flex: 1 }}
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          value={option.optionText}
                          onChange={(e) => handleOptionChange(index, 'optionText', e.target.value)}
                          required
                        />
                        {formData.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            style={removeButtonStyle}
                          >
                            <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <p style={hintStyle}>Select the correct answer using the radio button</p>
                </div>
              ) : (
                <div>
                  <label style={labelStyle}>Correct Answer</label>
                  <select
                    style={inputStyle}
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

          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>Classification</h2>
            <div style={gridStyle}>
              <div>
                <label style={labelStyle}>Category</label>
                <input
                  type="text"
                  style={inputStyle}
                  placeholder="e.g., Mathematics, Science"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Topic</label>
                <input
                  type="text"
                  style={inputStyle}
                  placeholder="e.g., Algebra, Physics"
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Difficulty Level</label>
                <select
                  style={inputStyle}
                  value={formData.difficultyLevel}
                  onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value })}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Marks</label>
                <input
                  type="number"
                  style={inputStyle}
                  min="1"
                  value={formData.marks}
                  onChange={(e) => setFormData({ ...formData, marks: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Negative Marks</label>
                <input
                  type="number"
                  style={inputStyle}
                  min="0"
                  step="0.25"
                  value={formData.negativeMarks}
                  onChange={(e) => setFormData({ ...formData, negativeMarks: parseFloat(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>Additional Information</h2>
            <div>
              <label style={labelStyle}>Explanation (Optional)</label>
              <textarea
                style={textareaSmallStyle}
                placeholder="Explain the correct answer (shown to students after submission)"
                value={formData.explanation}
                onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
              />
            </div>
          </div>

          <div style={buttonRowStyle}>
            <button type="button" onClick={() => navigate('/admin/questions')} style={cancelButtonStyle}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={submitButtonStyle}>
              {loading ? (
                <>
                  <div style={spinnerStyle}></div>
                  Saving...
                </>
              ) : (
                <>
                  {questionId ? 'Update Question' : 'Create Question'}
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
