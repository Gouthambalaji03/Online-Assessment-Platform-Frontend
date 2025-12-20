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
          <div className="w-12 h-12 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-[#1E293B] mb-2">My Results</h1>
          <p className="text-[#64748B]">View your exam performance and detailed analysis</p>
        </div>

        {results.length > 0 ? (
          <div className="space-y-4">
            {results.map((result) => (
              <div key={result._id} className="glass-card p-6 hover:border-[#2563EB]/30 transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center ${
                      result.isPassed ? 'bg-[#D1FAE5]' : 'bg-[#FEE2E2]'
                    }`}>
                      {result.isPassed ? (
                        <svg className="w-8 h-8 text-[#10B981]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-8 h-8 text-[#EF4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-[#1E293B] mb-1">{result.exam?.title}</h3>
                      <p className="text-sm text-[#64748B] mb-3">
                        Submitted on {new Date(result.submittedAt).toLocaleString()}
                      </p>
                      <div className="flex flex-wrap gap-4">
                        <div className="text-center">
                          <p className={`text-2xl font-bold ${result.isPassed ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                            {result.percentage?.toFixed(1)}%
                          </p>
                          <p className="text-xs text-[#64748B]">Score</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-[#2563EB]">
                            {result.obtainedMarks}/{result.totalMarks}
                          </p>
                          <p className="text-xs text-[#64748B]">Marks</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-[#10B981]">{result.correctAnswers}</p>
                          <p className="text-xs text-[#64748B]">Correct</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-[#EF4444]">{result.wrongAnswers}</p>
                          <p className="text-xs text-[#64748B]">Wrong</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-[#94A3B8]">{result.unanswered}</p>
                          <p className="text-xs text-[#64748B]">Skipped</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`badge text-center ${result.isPassed ? 'badge-success' : 'badge-danger'}`}>
                      {result.isPassed ? 'PASSED' : 'FAILED'}
                    </span>
                    <button
                      onClick={() => fetchResultDetails(result._id)}
                      className="btn-secondary text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-[#CBD5E1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <h3 className="text-xl font-semibold text-[#1E293B] mb-2">No Results Yet</h3>
            <p className="text-[#64748B] mb-4">Complete an exam to see your results here</p>
            <Link to="/exams" className="btn-primary inline-flex items-center gap-2">
              Browse Exams
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        )}

        {selectedResult && (
          <div className="modal-overlay" onClick={() => setSelectedResult(null)}>
            <div className="modal-content max-w-3xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1E293B]">Result Details</h2>
                <button onClick={() => setSelectedResult(null)} className="text-[#64748B] hover:text-[#1E293B]">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="data-card text-center">
                  <p className={`text-3xl font-bold ${selectedResult.isPassed ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                    {selectedResult.percentage?.toFixed(1)}%
                  </p>
                  <p className="text-sm text-[#64748B]">Score</p>
                </div>
                <div className="data-card text-center">
                  <p className="text-3xl font-bold text-[#10B981]">{selectedResult.correctAnswers}</p>
                  <p className="text-sm text-[#64748B]">Correct</p>
                </div>
                <div className="data-card text-center">
                  <p className="text-3xl font-bold text-[#EF4444]">{selectedResult.wrongAnswers}</p>
                  <p className="text-sm text-[#64748B]">Wrong</p>
                </div>
                <div className="data-card text-center">
                  <p className="text-3xl font-bold text-[#2563EB]">
                    {Math.floor(selectedResult.timeTaken / 60)}m
                  </p>
                  <p className="text-sm text-[#64748B]">Time Taken</p>
                </div>
              </div>

              {selectedResult.exam?.allowReview && selectedResult.answers && (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  <h3 className="font-semibold text-[#1E293B]">Question Review</h3>
                  {selectedResult.answers.map((answer, idx) => (
                    <div key={idx} className={`p-4 rounded-xl ${
                      answer.isCorrect ? 'bg-[#D1FAE5] border border-[#10B981]/30' : 'bg-[#FEE2E2] border border-[#EF4444]/30'
                    }`}>
                      <div className="flex items-start gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${
                          answer.isCorrect ? 'bg-[#10B981]' : 'bg-[#EF4444]'
                        }`}>
                          {answer.isCorrect ? '✓' : '✗'}
                        </span>
                        <div>
                          <p className="font-medium text-[#1E293B] mb-2">{answer.question?.questionText}</p>
                          <p className="text-sm text-[#64748B]">
                            Your answer: <span className={answer.isCorrect ? 'text-[#10B981] font-medium' : 'text-[#EF4444] font-medium'}>
                              {answer.selectedOption || 'Not answered'}
                            </span>
                          </p>
                          {answer.question?.explanation && (
                            <p className="text-sm text-[#2563EB] mt-2">
                              Explanation: {answer.question.explanation}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedResult.feedback && (
                <div className="mt-6 p-4 bg-[#E0F2FE] border border-[#0EA5E9]/30 rounded-xl">
                  <h3 className="font-semibold text-[#1E293B] mb-2">Instructor Feedback</h3>
                  <p className="text-[#475569]">{selectedResult.feedback}</p>
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
