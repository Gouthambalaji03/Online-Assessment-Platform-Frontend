import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../Services/api';
import { toast } from 'react-toastify';
import Sidebar from '../../Components/Sidebar';

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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Sidebar role="admin" />
      <main style={{ flex: 1, padding: '32px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>
            Pending Grading
          </h1>
          <p style={{ color: '#64748B' }}>
            Review and grade short answer responses that require manual evaluation
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                backgroundColor: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg style={{ width: '24px', height: '24px', color: '#F59E0B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B' }}>
                  {results.length}
                </p>
                <p style={{ fontSize: '14px', color: '#64748B' }}>Pending Results</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results List */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden'
        }}>
          {results.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 20px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#D1FAE5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px'
              }}>
                <svg style={{ width: '40px', height: '40px', color: '#10B981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1E293B', marginBottom: '8px' }}>
                All caught up!
              </h3>
              <p style={{ color: '#64748B' }}>No pending results require manual grading.</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 120px',
                padding: '16px 24px',
                backgroundColor: '#F8FAFC',
                borderBottom: '1px solid #E2E8F0',
                fontSize: '12px',
                fontWeight: '600',
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <span>Student</span>
                <span>Exam</span>
                <span>Submitted</span>
                <span>Score</span>
                <span>Pending</span>
                <span>Action</span>
              </div>

              {/* Table Rows */}
              {results.map(result => (
                <div
                  key={result._id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 2fr 1fr 1fr 1fr 120px',
                    padding: '16px 24px',
                    borderBottom: '1px solid #E2E8F0',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <p style={{ fontWeight: '600', color: '#1E293B' }}>
                      {result.student?.firstName} {result.student?.lastName}
                    </p>
                    <p style={{ fontSize: '13px', color: '#64748B' }}>{result.student?.email}</p>
                  </div>
                  <div>
                    <p style={{ fontWeight: '500', color: '#1E293B' }}>{result.exam?.title}</p>
                    <p style={{ fontSize: '13px', color: '#64748B' }}>{result.exam?.category}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '14px', color: '#475569' }}>
                      {new Date(result.submittedAt).toLocaleDateString()}
                    </p>
                    <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                      {new Date(result.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontWeight: '600', color: '#1E293B' }}>
                      {result.obtainedMarks}/{result.totalMarks}
                    </p>
                    <p style={{ fontSize: '12px', color: '#64748B' }}>
                      {result.percentage?.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600',
                      backgroundColor: '#FEF3C7',
                      color: '#92400E'
                    }}>
                      {countPendingAnswers(result)} answers
                    </span>
                  </div>
                  <div>
                    <Link
                      to={`/admin/grading/${result._id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 16px',
                        backgroundColor: '#3B82F6',
                        color: 'white',
                        textDecoration: 'none',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}
                    >
                      Grade
                      <svg style={{ width: '14px', height: '14px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '8px',
            marginTop: '24px'
          }}>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                backgroundColor: 'white',
                color: page === 1 ? '#94A3B8' : '#475569',
                cursor: page === 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            <span style={{
              padding: '8px 16px',
              color: '#64748B'
            }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: '1px solid #E2E8F0',
                backgroundColor: 'white',
                color: page === totalPages ? '#94A3B8' : '#475569',
                cursor: page === totalPages ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default PendingGrading;
