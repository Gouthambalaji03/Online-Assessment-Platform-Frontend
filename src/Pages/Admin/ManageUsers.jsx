import { useState, useEffect } from 'react';
import Layout from '../../Components/Layout';
import api from '../../Services/api';
import { toast } from 'react-toastify';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      const params = roleFilter ? `?role=${roleFilter}` : '';
      const response = await api.get(`/auth/users${params}`);
      setUsers(response.data.users || []);
    } catch (error) {
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async () => {
    try {
      await api.put(`/auth/users/${editModal._id}/role`, { role: editModal.newRole });
      toast.success('User role updated successfully');
      fetchUsers();
      setEditModal(null);
    } catch (error) {
      toast.error('Failed to update user role');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/auth/users/${userId}`);
      toast.success('User deleted successfully');
      setUsers(users.filter(u => u._id !== userId));
      setDeleteModal(null);
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const getRoleStyle = (role) => {
    const styles = {
      admin: { bg: '#F3E8FF', text: '#7C3AED' },
      proctor: { bg: '#DBEAFE', text: '#1D4ED8' },
      student: { bg: '#D1FAE5', text: '#059669' }
    };
    return styles[role] || styles.student;
  };

  const containerStyle = {
    animation: 'fadeIn 0.3s ease-out'
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '32px'
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: '8px'
  };

  const subtitleStyle = {
    fontSize: '14px',
    color: '#64748B'
  };

  const filterContainerStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0'
  };

  const selectStyle = {
    padding: '10px 16px',
    backgroundColor: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#1E293B',
    cursor: 'pointer',
    outline: 'none',
    minWidth: '180px'
  };

  const tableContainerStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0',
    overflow: 'hidden'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const thStyle = {
    padding: '16px 20px',
    textAlign: 'left',
    fontSize: '12px',
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    backgroundColor: '#F8FAFC',
    borderBottom: '1px solid #E2E8F0'
  };

  const tdStyle = {
    padding: '16px 20px',
    fontSize: '14px',
    color: '#1E293B',
    borderBottom: '1px solid #F1F5F9'
  };

  const avatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
    color: '#FFFFFF'
  };

  const actionBtnStyle = (color) => ({
    padding: '8px',
    backgroundColor: `${color}15`,
    color: color,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center'
  });

  const spinnerContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh'
  };

  const spinnerStyle = {
    width: '48px',
    height: '48px',
    border: '4px solid #E2E8F0',
    borderTop: '4px solid #2563EB',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  };

  const modalOverlayStyle = {
    position: 'fixed',
    inset: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '50'
  };

  const modalContentStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    padding: '24px',
    maxWidth: '400px',
    width: '100%',
    margin: '0 16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  };

  if (loading) {
    return (
      <Layout>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <div style={spinnerContainerStyle}>
          <div style={spinnerStyle}></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>Manage Users</h1>
            <p style={subtitleStyle}>View and manage platform users</p>
          </div>
        </div>

        <div style={filterContainerStyle}>
          <select
            style={selectStyle}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Users</option>
            <option value="student">Students</option>
            <option value="admin">Admins</option>
            <option value="proctor">Proctors</option>
          </select>
        </div>

        <div style={tableContainerStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Joined</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const roleStyle = getRoleStyle(user.role);
                return (
                  <tr key={user._id}>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={avatarStyle}>
                          {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                        </div>
                        <div>
                          <p style={{ fontWeight: '600', color: '#1E293B', marginBottom: '2px' }}>
                            {user.firstName} {user.lastName}
                          </p>
                          <p style={{ fontSize: '12px', color: user.isVerified ? '#059669' : '#D97706' }}>
                            {user.isVerified ? 'Verified' : 'Pending'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td style={{ ...tdStyle, color: '#64748B' }}>{user.email}</td>
                    <td style={tdStyle}>
                      <span style={{
                        display: 'inline-block',
                        padding: '4px 10px',
                        fontSize: '12px',
                        fontWeight: '500',
                        backgroundColor: roleStyle.bg,
                        color: roleStyle.text,
                        borderRadius: '6px',
                        textTransform: 'capitalize'
                      }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, color: '#64748B', fontSize: '13px' }}>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button
                          onClick={() => setEditModal({ ...user, newRole: user.role })}
                          style={actionBtnStyle('#2563EB')}
                        >
                          <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setDeleteModal(user)}
                          style={actionBtnStyle('#EF4444')}
                        >
                          <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {editModal && (
          <div style={modalOverlayStyle} onClick={() => setEditModal(null)}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B', marginBottom: '20px' }}>Edit User Role</h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '16px',
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <div style={avatarStyle}>
                  {editModal.firstName?.charAt(0)}{editModal.lastName?.charAt(0)}
                </div>
                <div>
                  <p style={{ fontWeight: '600', color: '#1E293B' }}>{editModal.firstName} {editModal.lastName}</p>
                  <p style={{ fontSize: '13px', color: '#64748B' }}>{editModal.email}</p>
                </div>
              </div>
              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#475569', marginBottom: '8px' }}>
                  Role
                </label>
                <select
                  style={{ ...selectStyle, width: '100%' }}
                  value={editModal.newRole}
                  onChange={(e) => setEditModal({ ...editModal, newRole: e.target.value })}
                >
                  <option value="student">Student</option>
                  <option value="proctor">Proctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => setEditModal(null)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#F1F5F9',
                    color: '#64748B',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateRole}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#2563EB',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Update Role
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteModal && (
          <div style={modalOverlayStyle} onClick={() => setDeleteModal(null)}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B', marginBottom: '16px' }}>Delete User</h2>
              <p style={{ fontSize: '14px', color: '#64748B', marginBottom: '24px' }}>
                Are you sure you want to delete {deleteModal.firstName} {deleteModal.lastName}? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  onClick={() => setDeleteModal(null)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#F1F5F9',
                    color: '#64748B',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal._id)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#EF4444',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ManageUsers;
