import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../Components/Layout';
import api from '../Services/api';
import { toast } from 'react-toastify';

const PerformanceTrends = () => {
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
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-12 h-12 border-4 border-border border-t-primary rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (!trends || trends.message) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-surface-secondary flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-text-primary mb-2">No Data Available</h2>
            <p className="text-text-muted mb-6">Complete some exams to see your performance trends.</p>
            <Link to="/exams" className="btn-primary no-underline">
              Browse Exams
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const maxPercentage = Math.max(...(trends.performanceOverTime?.map(p => p.percentage) || [100]));

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary mb-2">Performance Trends</h1>
            <p className="text-sm text-text-muted">Track your progress and identify areas for improvement</p>
          </div>
          <button onClick={handleExport} className="btn-success">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <p className="text-sm text-text-muted mb-2">Total Exams</p>
            <p className="text-3xl font-bold text-text-primary">{trends.totalExams}</p>
          </div>
          <div className="card">
            <p className="text-sm text-text-muted mb-2">Overall Average</p>
            <p className="text-3xl font-bold text-primary">{trends.overallAverage}%</p>
          </div>
          <div className="card">
            <p className="text-sm text-text-muted mb-2">Improvement</p>
            <p className={`text-3xl font-bold ${trends.improvementScore >= 0 ? 'text-success' : 'text-error'}`}>
              {trends.improvementScore >= 0 ? '+' : ''}{trends.improvementScore}%
            </p>
          </div>
        </div>

        <div className="card mb-6">
          <h2 className="text-lg font-semibold text-text-primary mb-5">Performance Over Time</h2>
          <div className="flex items-end gap-2 h-[200px] overflow-x-auto pb-10">
            {trends.performanceOverTime?.map((p, index) => (
              <div key={index} className="flex flex-col items-center min-w-[60px]">
                <div
                  className={`w-10 rounded-t flex items-start justify-center pt-1 ${p.isPassed ? 'bg-success' : 'bg-error'}`}
                  style={{ height: `${Math.max((p.percentage / maxPercentage) * 160, 20)}px` }}
                  title={`${p.examTitle}: ${p.percentage}%`}
                >
                  <span className="text-xs text-white font-semibold">{p.percentage}%</span>
                </div>
                <span className="text-xs text-text-muted mt-2 text-center max-w-[60px] truncate">
                  {new Date(p.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-success"></div>
              <span className="text-xs text-text-muted">Passed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-error"></div>
              <span className="text-xs text-text-muted">Failed</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="card">
            <h2 className="text-lg font-semibold text-text-primary mb-5">Performance by Category</h2>
            <div className="flex flex-col gap-4">
              {trends.categoryStats?.map((cat, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-text-primary">{cat.category}</span>
                    <span className="text-text-muted text-sm">{cat.avgPercentage}%</span>
                  </div>
                  <div className="h-2 bg-border rounded overflow-hidden">
                    <div
                      className={`h-full rounded transition-all duration-500 ${
                        cat.avgPercentage >= 70 ? 'bg-success' :
                        cat.avgPercentage >= 50 ? 'bg-warning' : 'bg-error'
                      }`}
                      style={{ width: `${cat.avgPercentage}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-text-light">{cat.examCount} exams</span>
                    <span className="text-xs text-text-light">Pass rate: {cat.passRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold text-text-primary mb-5">Monthly Performance</h2>
            <div className="flex flex-col gap-3">
              {trends.monthlyStats?.slice(-6).map((month, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-surface rounded-xl">
                  <div>
                    <p className="font-medium text-text-primary">
                      {new Date(month.month + '-01').toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-xs text-text-muted">{month.examCount} exams</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{month.avgPercentage}%</p>
                    <p className="text-xs text-success">{month.passRate}% passed</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-text-primary mb-5">Recent Exam Performance</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase">Exam</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-text-muted uppercase">Date</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-text-muted uppercase">Score</th>
                  <th className="text-center py-3 px-4 text-xs font-semibold text-text-muted uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {trends.performanceOverTime?.slice(-10).reverse().map((p, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-3 px-4 font-medium text-text-primary">{p.examTitle}</td>
                    <td className="py-3 px-4 text-text-muted">{new Date(p.date).toLocaleDateString()}</td>
                    <td className="py-3 px-4 text-right font-semibold text-text-primary">{p.percentage}%</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`badge ${p.isPassed ? 'badge-success' : 'badge-error'}`}>
                        {p.isPassed ? 'PASSED' : 'FAILED'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PerformanceTrends;
