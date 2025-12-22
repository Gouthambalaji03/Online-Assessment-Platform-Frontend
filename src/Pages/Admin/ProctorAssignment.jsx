import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../Services/api';
import { toast } from 'react-toastify';
import Sidebar from '../../Components/Sidebar';

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
    setSelectedProctors(prev => {
      if (prev.includes(proctorId)) {
        return prev.filter(id => id !== proctorId);
      } else {
        return [...prev, proctorId];
      }
    });
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
          <Link
            to="/admin/exams"
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
            Back to Exams
          </Link>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1E293B', marginBottom: '8px' }}>
            Assign Proctors
          </h1>
          <p style={{ color: '#64748B' }}>
            Select proctors to monitor "{exam?.title}"
          </p>
        </div>

        {/* Exam Info Card */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Exam</span>
              <span style={{ fontWeight: '600', color: '#1E293B' }}>{exam?.title}</span>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Date</span>
              <span style={{ fontWeight: '600', color: '#1E293B' }}>
                {new Date(exam?.scheduledDate).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Time</span>
              <span style={{ fontWeight: '600', color: '#1E293B' }}>
                {exam?.startTime} - {exam?.endTime}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Enrolled Students</span>
              <span style={{ fontWeight: '600', color: '#1E293B' }}>
                {exam?.enrolledStudents?.length || 0}
              </span>
            </div>
            <div>
              <span style={{ fontSize: '12px', color: '#64748B', display: 'block' }}>Proctoring</span>
              <span style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500',
                backgroundColor: exam?.isProctored ? '#D1FAE5' : '#FEE2E2',
                color: exam?.isProctored ? '#065F46' : '#991B1B'
              }}>
                {exam?.isProctored ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>
        </div>

        {/* Available Proctors */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1E293B', marginBottom: '16px' }}>
            Available Proctors ({availableProctors.length})
          </h2>

          {availableProctors.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              backgroundColor: '#F8FAFC',
              borderRadius: '8px'
            }}>
              <p style={{ color: '#64748B' }}>No proctors available. Register users with the proctor role first.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {availableProctors.map(proctor => (
                <div
                  key={proctor._id}
                  onClick={() => toggleProctor(proctor._id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    backgroundColor: selectedProctors.includes(proctor._id) ? '#EFF6FF' : '#F8FAFC',
                    border: `2px solid ${selectedProctors.includes(proctor._id) ? '#3B82F6' : 'transparent'}`,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: selectedProctors.includes(proctor._id) ? '#3B82F6' : '#E2E8F0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: selectedProctors.includes(proctor._id) ? 'white' : '#64748B',
                      fontWeight: '600'
                    }}>
                      {proctor.firstName[0]}{proctor.lastName[0]}
                    </div>
                    <div>
                      <p style={{ fontWeight: '600', color: '#1E293B' }}>
                        {proctor.firstName} {proctor.lastName}
                      </p>
                      <p style={{ fontSize: '14px', color: '#64748B' }}>{proctor.email}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '500',
                      backgroundColor: proctor.role === 'admin' ? '#E0E7FF' : '#D1FAE5',
                      color: proctor.role === 'admin' ? '#3730A3' : '#065F46'
                    }}>
                      {proctor.role}
                    </span>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '6px',
                      border: `2px solid ${selectedProctors.includes(proctor._id) ? '#3B82F6' : '#CBD5E1'}`,
                      backgroundColor: selectedProctors.includes(proctor._id) ? '#3B82F6' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {selectedProctors.includes(proctor._id) && (
                        <svg style={{ width: '14px', height: '14px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Selected Count */}
          <div style={{
            marginTop: '24px',
            padding: '16px',
            backgroundColor: '#F0F9FF',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ color: '#0369A1', fontWeight: '500' }}>
              {selectedProctors.length} proctor(s) selected
            </span>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button
              onClick={() => navigate('/admin/exams')}
              style={{
                flex: 1,
                padding: '12px 24px',
                backgroundColor: '#F1F5F9',
                color: '#475569',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
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
                padding: '12px 24px',
                backgroundColor: saving ? '#94A3B8' : '#3B82F6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: saving ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {saving ? 'Saving...' : 'Save Assignments'}
            </button>
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

export default ProctorAssignment;
