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
    isProctored: false,
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
    { id: 'basic', label: 'Basic Info' },
    { id: 'schedule', label: 'Schedule' },
    { id: 'questions', label: 'Questions' },
    { id: 'settings', label: 'Settings' }
  ];

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

        <div className="tab-group mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
              {tab.id === 'questions' && selectedQuestions.length > 0 && (
                <span className="ml-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                  {selectedQuestions.length}
                </span>
              )}
            </button>
          ))}
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
                    required
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
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="input"
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Total Marks</label>
                    <input
                      type="number"
                      value={formData.totalMarks}
                      onChange={(e) => setFormData({ ...formData, totalMarks: parseInt(e.target.value) })}
                      className="input"
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Passing Score (%)</label>
                    <input
                      type="number"
                      value={formData.passingScore}
                      onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                      className="input"
                      min="0"
                      max="100"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="card">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="form-group">
                  <label className="label">Scheduled Date</label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    className="input"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="label">Start Time</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">End Time</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="input"
                  />
                </div>
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

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/admin/exams')}
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
                isEdit ? 'Update Exam' : 'Create Exam'
              )}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateExam;
