import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout';
import api from '../Services/api';

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
      console.error('Failed to fetch results:', error);
    } finally {
      setLoading(false);
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
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">My Results</h1>
          <p className="text-sm text-text-muted">View your exam performance and feedback</p>
        </div>

        {results.length > 0 ? (
          <div className="flex flex-col gap-4">
            {results.map((result) => (
              <div key={result._id} className="card hover:border-border-hover">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg ${
                      result.isPassed ? 'bg-success' : 'bg-error'
                    }`}>
                      {Number(result.percentage || 0).toFixed(0)}%
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-text-primary">{result.exam?.title}</h3>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-text-muted">
                          {new Date(result.submittedAt).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-text-muted">
                          {result.obtainedMarks}/{result.totalMarks} marks
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`badge ${result.isPassed ? 'badge-success' : 'badge-error'}`}>
                      {result.isPassed ? 'Passed' : 'Failed'}
                    </span>
                    <button
                      onClick={() => setSelectedResult(selectedResult?._id === result._id ? null : result)}
                      className="btn-secondary btn-sm"
                    >
                      {selectedResult?._id === result._id ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>
                </div>

                {selectedResult?._id === result._id && (
                  <div className="mt-5 pt-5 border-t border-border">
                    <h4 className="text-sm font-semibold text-text-primary mb-4">Question Review</h4>
                    <div className="flex flex-col gap-3">
                      {result.answers?.map((answer, idx) => (
                        <div key={idx} className={`p-4 rounded-xl ${
                          answer.isCorrect ? 'bg-success-light' : 'bg-error-light'
                        }`}>
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-text-primary font-medium mb-2">
                                {idx + 1}. {answer.question?.questionText}
                              </p>
                              <div className="flex flex-col gap-1 text-sm">
                                <p className="text-text-secondary">
                                  <span className="font-medium">Your Answer:</span>{' '}
                                  {answer.selectedAnswer || 'Not answered'}
                                </p>
                                <p className="text-text-secondary">
                                  <span className="font-medium">Correct Answer:</span>{' '}
                                  {answer.question?.correctAnswer}
                                </p>
                              </div>
                              {answer.question?.explanation && (
                                <p className="text-sm text-text-muted mt-2 italic">
                                  {answer.question.explanation}
                                </p>
                              )}
                            </div>
                            <div className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${
                              answer.isCorrect ? 'bg-success text-white' : 'bg-error text-white'
                            }`}>
                              {answer.isCorrect ? (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {result.feedback && (
                      <div className="mt-5 p-4 bg-info-light rounded-xl">
                        <h4 className="text-sm font-semibold text-info-dark mb-2">Feedback from Instructor</h4>
                        <p className="text-sm text-text-secondary">{result.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card text-center py-16">
            <svg className="w-16 h-16 mx-auto mb-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No Results Yet</h3>
            <p className="text-sm text-text-muted mb-5">Complete an exam to see your results here</p>
            <Link to="/exams" className="btn-primary inline-flex no-underline">
              Browse Exams
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Results;
