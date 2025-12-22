import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout';
import api from '../Services/api';
import { toast } from 'react-toastify';

const Results = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await api.get('/results/my-results');
      setResults(response.data.results || []);
    } catch (error) {
      toast.error('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  const fetchResultDetails = async (resultId) => {
    try {
      const response = await api.get(`/results/${resultId}`);
      setSelectedResult(response.data);
    } catch (error) {
      toast.error('Failed to fetch result details');
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

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">My Results</h1>
          <p className="text-sm text-text-muted">View your exam performance and detailed analysis</p>
        </div>

        {results.length > 0 ? (
          <div className="stack-md">
            {results.map((result) => (
              <div key={result._id} className="card transition-all duration-200 hover:border-border-hover hover:shadow-lg">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center shrink-0 ${result.isPassed ? 'bg-success-light' : 'bg-error-light'}`}>
                        {result.isPassed ? (
                          <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-text-primary mb-1">{result.exam?.title}</h3>
                        <p className="text-xs text-text-muted mb-4">
                          Submitted on {new Date(result.submittedAt).toLocaleString()}
                        </p>
                        <div className="flex flex-wrap gap-6">
                          <div className="text-center">
                            <p className={`text-2xl font-bold ${result.isPassed ? 'text-success' : 'text-error'}`}>
                              {result.percentage?.toFixed(1)}%
                            </p>
                            <p className="text-xs text-text-muted">Score</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-primary">{result.obtainedMarks}/{result.totalMarks}</p>
                            <p className="text-xs text-text-muted">Marks</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-success">{result.correctAnswers}</p>
                            <p className="text-xs text-text-muted">Correct</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-error">{result.wrongAnswers}</p>
                            <p className="text-xs text-text-muted">Wrong</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold text-text-light">{result.unanswered}</p>
                            <p className="text-xs text-text-muted">Skipped</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      <span className={`py-1.5 px-4 text-xs font-semibold rounded-lg ${result.isPassed ? 'bg-success-light text-success-dark' : 'bg-error-light text-error-dark'}`}>
                        {result.isPassed ? 'PASSED' : 'FAILED'}
                      </span>
                      <button
                        onClick={() => fetchResultDetails(result._id)}
                        className="btn-secondary btn-sm"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card py-16 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No Results Yet</h3>
            <p className="text-sm text-text-muted mb-5">Complete an exam to see your results here</p>
            <Link to="/exams" className="btn-primary no-underline inline-flex">
              Browse Exams
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}

        {selectedResult && (
          <div className="modal-overlay" onClick={() => setSelectedResult(null)}>
            <div className="modal-content max-w-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Result Details</h2>
                <button onClick={() => setSelectedResult(null)} className="p-2 text-text-muted hover:text-text-primary transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="bg-surface rounded-xl p-4 text-center">
                  <p className={`text-2xl font-bold ${selectedResult.isPassed ? 'text-success' : 'text-error'}`}>
                    {selectedResult.percentage?.toFixed(1)}%
                  </p>
                  <p className="text-xs text-text-muted">Score</p>
                </div>
                <div className="bg-surface rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-success">{selectedResult.correctAnswers}</p>
                  <p className="text-xs text-text-muted">Correct</p>
                </div>
                <div className="bg-surface rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-error">{selectedResult.wrongAnswers}</p>
                  <p className="text-xs text-text-muted">Wrong</p>
                </div>
                <div className="bg-surface rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{Math.floor(selectedResult.timeTaken / 60)}m</p>
                  <p className="text-xs text-text-muted">Time Taken</p>
                </div>
              </div>

              {selectedResult.exam?.allowReview && selectedResult.answers && (
                <div>
                  <h3 className="font-semibold text-text-primary mb-4">Question Review</h3>
                  <div className="max-h-96 overflow-y-auto stack-sm">
                    {selectedResult.answers.map((answer, idx) => (
                      <div key={idx} className={`p-4 rounded-xl border ${answer.isCorrect ? 'bg-success-light border-success/30' : 'bg-error-light border-error/30'}`}>
                        <div className="flex items-start gap-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white shrink-0 ${answer.isCorrect ? 'bg-success' : 'bg-error'}`}>
                            {answer.isCorrect ? '✓' : '✗'}
                          </span>
                          <div>
                            <p className="font-medium text-text-primary mb-2">{answer.question?.questionText}</p>
                            <p className="text-xs text-text-muted">
                              Your answer:{' '}
                              <span className={`font-medium ${answer.isCorrect ? 'text-success' : 'text-error'}`}>
                                {answer.selectedOption || 'Not answered'}
                              </span>
                            </p>
                            {answer.question?.explanation && (
                              <p className="text-xs text-primary mt-2">
                                Explanation: {answer.question.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedResult.feedback && (
                <div className="mt-6 p-4 bg-info-light border border-info/30 rounded-xl">
                  <h3 className="font-semibold text-text-primary mb-2">Instructor Feedback</h3>
                  <p className="text-sm text-text-secondary">{selectedResult.feedback}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Results;
