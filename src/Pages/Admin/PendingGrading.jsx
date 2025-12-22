import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../Components/Layout';
import api from '../../Services/api';
import { toast } from 'react-toastify';

const PendingGrading = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchPendingResults();
  }, [page]);

  const fetchPendingResults = async () => {
    try {
      const response = await api.get(`/results/pending-grading?page=${page}&limit=20`);
      setResults(response.data.results);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to load pending grading');
    } finally {
      setLoading(false);
    }
  };

  const countPendingAnswers = (result) => {
    return result.answers.filter(a =>
      a.question?.questionType === 'short_answer' &&
      a.selectedOption &&
      a.marksObtained === 0 &&
      !a.isCorrect
    ).length;
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Pending Grading</h1>
          <p className="text-sm text-text-muted">Review and grade short answer responses that require manual evaluation</p>
        </div>

        <div className="card mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-warning-light flex items-center justify-center">
              <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{results.length}</p>
              <p className="text-sm text-text-muted">Pending Results</p>
            </div>
          </div>
        </div>

        <div className="table-container">
          {results.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-full bg-success-light flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">All caught up!</h3>
              <p className="text-text-muted">No pending results require manual grading.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  <th className="table-header text-left">Student</th>
                  <th className="table-header text-left">Exam</th>
                  <th className="table-header text-left">Submitted</th>
                  <th className="table-header text-center">Score</th>
                  <th className="table-header text-center">Pending</th>
                  <th className="table-header text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {results.map(result => (
                  <tr key={result._id} className="table-row">
                    <td className="py-4 px-5">
                      <p className="font-semibold text-text-primary">{result.student?.firstName} {result.student?.lastName}</p>
                      <p className="text-xs text-text-muted">{result.student?.email}</p>
                    </td>
                    <td className="py-4 px-5">
                      <p className="font-medium text-text-primary">{result.exam?.title}</p>
                      <p className="text-xs text-text-muted">{result.exam?.category}</p>
                    </td>
                    <td className="py-4 px-5">
                      <p className="text-sm text-text-secondary">{new Date(result.submittedAt).toLocaleDateString()}</p>
                      <p className="text-xs text-text-light">{new Date(result.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <p className="font-semibold text-text-primary">{result.obtainedMarks}/{result.totalMarks}</p>
                      <p className="text-xs text-text-muted">{Number(result.percentage || 0).toFixed(1)}%</p>
                    </td>
                    <td className="py-4 px-5 text-center">
                      <span className="badge-warning">{countPendingAnswers(result)} answers</span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <Link to={`/admin/grading/${result._id}`} className="btn-primary btn-sm no-underline">
                        Grade
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn-secondary btn-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="py-2 px-4 text-text-muted">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="btn-secondary btn-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PendingGrading;
