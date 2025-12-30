import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../Components/Layout';
import api from '../../Services/api';
import { toast } from 'react-toastify';

const CreateExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(examId);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: 60,
    totalMarks: 100,
    passingScore: 40,
    scheduledDate: '',
    startTime: '09:00',
    endTime: '17:00',
    isProctored: true,
    browserLockdown: false,
    tabSwitchDetection: true,
    shuffleQuestions: false,
    showResults: true,
    status: 'draft'
  });

  useEffect(() => {
    fetchQuestions();
    if (isEdit) fetchExam();
  }, [examId]);

  const fetchQuestions = async () => {
    try {
      const response = await api.get('/questions?limit=200');
      setQuestions(response.data.questions || []);
    } catch (error) {
      toast.error('Failed to fetch questions');
    }
  };

  const fetchExam = async () => {
    try {
      const response = await api.get(`/exams/${examId}`);
      const exam = response.data;
      setFormData({
        title: exam.title,
        description: exam.description || '',
        category: exam.category || '',
        duration: exam.duration,
        totalMarks: exam.totalMarks,
        passingScore: exam.passingScore,
        scheduledDate: exam.scheduledDate?.split('T')[0] || '',
        startTime: exam.startTime || '09:00',
        endTime: exam.endTime || '17:00',
        isProctored: exam.isProctored || false,
        browserLockdown: exam.browserLockdown || false,
        tabSwitchDetection: exam.tabSwitchDetection ?? true,
        shuffleQuestions: exam.shuffleQuestions || false,
        showResults: exam.showResults ?? true,
        status: exam.status || 'draft'
      });
      setSelectedQuestions(exam.questions?.map(q => q._id) || []);
    } catch (error) {
      toast.error('Failed to fetch exam');
      navigate('/admin/exams');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedQuestions.length === 0) {
      toast.error('Please select at least one question');
      setActiveTab('questions');
      return;
    }
    setLoading(true);
    try {
      const payload = { ...formData, questions: selectedQuestions };
      if (isEdit) {
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

  const tabs = [
    { id: 'basic', label: 'Basic Info', step: 1 },
    { id: 'schedule', label: 'Schedule', step: 2 },
    { id: 'questions', label: 'Questions', step: 3 },
    { id: 'settings', label: 'Settings', step: 4 }
  ];

  const currentTabIndex = tabs.findIndex(tab => tab.id === activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;

  const validateCurrentTab = () => {
    if (activeTab === 'basic') {
      if (!formData.title.trim()) {
        toast.error('Please enter exam title');
        return false;
      }
      if (!formData.category.trim()) {
        toast.error('Please enter category');
        return false;
      }
      if (!formData.duration || formData.duration < 1) {
        toast.error('Duration must be at least 1 minute');
        return false;
      }
      if (!formData.totalMarks || formData.totalMarks < 1) {
        toast.error('Total marks must be at least 1');
        return false;
      }
      if (formData.passingScore === '' || formData.passingScore < 0 || formData.passingScore > 100) {
        toast.error('Passing score must be between 0 and 100');
        return false;
      }
    }
    if (activeTab === 'schedule') {
      if (!formData.scheduledDate) {
        toast.error('Please select a scheduled date');
        return false;
      }
    }
    if (activeTab === 'questions') {
      if (selectedQuestions.length === 0) {
        toast.error('Please select at least one question');
        return false;
      }
    }
    return true;
  };

  const goToNextTab = (e) => {
    if (e) e.preventDefault();
    if (validateCurrentTab()) {
      const nextIndex = currentTabIndex + 1;
      if (nextIndex < tabs.length) {
        setActiveTab(tabs[nextIndex].id);
      }
    }
  };

  const goToPreviousTab = (e) => {
    if (e) e.preventDefault();
    const prevIndex = currentTabIndex - 1;
    if (prevIndex >= 0) {
      setActiveTab(tabs[prevIndex].id);
    }
  };

  const goToTab = (tabId) => {
    const targetIndex = tabs.findIndex(tab => tab.id === tabId);
    // Allow going back without validation, but validate when going forward
    if (targetIndex < currentTabIndex) {
      setActiveTab(tabId);
    } else if (targetIndex > currentTabIndex) {
      // Validate all tabs before the target
      let canProceed = true;
      for (let i = currentTabIndex; i < targetIndex; i++) {
        setActiveTab(tabs[i].id);
        if (!validateCurrentTab()) {
          canProceed = false;
          break;
        }
      }
      if (canProceed) {
        setActiveTab(tabId);
      }
    }
  };

  return (
    <Layout>
      <div className="animate-fade-in max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            {isEdit ? 'Edit Exam' : 'Create Exam'}
          </h1>
          <p className="text-sm text-text-muted">
            {isEdit ? 'Update exam details and settings' : 'Set up a new assessment'}
          </p>
        </div>

        {/* Step Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {tabs.map((tab, index) => (
              <div key={tab.id} className="flex items-center flex-1">
                <button
                  type="button"
                  onClick={() => goToTab(tab.id)}
                  className={`flex items-center gap-2 ${
                    index <= currentTabIndex ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/30'
                      : index < currentTabIndex
                      ? 'bg-success text-white'
                      : 'bg-surface-secondary text-text-muted'
                  }`}>
                    {index < currentTabIndex ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      tab.step
                    )}
                  </div>
                  <span className={`hidden sm:block text-sm font-medium ${
                    activeTab === tab.id ? 'text-primary' : 'text-text-muted'
                  }`}>
                    {tab.label}
                  </span>
                </button>
                {index < tabs.length - 1 && (
                  <div className={`flex-1 h-1 mx-3 rounded-full transition-colors ${
                    index < currentTabIndex ? 'bg-success' : 'bg-surface-secondary'
                  }`} />
                )}
              </div>
            ))}
          </div>
          {/* Mobile tab label */}
          <p className="sm:hidden text-center text-sm font-medium text-text-primary">
            Step {currentTabIndex + 1}: {tabs[currentTabIndex].label}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {activeTab === 'basic' && (
            <div className="card">
              <div className="flex flex-col gap-5">
                <div className="form-group">
                  <label className="label">Exam Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Introduction to Programming"
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the exam..."
                    className="textarea"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="label">Category</label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Computer Science"
                      className="input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="select"
                    >
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="active">Active</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="form-group">
                    <label className="label">Duration (minutes)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value === '' ? '' : parseInt(e.target.value) || 0 })}
                      className="input"
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Total Marks</label>
                    <input
                      type="number"
                      value={formData.totalMarks}
                      onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value === '' ? '' : parseInt(e.target.value) || 0 })}
                      className="input"
                      min="1"
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Passing Score (%)</label>
                    <input
                      type="number"
                      value={formData.passingScore}
                      onChange={(e) => setFormData({ ...formData, passingScore: e.target.value === '' ? '' : parseInt(e.target.value) || 0 })}
                      className="input"
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="card">
              <div className="flex flex-col gap-5">
                <div className="form-group">
                  <label className="label">Scheduled Date</label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="input"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label className="label">Start Time</label>
                    <div className="flex gap-2 items-center">
                      <select
                        value={formData.startTime.split(':')[0]}
                        onChange={(e) => {
                          const minutes = formData.startTime.split(':')[1] || '00';
                          setFormData({ ...formData, startTime: `${e.target.value}:${minutes}` });
                        }}
                        className="select flex-1"
                      >
                        {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(hour => (
                          <option key={hour} value={hour}>{hour}</option>
                        ))}
                      </select>
                      <span className="text-text-primary font-bold text-lg">:</span>
                      <select
                        value={formData.startTime.split(':')[1] || '00'}
                        onChange={(e) => {
                          const hours = formData.startTime.split(':')[0] || '09';
                          setFormData({ ...formData, startTime: `${hours}:${e.target.value}` });
                        }}
                        className="select flex-1"
                      >
                        {['00', '15', '30', '45'].map(minute => (
                          <option key={minute} value={minute}>{minute}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="label">End Time</label>
                    <div className="flex gap-2 items-center">
                      <select
                        value={formData.endTime.split(':')[0]}
                        onChange={(e) => {
                          const minutes = formData.endTime.split(':')[1] || '00';
                          setFormData({ ...formData, endTime: `${e.target.value}:${minutes}` });
                        }}
                        className="select flex-1"
                      >
                        {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0')).map(hour => (
                          <option key={hour} value={hour}>{hour}</option>
                        ))}
                      </select>
                      <span className="text-text-primary font-bold text-lg">:</span>
                      <select
                        value={formData.endTime.split(':')[1] || '00'}
                        onChange={(e) => {
                          const hours = formData.endTime.split(':')[0] || '17';
                          setFormData({ ...formData, endTime: `${hours}:${e.target.value}` });
                        }}
                        className="select flex-1"
                      >
                        {['00', '15', '30', '45'].map(minute => (
                          <option key={minute} value={minute}>{minute}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-text-muted">
                  Time is in 24-hour format. Students can take the exam between start and end time on the scheduled date.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-text-muted">
                  {selectedQuestions.length} question{selectedQuestions.length !== 1 ? 's' : ''} selected
                </p>
              </div>
              <div className="flex flex-col gap-3 max-h-[500px] overflow-y-auto">
                {questions.map((question) => (
                  <label
                    key={question._id}
                    className={`flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-colors ${
                      selectedQuestions.includes(question._id)
                        ? 'bg-primary/10 border-2 border-primary'
                        : 'bg-surface border-2 border-transparent hover:bg-surface-secondary'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question._id)}
                      onChange={() => toggleQuestion(question._id)}
                      className="checkbox mt-1"
                    />
                    <div className="flex-1">
                      <p className="text-text-primary font-medium">{question.questionText}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="badge-info">{question.questionType}</span>
                        <span className="badge-neutral">{question.category}</span>
                        <span className="badge-warning">{question.marks} marks</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card">
              <div className="flex flex-col gap-4">
                {[
                  { key: 'isProctored', label: 'Enable Proctoring', desc: 'Monitor students via webcam during exam' },
                  { key: 'browserLockdown', label: 'Browser Lockdown', desc: 'Prevent students from opening other tabs' },
                  { key: 'tabSwitchDetection', label: 'Tab Switch Detection', desc: 'Log when students switch tabs' },
                  { key: 'shuffleQuestions', label: 'Shuffle Questions', desc: 'Randomize question order for each student' },
                  { key: 'showResults', label: 'Show Results', desc: 'Allow students to view results after submission' }
                ].map((setting) => (
                  <label key={setting.key} className="flex items-center justify-between p-4 bg-surface rounded-xl cursor-pointer hover:bg-surface-secondary transition-colors">
                    <div>
                      <p className="font-medium text-text-primary">{setting.label}</p>
                      <p className="text-sm text-text-muted">{setting.desc}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={formData[setting.key]}
                      onChange={(e) => setFormData({ ...formData, [setting.key]: e.target.checked })}
                      className="checkbox"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={() => navigate('/admin/exams')}
              className="btn-ghost text-text-muted hover:text-text-primary"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>

            <div className="flex gap-3">
              {!isFirstTab && (
                <button
                  type="button"
                  onClick={(e) => goToPreviousTab(e)}
                  className="btn-secondary"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
              )}

              {isLastTab ? (
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      {isEdit ? 'Update Exam' : 'Create Exam'}
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={(e) => goToNextTab(e)}
                  className="btn-primary"
                >
                  Next
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateExam;
