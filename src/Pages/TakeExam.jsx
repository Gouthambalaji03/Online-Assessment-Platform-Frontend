import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../Services/api';
import { toast } from 'react-toastify';
import VideoProctor from '../Components/VideoProctor';

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [exam, setExam] = useState(null);
  const [showVideoProctor, setShowVideoProctor] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [resultId, setResultId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [flagged, setFlagged] = useState(new Set());
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    startExam();
  }, [examId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && exam) {
      handleSubmit();
    }
  }, [timeLeft, exam]);

  useEffect(() => {
    if (exam?.isProctored) {
      const handleVisibilityChange = () => {
        if (document.hidden) {
          setTabSwitchCount(prev => {
            const newCount = prev + 1;
            logProctoringEvent('tab_switch', `Tab switch detected (${newCount})`);
            if (newCount >= (exam.proctoringSettings?.tabSwitchLimit || 3)) {
              toast.error('Maximum tab switches reached. Exam will be submitted.');
              handleSubmit();
            } else {
              setShowWarning(true);
              setTimeout(() => setShowWarning(false), 3000);
            }
            return newCount;
          });
        }
      };

      const handleContextMenu = (e) => {
        e.preventDefault();
        logProctoringEvent('right_click', 'Right-click attempt detected');
      };

      const handleCopy = (e) => {
        e.preventDefault();
        logProctoringEvent('copy_paste', 'Copy attempt detected');
      };

      document.addEventListener('visibilitychange', handleVisibilityChange);
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('copy', handleCopy);

      return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('copy', handleCopy);
      };
    }
  }, [exam]);

  const startExam = async () => {
    try {
      const response = await api.post(`/exams/${examId}/start`);
      setExam(response.data.exam);
      setQuestions(response.data.questions);
      setResultId(response.data.resultId);
      setTimeLeft(response.data.exam.duration * 60);
      
      if (response.data.exam.isProctored) {
        logProctoringEvent('exam_started', 'Exam session started');
        if (response.data.exam.proctoringSettings?.videoMonitoring) {
          setShowVideoProctor(true);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to start exam');
      navigate('/my-exams');
    } finally {
      setLoading(false);
    }
  };

  const logProctoringEvent = async (eventType, description) => {
    try {
      await api.post('/proctoring/log', {
        examId,
        resultId,
        eventType,
        description,
        severity: eventType === 'tab_switch' ? 'medium' : 'low'
      });
    } catch (error) {
      console.error('Failed to log proctoring event:', error);
    }
  };

  const handleAnswer = (questionId, selectedOption) => {
    setAnswers(prev => ({ ...prev, [questionId]: selectedOption }));
    
    api.post(`/exams/answer/${resultId}`, {
      questionId,
      selectedOption
    }).catch(err => console.error('Failed to save answer:', err));
  };

  const toggleFlag = (index) => {
    setFlagged(prev => {
      const newFlagged = new Set(prev);
      if (newFlagged.has(index)) {
        newFlagged.delete(index);
      } else {
        newFlagged.add(index);
      }
      return newFlagged;
    });
  };

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    // Stop the camera before submitting
    setShowVideoProctor(false);

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption
      }));

      const response = await api.post(`/exams/submit/${resultId}`, { answers: formattedAnswers });

      if (exam?.isProctored) {
        await logProctoringEvent('exam_submitted', 'Exam submitted successfully');
      }

      toast.success('Exam submitted successfully!');
      navigate('/results', { state: { result: response.data.result } });
    } catch (error) {
      toast.error('Failed to submit exam');
      setSubmitting(false);
      // Re-enable camera if submission failed and exam is proctored
      if (exam?.isProctored && exam?.proctoringSettings?.videoMonitoring) {
        setShowVideoProctor(true);
      }
    }
  };

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerClass = () => {
    if (timeLeft <= 60) return 'exam-timer danger';
    if (timeLeft <= 300) return 'exam-timer warning';
    return 'exam-timer';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-text-muted">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-error/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">No Questions Available</h2>
          <p className="text-text-muted mb-6">This exam does not have any questions yet.</p>
          <button
            onClick={() => navigate('/my-exams')}
            className="btn-primary"
          >
            Go Back to My Exams
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-surface">
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
      </div>

      {showWarning && (
        <div className="proctoring-warning flex items-center gap-3 text-error">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-semibold text-text-primary">Warning: Tab Switch Detected</p>
            <p className="text-sm text-text-muted">Switches remaining: {(exam?.proctoringSettings?.tabSwitchLimit || 3) - tabSwitchCount}</p>
          </div>
        </div>
      )}

      <header className="fixed top-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">{exam?.title}</h1>
            <p className="text-sm text-text-muted">Question {currentQuestion + 1} of {questions.length}</p>
          </div>
          <div className="flex items-center gap-4">
            {exam?.isProctored && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-error animate-pulse"></div>
                <span className="text-text-muted font-medium">Proctored</span>
              </div>
            )}
            <div className={getTimerClass()}>
              {formatTime(timeLeft)}
            </div>
          </div>
        </div>
      </header>

      <div className="pt-20 pb-24 px-4 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="question-card">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {currentQuestion + 1}
                  </span>
                  <div>
                    <span className={`badge ${
                      currentQ?.questionType === 'mcq' ? 'badge-info' : 'badge-success'
                    }`}>
                      {currentQ?.questionType === 'mcq' ? 'Multiple Choice' : 'True/False'}
                    </span>
                    <p className="text-sm text-text-muted mt-1">{currentQ?.marks} mark(s)</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleFlag(currentQuestion)}
                  className={`p-2 rounded-lg transition-colors border-none cursor-pointer ${
                    flagged.has(currentQuestion) 
                      ? 'bg-warning-light text-warning' 
                      : 'bg-surface-secondary text-text-muted hover:text-warning'
                  }`}
                >
                  <svg className="w-5 h-5" fill={flagged.has(currentQuestion) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                  </svg>
                </button>
              </div>

              <h2 className="text-xl text-text-primary mb-8 leading-relaxed">{currentQ?.questionText}</h2>

              <div className="flex flex-col gap-3">
                {currentQ?.questionType === 'mcq' ? (
                  currentQ?.options.map((option, idx) => (
                    <button
                      key={option._id}
                      onClick={() => handleAnswer(currentQ._id, option._id)}
                      className={`option-btn ${answers[currentQ._id] === option._id ? 'selected' : ''}`}
                    >
                      <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                      <span>{option.optionText}</span>
                    </button>
                  ))
                ) : (
                  ['True', 'False'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleAnswer(currentQ._id, opt.toLowerCase())}
                      className={`option-btn ${answers[currentQ._id] === opt.toLowerCase() ? 'selected' : ''}`}
                    >
                      <span className={`option-letter ${opt === 'True' ? 'text-success' : 'text-error'}`}>
                        {opt === 'True' ? '✓' : '✗'}
                      </span>
                      <span>{opt}</span>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <button
                onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                disabled={currentQuestion === 0}
                className="btn-secondary disabled:opacity-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-success"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Exam
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestion(Math.min(questions.length - 1, currentQuestion + 1))}
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

          <div className="glass-card p-4 h-fit sticky top-24">
            {showVideoProctor && (
              <div className="mb-4">
                <VideoProctor
                  examId={examId}
                  resultId={resultId}
                  isActive={showVideoProctor}
                  onViolation={(violation) => {
                    toast.warning(`Proctoring alert: ${violation.description}`);
                  }}
                />
              </div>
            )}

            <h3 className="font-semibold text-text-primary mb-4">Question Navigator</h3>
            <div className="grid grid-cols-5 gap-2">
              {questions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`question-nav-btn ${
                    idx === currentQuestion ? 'current' : 
                    flagged.has(idx) ? 'flagged' :
                    answers[q._id] ? 'answered' : ''
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-success"></span>
                <span className="text-text-muted">Answered ({Object.keys(answers).length})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded bg-warning"></span>
                <span className="text-text-muted">Flagged ({flagged.size})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded border border-border bg-card"></span>
                <span className="text-text-muted">Unanswered ({questions.length - Object.keys(answers).length})</span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary w-full mt-6"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TakeExam;
