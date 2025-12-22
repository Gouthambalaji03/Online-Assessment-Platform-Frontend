import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../../Components/Layout';
import api from '../../Services/api';
import { toast } from 'react-toastify';

const ProctorAssignment = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [availableProctors, setAvailableProctors] = useState([]);
  const [selectedProctors, setSelectedProctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [examId]);

  const fetchData = async () => {
    try {
      const [examRes, proctorsRes] = await Promise.all([
        api.get(`/exams/${examId}`),
        api.get('/exams/proctors/available')
      ]);
      setExam(examRes.data);
      setAvailableProctors(proctorsRes.data);
      setSelectedProctors(examRes.data.assignedProctors?.map(p => p._id || p) || []);
    } catch (error) {
      toast.error('Failed to load data');
      navigate('/admin/exams');
    } finally {
      setLoading(false);
    }
  };

  const toggleProctor = (proctorId) => {
    setSelectedProctors(prev =>
      prev.includes(proctorId) ? prev.filter(id => id !== proctorId) : [...prev, proctorId]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.post(`/exams/${examId}/proctors`, { proctorIds: selectedProctors });
      toast.success('Proctors assigned successfully');
      navigate('/admin/exams');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign proctors');
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

  return (
    <Layout>
      <div className="animate-fade-in max-w-3xl">
        <Link to="/admin/exams" className="inline-flex items-center gap-2 text-text-muted text-sm mb-4 no-underline hover:text-text-primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Exams
        </Link>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Assign Proctors</h1>
          <p className="text-sm text-text-muted">Select proctors to monitor "{exam?.title}"</p>
        </div>

        <div className="card mb-6">
          <div className="flex flex-wrap gap-6">
            <div>
              <span className="text-xs text-text-muted block">Exam</span>
              <span className="font-semibold text-text-primary">{exam?.title}</span>
            </div>
            <div>
              <span className="text-xs text-text-muted block">Date</span>
              <span className="font-semibold text-text-primary">{new Date(exam?.scheduledDate).toLocaleDateString()}</span>
            </div>
            <div>
              <span className="text-xs text-text-muted block">Time</span>
              <span className="font-semibold text-text-primary">{exam?.startTime} - {exam?.endTime}</span>
            </div>
            <div>
              <span className="text-xs text-text-muted block">Enrolled Students</span>
              <span className="font-semibold text-text-primary">{exam?.enrolledStudents?.length || 0}</span>
            </div>
            <div>
              <span className="text-xs text-text-muted block">Proctoring</span>
              <span className={`badge ${exam?.isProctored ? 'badge-success' : 'badge-error'}`}>
                {exam?.isProctored ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-text-primary mb-4">Available Proctors ({availableProctors.length})</h2>
          {availableProctors.length === 0 ? (
            <div className="text-center py-10 bg-surface rounded-xl">
              <p className="text-text-muted">No proctors available. Register users with the proctor role first.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {availableProctors.map(proctor => (
                <div
                  key={proctor._id}
                  onClick={() => toggleProctor(proctor._id)}
                  className={`flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all border-2 ${
                    selectedProctors.includes(proctor._id)
                      ? 'bg-primary-50 border-primary'
                      : 'bg-surface border-transparent hover:bg-surface-secondary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`avatar ${selectedProctors.includes(proctor._id) ? 'bg-primary' : 'bg-border text-text-muted'}`}>
                      {proctor.firstName[0]}{proctor.lastName[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary">{proctor.firstName} {proctor.lastName}</p>
                      <p className="text-sm text-text-muted">{proctor.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`badge ${proctor.role === 'admin' ? 'badge-primary' : 'badge-success'}`}>
                      {proctor.role}
                    </span>
                    <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                      selectedProctors.includes(proctor._id)
                        ? 'border-primary bg-primary'
                        : 'border-border bg-card'
                    }`}>
                      {selectedProctors.includes(proctor._id) && (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 p-4 bg-info-light rounded-xl flex items-center justify-between">
            <span className="text-info-dark font-medium">{selectedProctors.length} proctor(s) selected</span>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => navigate('/admin/exams')} className="btn-secondary flex-1">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving} className="btn-primary flex-[2]">
              {saving ? 'Saving...' : 'Save Assignments'}
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProctorAssignment;
