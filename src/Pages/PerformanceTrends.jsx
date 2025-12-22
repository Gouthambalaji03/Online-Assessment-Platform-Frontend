import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../Services/api';
import { toast } from 'react-toastify';
import Sidebar from '../Components/Sidebar';
import { useAuth } from '../Context/AuthContext';

const PerformanceTrends = () => {
  const { user } = useAuth();
  const [trends, setTrends] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const response = await api.get('/results/my-trends');
      setTrends(response.data);
    } catch (error) {
      toast.error('Failed to load performance trends');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get('/results/my-export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'my_results.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Results exported successfully');
    } catch (error) {
      toast.error('Failed to export results');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
        <Sidebar role="student" />
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

  if (!trends || trends.message) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
        <Sidebar role="student" />
        <main style={{ flex: 1, padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <svg style={{ width: '40px', height: '40px', color: '#94A3B8' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#1E293B', marginBottom: '8px' }}>
              No Data Available
            </h2>
            <p style={{ color: '#64748B', marginBottom: '24px' }}>
              Complete some exams to see your performance trends.
            </p>
            <Link
              to="/exams"
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#3B82F6',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '8px',
                fontWeight: '600'
              }}
            >
              Browse Exams
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const maxPercentage = Math.max(...(trends.performanceOverTime?.map(p => p.percentage) || [100]));

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Sidebar role="student" />
      <main style={{ flex: 1, padding: '32px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>
              Performance Trends
            </h1>
            <p style={{ color: '#64748B' }}>
              Track your progress and identify areas for improvement
            </p>
          </div>
          <button
            onClick={handleExport}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 20px',
              backgroundColor: '#10B981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>

        {/* Overview Stats */}
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
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '8px' }}>Total Exams</p>
            <p style={{ fontSize: '28px', fontWeight: '700', color: '#1E293B' }}>{trends.totalExams}</p>
          </div>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '8px' }}>Overall Average</p>
            <p style={{ fontSize: '28px', fontWeight: '700', color: '#3B82F6' }}>{trends.overallAverage}%</p>
          </div>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '8px' }}>Improvement</p>
            <p style={{
              fontSize: '28px',
              fontWeight: '700',
              color: trends.improvementScore >= 0 ? '#10B981' : '#EF4444'
            }}>
              {trends.improvementScore >= 0 ? '+' : ''}{trends.improvementScore}%
            </p>
          </div>
        </div>

        {/* Performance Chart */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1E293B', marginBottom: '20px' }}>
            Performance Over Time
          </h2>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', overflowX: 'auto', paddingBottom: '40px' }}>
            {trends.performanceOverTime?.map((p, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '60px'
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: `${(p.percentage / maxPercentage) * 160}px`,
                    minHeight: '20px',
                    backgroundColor: p.isPassed ? '#10B981' : '#EF4444',
                    borderRadius: '4px 4px 0 0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingTop: '4px'
                  }}
                  title={`${p.examTitle}: ${p.percentage}%`}
                >
                  <span style={{ fontSize: '10px', color: 'white', fontWeight: '600' }}>
                    {p.percentage}%
                  </span>
                </div>
                <span style={{
                  fontSize: '10px',
                  color: '#64748B',
                  marginTop: '8px',
                  textAlign: 'center',
                  maxWidth: '60px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '16px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#10B981' }}></div>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Passed</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '2px', backgroundColor: '#EF4444' }}></div>
              <span style={{ fontSize: '12px', color: '#64748B' }}>Failed</span>
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '24px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1E293B', marginBottom: '20px' }}>
              Performance by Category
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {trends.categoryStats?.map((cat, index) => (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: '500', color: '#1E293B' }}>{cat.category}</span>
                    <span style={{ color: '#64748B', fontSize: '14px' }}>{cat.avgPercentage}%</span>
                  </div>
                  <div style={{
                    height: '8px',
                    backgroundColor: '#E2E8F0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${cat.avgPercentage}%`,
                      backgroundColor: cat.avgPercentage >= 70 ? '#10B981' : cat.avgPercentage >= 50 ? '#F59E0B' : '#EF4444',
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }}></div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>{cat.examCount} exams</span>
                    <span style={{ fontSize: '12px', color: '#94A3B8' }}>Pass rate: {cat.passRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Performance */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1E293B', marginBottom: '20px' }}>
              Monthly Performance
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {trends.monthlyStats?.slice(-6).map((month, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px',
                    backgroundColor: '#F8FAFC',
                    borderRadius: '8px'
                  }}
                >
                  <div>
                    <p style={{ fontWeight: '500', color: '#1E293B' }}>
                      {new Date(month.month + '-01').toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </p>
                    <p style={{ fontSize: '12px', color: '#64748B' }}>{month.examCount} exams</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: '600', color: '#3B82F6' }}>{month.avgPercentage}%</p>
                    <p style={{ fontSize: '12px', color: '#10B981' }}>{month.passRate}% passed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Exams */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1E293B', marginBottom: '20px' }}>
            Recent Exam Performance
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#64748B', fontSize: '12px', fontWeight: '600' }}>Exam</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#64748B', fontSize: '12px', fontWeight: '600' }}>Date</th>
                  <th style={{ textAlign: 'right', padding: '12px', color: '#64748B', fontSize: '12px', fontWeight: '600' }}>Score</th>
                  <th style={{ textAlign: 'center', padding: '12px', color: '#64748B', fontSize: '12px', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {trends.performanceOverTime?.slice(-10).reverse().map((p, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #E2E8F0' }}>
                    <td style={{ padding: '12px', color: '#1E293B', fontWeight: '500' }}>{p.examTitle}</td>
                    <td style={{ padding: '12px', color: '#64748B' }}>
                      {new Date(p.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'right', fontWeight: '600', color: '#1E293B' }}>
                      {p.percentage}%
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600',
                        backgroundColor: p.isPassed ? '#D1FAE5' : '#FEE2E2',
                        color: p.isPassed ? '#065F46' : '#991B1B'
                      }}>
                        {p.isPassed ? 'PASSED' : 'FAILED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

export default PerformanceTrends;
