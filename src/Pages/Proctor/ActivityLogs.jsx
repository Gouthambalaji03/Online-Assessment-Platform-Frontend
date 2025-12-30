import { useState, useEffect } from 'react';
import Layout from '../../Components/Layout';
import api from '../../Services/api';

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/proctoring/logs');
      setLogs(response.data || []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = logs.filter(log => {
    if (filter === 'all') return true;
    return log.eventType === filter;
  });

  const getEventIcon = (type) => {
    const icons = {
      tab_switch: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      face_not_visible: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      multiple_faces: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z',
      camera_blocked: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
      snapshot: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
    };
    return icons[type] || 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z';
  };

  const getEventColor = (severity) => {
    const colors = {
      low: 'bg-info/10 text-info',
      medium: 'bg-warning/10 text-warning',
      high: 'bg-error/10 text-error'
    };
    return colors[severity] || colors.low;
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Activity Logs</h1>
          <p className="text-sm text-text-muted">View all proctoring events and activities</p>
        </div>

        <div className="card mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="select max-w-[200px]"
          >
            <option value="all">All Events</option>
            <option value="tab_switch">Tab Switches</option>
            <option value="face_not_visible">Face Not Visible</option>
            <option value="multiple_faces">Multiple Faces</option>
            <option value="camera_blocked">Camera Blocked</option>
            <option value="snapshot">Snapshots</option>
          </select>
        </div>

        {filteredLogs.length > 0 ? (
          <div className="flex flex-col gap-3">
            {filteredLogs.map((log) => (
              <div key={log._id} className="card hover:border-border-hover">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${getEventColor(log.severity)}`}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getEventIcon(log.eventType)} />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-text-primary">{log.eventType?.replace('_', ' ')}</p>
                        <p className="text-sm text-text-muted">{log.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-text-light">
                            {log.student?.firstName} {log.student?.lastName}
                            </span>
                          <span className="text-xs text-text-light">•</span>
                          <span className="text-xs text-text-light">
                            {log.exam?.title}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-text-light whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          ) : (
          <div className="card text-center py-16">
            <svg className="w-16 h-16 mx-auto mb-4 text-text-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No Logs Found</h3>
            <p className="text-sm text-text-muted">
              No activity logs match your current filter
            </p>
            </div>
          )}
      </div>
    </Layout>
  );
};

export default ActivityLogs;
