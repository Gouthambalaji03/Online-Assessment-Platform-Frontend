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

  return (
    <Layout>
      <div className="animate-fadeIn max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{examId ? 'Edit Exam' : 'Create New Exam'}</h1>
          <p className="text-gray-400">Fill in the details to {examId ? 'update' : 'create'} an exam</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Exam Title</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter exam title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
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
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  className="input-field min-h-20"
                  placeholder="Brief description of the exam"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Instructions</label>
                <textarea
                  className="input-field min-h-24"
                  placeholder="Instructions for students taking the exam"
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Schedule & Duration</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Scheduled Date</label>
                <input
                  type="date"
                  className="input-field"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  className="input-field"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Start Time</label>
                <input
                  type="time"
                  className="input-field"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">End Time</label>
                <input
                  type="time"
                  className="input-field"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Passing Marks (%)</label>
                <input
                  type="number"
                  className="input-field"
                  min="0"
                  max="100"
                  value={formData.passingMarks}
                  onChange={(e) => setFormData({ ...formData, passingMarks: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Max Attempts</label>
                <input
                  type="number"
                  className="input-field"
                  min="1"
                  value={formData.maxAttempts}
                  onChange={(e) => setFormData({ ...formData, maxAttempts: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Questions ({selectedQuestions.length})</h2>
              <button
                type="button"
                onClick={() => setShowQuestionModal(true)}
                className="btn-secondary text-sm"
              >
                Add Questions
              </button>
            </div>
            <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg">
              <div>
                <p className="text-2xl font-bold text-orange-400">{selectedQuestions.length}</p>
                <p className="text-sm text-gray-400">Questions</p>
              </div>
              <div className="w-px h-10 bg-slate-700"></div>
              <div>
                <p className="text-2xl font-bold text-green-400">{calculateTotalMarks()}</p>
                <p className="text-sm text-gray-400">Total Marks</p>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="text-lg font-semibold mb-4">Settings</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500"
                  checked={formData.isProctored}
                  onChange={(e) => setFormData({ ...formData, isProctored: e.target.checked })}
                />
                <div>
                  <p className="font-medium">Enable Proctoring</p>
                  <p className="text-sm text-gray-400">Monitor students during exam</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500"
                  checked={formData.shuffleQuestions}
                  onChange={(e) => setFormData({ ...formData, shuffleQuestions: e.target.checked })}
                />
                <div>
                  <p className="font-medium">Shuffle Questions</p>
                  <p className="text-sm text-gray-400">Randomize question order</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500"
                  checked={formData.shuffleOptions}
                  onChange={(e) => setFormData({ ...formData, shuffleOptions: e.target.checked })}
                />
                <div>
                  <p className="font-medium">Shuffle Options</p>
                  <p className="text-sm text-gray-400">Randomize answer options</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-orange-500 focus:ring-orange-500"
                  checked={formData.showResultImmediately}
                  onChange={(e) => setFormData({ ...formData, showResultImmediately: e.target.checked })}
                />
                <div>
                  <p className="font-medium">Show Results Immediately</p>
                  <p className="text-sm text-gray-400">Display score after submission</p>
                </div>
              </label>
            </div>

            {formData.isProctored && (
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <h3 className="font-medium text-yellow-400 mb-3">Proctoring Settings</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded"
                      checked={formData.proctoringSettings.browserLockdown}
                      onChange={(e) => setFormData({
                        ...formData,
                        proctoringSettings: { ...formData.proctoringSettings, browserLockdown: e.target.checked }
                      })}
                    />
                    <span className="text-sm">Browser Lockdown</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded"
                      checked={formData.proctoringSettings.videoMonitoring}
                      onChange={(e) => setFormData({
                        ...formData,
                        proctoringSettings: { ...formData.proctoringSettings, videoMonitoring: e.target.checked }
                      })}
                    />
                    <span className="text-sm">Video Monitoring</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Tab Switch Limit:</span>
                    <input
                      type="number"
                      className="input-field w-20 py-1"
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

          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/admin/exams')} className="btn-secondary">
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
                  {examId ? 'Update Exam' : 'Create Exam'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        {showQuestionModal && (
          <div className="modal-overlay" onClick={() => setShowQuestionModal(false)}>
            <div className="modal-content max-w-3xl max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Select Questions</h2>
                <button onClick={() => setShowQuestionModal(false)} className="text-gray-400 hover:text-white">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-4">Selected: {selectedQuestions.length} questions</p>
              <div className="flex-1 overflow-y-auto space-y-2">
                {questions.map((question) => (
                  <label
                    key={question._id}
                    className={`flex items-start gap-3 p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedQuestions.includes(question._id)
                        ? 'bg-orange-500/20 border border-orange-500/50'
                        : 'bg-slate-800/50 border border-transparent hover:bg-slate-700/50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="w-5 h-5 mt-1 rounded"
                      checked={selectedQuestions.includes(question._id)}
                      onChange={() => toggleQuestion(question._id)}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{question.questionText}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 rounded bg-slate-700">{question.category}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          question.difficultyLevel === 'easy' ? 'bg-green-500/20 text-green-400' :
                          question.difficultyLevel === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>{question.difficultyLevel}</span>
                        <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">{question.marks} marks</span>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex justify-end mt-4 pt-4 border-t border-white/10">
                <button onClick={() => setShowQuestionModal(false)} className="btn-primary">
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

