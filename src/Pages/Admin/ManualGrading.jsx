import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../Components/Layout';
import api from '../../Services/api';
import { toast } from 'react-toastify';

const ManualGrading = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [grades, setGrades] = useState({});
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    fetchResult();
  }, [resultId]);

  const fetchResult = async () => {
    try {
      const response = await api.get(`/results/${resultId}`);
      setResult(response.data);
      setFeedback(response.data.feedback || '');
      const initialGrades = {};
      response.data.answers.forEach(answer => {
        if (answer.question?.questionType === 'short_answer') {
          initialGrades[answer._id] = {
            marks: answer.marksObtained || 0,
            isCorrect: answer.isCorrect || false
          };
        }
      });
      setGrades(initialGrades);
    } catch (error) {
      toast.error('Failed to load result');
      navigate('/admin/grading');
    } finally {
      setLoading(false);
    }
  };

  const handleGradeChange = (answerId, field, value) => {
    setGrades(prev => ({
      ...prev,
      [answerId]: { ...prev[answerId], [field]: value }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const gradesList = Object.entries(grades).map(([answerId, grade]) => ({
        answerId,
        marks: parseFloat(grade.marks) || 0,
        isCorrect: grade.isCorrect
      }));
      await api.put(`/results/${resultId}/bulk-grade`, { grades: gradesList, feedback });
      toast.success('Grades saved successfully');
      navigate('/admin/grading');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save grades');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  const shortAnswerQuestions = result?.answers?.filter(a => a.question?.questionType === 'short_answer') || [];

  return (
    <Layout>
      <div className="animate-fade-in">
        <Link to="/admin/grading" className="inline-flex items-center gap-2 text-text-muted text-sm mb-4 no-underline hover:text-text-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Pending Grading
        </Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Manual Grading</h1>
          <p className="text-sm text-text-muted">
            Grade short answer responses for {result?.student?.firstName} {result?.student?.lastName}
          </p>
        </div>

        <div className="card mb-6">
          <div className="flex flex-wrap gap-6">
            <div>
              <span className="text-xs text-text-muted block">Student</span>
              <span className="font-semibold text-text-primary">{result?.student?.firstName} {result?.student?.lastName}</span>
            </div>
            <div>
              <span className="text-xs text-text-muted block">Email</span>
              <span className="font-semibold text-text-primary">{result?.student?.email}</span>
            </div>
            <div>
              <span className="text-xs text-text-muted block">Exam</span>
              <span className="font-semibold text-text-primary">{result?.exam?.title}</span>
            </div>
            <div>
              <span className="text-xs text-text-muted block">Current Score</span>
              <span className="font-semibold text-text-primary">{result?.obtainedMarks}/{result?.totalMarks} ({Number(result?.percentage || 0).toFixed(1)}%)</span>
            </div>
            <div>
              <span className="text-xs text-text-muted block">Status</span>
              <span className={`badge ${result?.status === 'evaluated' ? 'badge-success' : 'badge-warning'}`}>
                {result?.status}
              </span>
            </div>
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-5">Short Answer Responses ({shortAnswerQuestions.length})</h2>
          {shortAnswerQuestions.length === 0 ? (
            <div className="text-center py-10 bg-surface rounded-xl">
              <p className="text-text-muted">No short answer questions to grade.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {shortAnswerQuestions.map((answer, index) => (
                <div key={answer._id} className="border border-border rounded-xl overflow-hidden">
                  <div className="bg-surface-secondary p-4 border-b border-border flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-semibold text-sm">{index + 1}</span>
                      <span className="badge-info">Short Answer</span>
                    </div>
                    <span className="text-sm text-text-muted">Max Marks: {answer.question?.marks}</span>
                  </div>
                  <div className="p-5">
                    <p className="text-text-primary mb-4 leading-relaxed">{answer.question?.questionText}</p>
                    <div className="bg-info-light border border-info rounded-lg p-4 mb-4">
                      <label className="text-xs font-semibold text-info-dark block mb-2">Student's Answer:</label>
                      <p className="text-text-primary whitespace-pre-wrap">
                        {answer.selectedOption || <em className="text-text-light">No answer provided</em>}
                      </p>
                    </div>
                    {answer.question?.explanation && (
                      <div className="bg-success-light border border-success rounded-lg p-4 mb-4">
                        <label className="text-xs font-semibold text-success-dark block mb-2">Reference/Explanation:</label>
                        <p className="text-text-primary">{answer.question.explanation}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-6 p-4 bg-surface rounded-lg">
                      <div>
                        <label className="text-xs font-semibold text-text-secondary block mb-1.5">Marks Awarded</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max={answer.question?.marks}
                            step="0.5"
                            value={grades[answer._id]?.marks || 0}
                            onChange={(e) => handleGradeChange(answer._id, 'marks', e.target.value)}
                            className="input w-20"
                          />
                          <span className="text-text-muted">/ {answer.question?.marks}</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-text-secondary block mb-1.5">Status</label>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              handleGradeChange(answer._id, 'isCorrect', true);
                              handleGradeChange(answer._id, 'marks', answer.question?.marks);
                            }}
                            className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors border-none cursor-pointer ${
                              grades[answer._id]?.isCorrect ? 'bg-success text-white' : 'bg-border text-text-muted'
                            }`}
                          >
                            Correct
                          </button>
                          <button
                            onClick={() => handleGradeChange(answer._id, 'isCorrect', false)}
                            className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors border-none cursor-pointer ${
                              !grades[answer._id]?.isCorrect ? 'bg-error text-white' : 'bg-border text-text-muted'
                            }`}
                          >
                            Incorrect/Partial
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Feedback for Student</h2>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Add feedback for the student (optional)..."
            rows={4}
            className="textarea"
          />
        </div>

        <div className="flex gap-3">
          <button onClick={() => navigate('/admin/grading')} className="btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving} className="btn-success flex-[2]">
            {saving ? 'Saving...' : 'Save Grades'}
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ManualGrading;
