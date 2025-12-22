import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../Services/api';
import { toast } from 'react-toastify';

const ExamInstructions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checks, setChecks] = useState({
    browser: false,
    camera: false,
    fullscreen: false,
    notifications: false
  });

  useEffect(() => {
    fetchExam();
    runSystemChecks();
  }, [examId]);

  const fetchExam = async () => {
    try {
      const response = await api.get(`/exams/${examId}`);
      setExam(response.data);
    } catch (error) {
      toast.error('Failed to load exam');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const runSystemChecks = async () => {
    setChecks(prev => ({ ...prev, browser: true }));
    
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      setChecks(prev => ({ ...prev, camera: true }));
    } catch (e) {
      setChecks(prev => ({ ...prev, camera: false }));
    }

    if (document.fullscreenEnabled) {
      setChecks(prev => ({ ...prev, fullscreen: true }));
    }

    if ('Notification' in window) {
      setChecks(prev => ({ ...prev, notifications: true }));
    }
  };

  const handleStartExam = async () => {
    if (exam?.isProctored && !checks.camera) {
      toast.error('Camera access is required for proctored exams');
      return;
    }

    try {
      await api.post(`/exams/${examId}/start`);
      navigate(`/exam/${examId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start exam');
    }
  };

  const allChecksPassed = Object.values(checks).every(Boolean) || !exam?.isProctored;

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">{exam?.title}</h1>
          <p className="text-text-muted">Please read the instructions carefully before starting</p>
        </div>

        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Exam Details</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-surface rounded-xl text-center">
              <p className="text-2xl font-bold text-primary">{exam?.duration}</p>
              <p className="text-sm text-text-muted">Minutes</p>
            </div>
            <div className="p-4 bg-surface rounded-xl text-center">
              <p className="text-2xl font-bold text-success">{exam?.questions?.length}</p>
              <p className="text-sm text-text-muted">Questions</p>
            </div>
            <div className="p-4 bg-surface rounded-xl text-center">
              <p className="text-2xl font-bold text-warning">{exam?.totalMarks}</p>
              <p className="text-sm text-text-muted">Total Marks</p>
            </div>
            <div className="p-4 bg-surface rounded-xl text-center">
              <p className="text-2xl font-bold text-error">{exam?.passingScore}%</p>
              <p className="text-sm text-text-muted">Passing Score</p>
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Instructions</h2>
          <ul className="flex flex-col gap-3">
            {[
              'Read each question carefully before answering.',
              'You can navigate between questions using the navigation panel.',
              'Your progress is automatically saved.',
              'Once submitted, you cannot change your answers.',
              'The exam will auto-submit when time runs out.',
              exam?.isProctored && 'Keep your camera on throughout the exam.',
              exam?.isProctored && 'Do not switch tabs or windows during the exam.',
              'Use of external resources is prohibited unless specified.'
            ].filter(Boolean).map((instruction, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-xs font-semibold text-primary">{idx + 1}</span>
                </div>
                <span className="text-text-secondary">{instruction}</span>
              </li>
            ))}
          </ul>
        </div>

        {exam?.isProctored && (
          <div className="card mb-6">
            <h2 className="text-lg font-semibold text-text-primary mb-4">System Requirements</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { key: 'browser', label: 'Browser Compatible', icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' },
                { key: 'camera', label: 'Camera Access', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
                { key: 'fullscreen', label: 'Fullscreen Mode', icon: 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' },
                { key: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' }
              ].map((check) => (
                <div key={check.key} className={`p-4 rounded-xl flex items-center gap-3 ${
                  checks[check.key] ? 'bg-success-light' : 'bg-error-light'
                }`}>
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    checks[check.key] ? 'bg-success text-white' : 'bg-error text-white'
                  }`}>
                    {checks[check.key] ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">{check.label}</p>
                    <p className={`text-xs ${checks[check.key] ? 'text-success-dark' : 'text-error-dark'}`}>
                      {checks[check.key] ? 'Ready' : 'Not Available'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary"
          >
            Go Back
          </button>
          <button
            onClick={handleStartExam}
            disabled={!allChecksPassed}
            className="btn-primary"
          >
            Start Exam
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamInstructions;
