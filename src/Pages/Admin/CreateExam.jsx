import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../Components/Layout';
import api from '../../Services/api';
import { toast } from 'react-toastify';

const CreateExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    instructions: '',
    category: '',
    duration: 60,
    scheduledDate: '',
    startTime: '09:00',
    endTime: '10:00',
    passingMarks: 40,
    maxAttempts: 1,
    isProctored: false,
    shuffleQuestions: false,
    shuffleOptions: false,
    showResultImmediately: true,
    allowReview: true,
    proctoringSettings: {
      videoMonitoring: false,
      browserLockdown: true,
      identityVerification: false,
      tabSwitchLimit: 3
    },
    status: 'draft'
  });

  useEffect(() => {
    fetchQuestions();
    if (examId) {
      fetchExamDetails();
    }
  }, [examId]);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/questions?limit=100');
      setQuestions(response.data.questions || []);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    }
  };

  const fetchExamDetails = async () => {
    try {
      const response = await api.get(`/exams/${examId}`);
      const exam = response.data;
      setFormData({
        ...formData,
        ...exam,
        scheduledDate: exam.scheduledDate?.split('T')[0],
        proctoringSettings: exam.proctoringSettings || formData.proctoringSettings
      });
      setSelectedQuestions(exam.questions?.map(q => q._id || q) || []);
    } catch (error) {
      toast.error('Failed to fetch exam details');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedQuestions.length === 0) {
      toast.error('Please add at least one question to the exam');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...formData, questions: selectedQuestions };
      if (examId) {
        await api.put(`/exams/${examId}`, payload);
        toast.success('Exam updated successfully');
      } else {
        await api.post('/exams', payload);
        toast.success('Exam created successfully');
      }
      navigate('/admin/exams');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save exam');
    } finally {
      setLoading(false);
    }
  };

  const toggleQuestion = (questionId) => {
    setSelectedQuestions(prev =>
      prev.includes(questionId)
        ? prev.filter(id => id !== questionId)
        : [...prev, questionId]
    );
  };

  const calculateTotalMarks = () => {
    return questions
      .filter(q => selectedQuestions.includes(q._id))
      .reduce((sum, q) => sum + q.marks, 0);
  };

  const getDifficultyStyle = (level) => {
    const styles = {
      easy: { bg: '#D1FAE5', text: '#059669' },
      medium: { bg: '#FEF3C7', text: '#D97706' },
      hard: { bg: '#FEE2E2', text: '#DC2626' }
    };
    return styles[level] || styles.medium;
  };

  // Styles
  const containerStyle = {
    maxWidth: '900px',
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

  const cardStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0'
  };

  const cardTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: '20px'
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
    transition: 'border-color 0.2s ease'
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '100px',
    resize: 'vertical'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '16px'
  };

  const fieldGroupStyle = {
    marginBottom: '16px'
  };

  const checkboxContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#F8FAFC',
    borderRadius: '10px',
    border: '1px solid #E2E8F0',
    cursor: 'pointer'
  };

  const checkboxStyle = {
    width: '20px',
    height: '20px',
    accentColor: '#2563EB'
  };

  const buttonRowStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    marginTop: '24px'
  };

  const primaryBtnStyle = {
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
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const secondaryBtnStyle = {
    padding: '12px 24px',
    backgroundColor: '#F1F5F9',
    color: '#64748B',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50
  };

  const modalContentStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '700px',
    width: '100%',
    margin: '0 16px',
    maxHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  };

  const badgeStyle = (bg, text) => ({
    display: 'inline-block',
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: '500',
    backgroundColor: bg,
    color: text,
    borderRadius: '6px',
    marginRight: '8px'
  });

  return (
    <Layout>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h1 style={titleStyle}>{examId ? 'Edit Exam' : 'Create New Exam'}</h1>
          <p style={subtitleStyle}>Fill in the details to {examId ? 'update' : 'create'} an exam</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>Basic Information</h2>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Exam Title</label>
              <input
                type="text"
                style={inputStyle}
                placeholder="Enter exam title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
            <div style={{ ...gridStyle, marginBottom: '16px' }}>
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
                <label style={labelStyle}>Status</label>
                <select
                  style={inputStyle}
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="active">Active</option>
                </select>
              </div>
            </div>
            <div style={fieldGroupStyle}>
              <label style={labelStyle}>Description</label>
              <textarea
                style={textareaStyle}
                placeholder="Brief description of the exam"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <label style={labelStyle}>Instructions</label>
              <textarea
                style={{ ...textareaStyle, minHeight: '120px' }}
                placeholder="Instructions for students taking the exam"
                value={formData.instructions}
                onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              />
            </div>
          </div>

          {/* Schedule & Duration */}
          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>Schedule & Duration</h2>
            <div style={gridStyle}>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Scheduled Date</label>
                <input
                  type="date"
                  style={inputStyle}
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  required
                />
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Duration (minutes)</label>
                <input
                  type="number"
                  style={inputStyle}
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Start Time</label>
                <input
                  type="time"
                  style={inputStyle}
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>End Time</label>
                <input
                  type="time"
                  style={inputStyle}
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Passing Marks (%)</label>
                <input
                  type="number"
                  style={inputStyle}
                  min="0"
                  max="100"
                  value={formData.passingMarks}
                  onChange={(e) => setFormData({ ...formData, passingMarks: parseInt(e.target.value) })}
                />
              </div>
              <div style={fieldGroupStyle}>
                <label style={labelStyle}>Max Attempts</label>
                <input
                  type="number"
                  style={inputStyle}
                  min="1"
                  value={formData.maxAttempts}
                  onChange={(e) => setFormData({ ...formData, maxAttempts: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          {/* Questions */}
          <div style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ ...cardTitleStyle, marginBottom: 0 }}>Questions ({selectedQuestions.length})</h2>
              <button
                type="button"
                onClick={() => setShowQuestionModal(true)}
                style={secondaryBtnStyle}
              >
                Add Questions
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '20px', backgroundColor: '#F8FAFC', borderRadius: '12px' }}>
              <div>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#F59E0B', marginBottom: '4px' }}>{selectedQuestions.length}</p>
                <p style={{ fontSize: '13px', color: '#64748B' }}>Questions</p>
              </div>
              <div style={{ width: '1px', height: '40px', backgroundColor: '#E2E8F0' }}></div>
              <div>
                <p style={{ fontSize: '28px', fontWeight: '700', color: '#10B981', marginBottom: '4px' }}>{calculateTotalMarks()}</p>
                <p style={{ fontSize: '13px', color: '#64748B' }}>Total Marks</p>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div style={cardStyle}>
            <h2 style={cardTitleStyle}>Settings</h2>
            <div style={gridStyle}>
              <label style={checkboxContainerStyle}>
                <input
                  type="checkbox"
                  style={checkboxStyle}
                  checked={formData.isProctored}
                  onChange={(e) => setFormData({ ...formData, isProctored: e.target.checked })}
                />
                <div>
                  <p style={{ fontWeight: '500', color: '#1E293B', marginBottom: '2px' }}>Enable Proctoring</p>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>Monitor students during exam</p>
                </div>
              </label>
              <label style={checkboxContainerStyle}>
                <input
                  type="checkbox"
                  style={checkboxStyle}
                  checked={formData.shuffleQuestions}
                  onChange={(e) => setFormData({ ...formData, shuffleQuestions: e.target.checked })}
                />
                <div>
                  <p style={{ fontWeight: '500', color: '#1E293B', marginBottom: '2px' }}>Shuffle Questions</p>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>Randomize question order</p>
                </div>
              </label>
              <label style={checkboxContainerStyle}>
                <input
                  type="checkbox"
                  style={checkboxStyle}
                  checked={formData.shuffleOptions}
                  onChange={(e) => setFormData({ ...formData, shuffleOptions: e.target.checked })}
                />
                <div>
                  <p style={{ fontWeight: '500', color: '#1E293B', marginBottom: '2px' }}>Shuffle Options</p>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>Randomize answer options</p>
                </div>
              </label>
              <label style={checkboxContainerStyle}>
                <input
                  type="checkbox"
                  style={checkboxStyle}
                  checked={formData.showResultImmediately}
                  onChange={(e) => setFormData({ ...formData, showResultImmediately: e.target.checked })}
                />
                <div>
                  <p style={{ fontWeight: '500', color: '#1E293B', marginBottom: '2px' }}>Show Results Immediately</p>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>Display score after submission</p>
                </div>
              </label>
            </div>

            {formData.isProctored && (
              <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#FEF3C7', borderRadius: '12px', border: '1px solid #F59E0B' }}>
                <h3 style={{ fontWeight: '600', color: '#D97706', marginBottom: '16px' }}>Proctoring Settings</h3>
                <div style={gridStyle}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      style={{ width: '16px', height: '16px', accentColor: '#2563EB' }}
                      checked={formData.proctoringSettings.browserLockdown}
                      onChange={(e) => setFormData({
                        ...formData,
                        proctoringSettings: { ...formData.proctoringSettings, browserLockdown: e.target.checked }
                      })}
                    />
                    <span style={{ fontSize: '14px', color: '#1E293B' }}>Browser Lockdown</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      style={{ width: '16px', height: '16px', accentColor: '#2563EB' }}
                      checked={formData.proctoringSettings.videoMonitoring}
                      onChange={(e) => setFormData({
                        ...formData,
                        proctoringSettings: { ...formData.proctoringSettings, videoMonitoring: e.target.checked }
                      })}
                    />
                    <span style={{ fontSize: '14px', color: '#1E293B' }}>Video Monitoring</span>
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#1E293B' }}>Tab Switch Limit:</span>
                    <input
                      type="number"
                      style={{ ...inputStyle, width: '80px', padding: '8px 12px' }}
                      min="1"
                      value={formData.proctoringSettings.tabSwitchLimit}
                      onChange={(e) => setFormData({
                        ...formData,
                        proctoringSettings: { ...formData.proctoringSettings, tabSwitchLimit: parseInt(e.target.value) }
                      })}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={buttonRowStyle}>
            <button type="button" onClick={() => navigate('/admin/exams')} style={secondaryBtnStyle}>
              Cancel
            </button>
            <button type="submit" disabled={loading} style={primaryBtnStyle}>
              {loading ? (
                <>
                  <div style={{ width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  Saving...
                </>
              ) : (
                <>
                  {examId ? 'Update Exam' : 'Create Exam'}
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Question Selection Modal */}
        {showQuestionModal && (
          <div style={modalOverlayStyle} onClick={() => setShowQuestionModal(false)}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B' }}>Select Questions</h2>
                <button onClick={() => setShowQuestionModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                  <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '16px' }}>Selected: {selectedQuestions.length} questions</p>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {questions.map((question) => {
                  const isSelected = selectedQuestions.includes(question._id);
                  const diffStyle = getDifficultyStyle(question.difficultyLevel);
                  return (
                    <label
                      key={question._id}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        padding: '16px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.1)' : '#F8FAFC',
                        border: isSelected ? '1px solid #2563EB' : '1px solid #E2E8F0',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input
                        type="checkbox"
                        style={{ ...checkboxStyle, marginTop: '2px' }}
                        checked={isSelected}
                        onChange={() => toggleQuestion(question._id)}
                      />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontWeight: '500', color: '#1E293B', marginBottom: '8px', lineHeight: '1.4' }}>{question.questionText}</p>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={badgeStyle('#F1F5F9', '#475569')}>{question.category}</span>
                          <span style={badgeStyle(diffStyle.bg, diffStyle.text)}>{question.difficultyLevel}</span>
                          <span style={badgeStyle('#DBEAFE', '#1D4ED8')}>{question.marks} marks</span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                <button onClick={() => setShowQuestionModal(false)} style={primaryBtnStyle}>
                  Done ({selectedQuestions.length} selected)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CreateExam;
