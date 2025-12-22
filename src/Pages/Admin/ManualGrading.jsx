import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../Services/api';
import { toast } from 'react-toastify';
import Sidebar from '../../Components/Sidebar';

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

      // Initialize grades from existing data
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
      [answerId]: {
        ...prev[answerId],
        [field]: value
      }
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

      await api.put(`/results/${resultId}/bulk-grade`, {
        grades: gradesList,
        feedback
      });

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
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
        <Sidebar role="admin" />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{
            width: '48px',
            height: '48px',
            border: '4px solid #E2E8F0',
            borderTopColor: '#3B82F6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      </div>
    );
  }

  const shortAnswerQuestions = result?.answers?.filter(
    a => a.question?.questionType === 'short_answer'
  ) || [];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Sidebar role="admin" />
      <main style={{ flex: 1, padding: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <Link
            to="/admin/grading"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              color: '#64748B',
              textDecoration: 'none',
              fontSize: '14px',
              marginBottom: '16px'
            }}
          >
            <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Pending Grading
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>
            Manual Grading
          </h1>
          <p style={{ color: '#64748B' }}>
            Grade short answer responses for {result?.student?.firstName} {result?.student?.lastName}
          </p>
        </div>

        {/* Student & Exam Info */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          <div>
            <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Student</span>
            <span style={{ fontWeight: '600', color: '#1E293B' }}>
              {result?.student?.firstName} {result?.student?.lastName}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Email</span>
            <span style={{ fontWeight: '600', color: '#1E293B' }}>{result?.student?.email}</span>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Exam</span>
            <span style={{ fontWeight: '600', color: '#1E293B' }}>{result?.exam?.title}</span>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Current Score</span>
            <span style={{ fontWeight: '600', color: '#1E293B' }}>
              {result?.obtainedMarks}/{result?.totalMarks} ({result?.percentage?.toFixed(1)}%)
            </span>
          </div>
          <div>
            <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Status</span>
            <span style={{
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: '500',
              backgroundColor: result?.status === 'evaluated' ? '#D1FAE5' : '#FEF3C7',
              color: result?.status === 'evaluated' ? '#065F46' : '#92400E'
            }}>
              {result?.status}
            </span>
          </div>
        </div>

        {/* Short Answer Questions */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1E293B', marginBottom: '20px' }}>
            Short Answer Responses ({shortAnswerQuestions.length})
          </h2>

          {shortAnswerQuestions.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: '#F8FAFC',
              borderRadius: '8px'
            }}>
              <p style={{ color: '#64748B' }}>No short answer questions to grade.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {shortAnswerQuestions.map((answer, index) => (
                <div
                  key={answer._id}
                  style={{
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}
                >
                  {/* Question Header */}
                  <div style={{
                    backgroundColor: '#F8FAFC',
                    padding: '16px',
                    borderBottom: '1px solid #E2E8F0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        backgroundColor: '#3B82F6',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '600',
                        fontSize: '14px'
                      }}>
                        {index + 1}
                      </span>
                      <span style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: '#E0E7FF',
                        color: '#3730A3'
                      }}>
                        Short Answer
                      </span>
                    </div>
                    <span style={{ fontSize: '14px', color: '#64748B' }}>
                      Max Marks: {answer.question?.marks}
                    </span>
                  </div>

                  {/* Question Content */}
                  <div style={{ padding: '20px' }}>
                    <p style={{
                      fontSize: '16px',
                      color: '#1E293B',
                      marginBottom: '16px',
                      lineHeight: '1.6'
                    }}>
                      {answer.question?.questionText}
                    </p>

                    {/* Student's Answer */}
                    <div style={{
                      backgroundColor: '#F0F9FF',
                      border: '1px solid #BAE6FD',
                      borderRadius: '8px',
                      padding: '16px',
                      marginBottom: '16px'
                    }}>
                      <label style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: '600',
                        color: '#0369A1',
                        marginBottom: '8px'
                      }}>
                        Student's Answer:
                      </label>
                      <p style={{ color: '#1E293B', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                        {answer.selectedOption || <em style={{ color: '#94A3B8' }}>No answer provided</em>}
                      </p>
                    </div>

                    {/* Expected Answer (if available) */}
                    {answer.question?.explanation && (
                      <div style={{
                        backgroundColor: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                        borderRadius: '8px',
                        padding: '16px',
                        marginBottom: '16px'
                      }}>
                        <label style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#166534',
                          marginBottom: '8px'
                        }}>
                          Reference/Explanation:
                        </label>
                        <p style={{ color: '#1E293B', lineHeight: '1.6' }}>
                          {answer.question.explanation}
                        </p>
                      </div>
                    )}

                    {/* Grading Controls */}
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '24px',
                      padding: '16px',
                      backgroundColor: '#F8FAFC',
                      borderRadius: '8px'
                    }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#475569',
                          marginBottom: '6px'
                        }}>
                          Marks Awarded
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <input
                            type="number"
                            min="0"
                            max={answer.question?.marks}
                            step="0.5"
                            value={grades[answer._id]?.marks || 0}
                            onChange={(e) => handleGradeChange(answer._id, 'marks', e.target.value)}
                            style={{
                              width: '80px',
                              padding: '8px 12px',
                              border: '1px solid #E2E8F0',
                              borderRadius: '6px',
                              fontSize: '14px'
                            }}
                          />
                          <span style={{ color: '#64748B' }}>/ {answer.question?.marks}</span>
                        </div>
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#475569',
                          marginBottom: '6px'
                        }}>
                          Status
                        </label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => {
                              handleGradeChange(answer._id, 'isCorrect', true);
                              handleGradeChange(answer._id, 'marks', answer.question?.marks);
                            }}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '6px',
                              border: 'none',
                              fontSize: '13px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              backgroundColor: grades[answer._id]?.isCorrect ? '#10B981' : '#E2E8F0',
                              color: grades[answer._id]?.isCorrect ? 'white' : '#64748B'
                            }}
                          >
                            Correct
                          </button>
                          <button
                            onClick={() => handleGradeChange(answer._id, 'isCorrect', false)}
                            style={{
                              padding: '8px 16px',
                              borderRadius: '6px',
                              border: 'none',
                              fontSize: '13px',
                              fontWeight: '500',
                              cursor: 'pointer',
                              backgroundColor: !grades[answer._id]?.isCorrect ? '#EF4444' : '#E2E8F0',
                              color: !grades[answer._id]?.isCorrect ? 'white' : '#64748B'
                            }}
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

        {/* Feedback */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          marginBottom: '24px'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1E293B', marginBottom: '16px' }}>
            Feedback for Student
          </h2>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Add feedback for the student (optional)..."
            rows={4}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              fontSize: '14px',
              resize: 'vertical',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/admin/grading')}
            style={{
              flex: 1,
              padding: '14px 24px',
              backgroundColor: '#F1F5F9',
              color: '#475569',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              flex: 2,
              padding: '14px 24px',
              backgroundColor: saving ? '#94A3B8' : '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: saving ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            {saving ? 'Saving...' : 'Save Grades'}
          </button>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ManualGrading;
