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

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-purple-100 text-purple-600',
      proctor: 'bg-primary-100 text-primary',
      student: 'bg-success-light text-success-dark'
    };
    return colors[role] || colors.student;
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
          <h1 className="text-3xl font-bold text-text-primary mb-2">Manage Users</h1>
          <p className="text-sm text-text-muted">View and manage platform users</p>
        </div>

        <div className="card mb-6">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="select max-w-[200px]"
          >
            <option value="">All Users</option>
            <option value="student">Students</option>
            <option value="admin">Admins</option>
            <option value="proctor">Proctors</option>
          </select>
        </div>

        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr>
                <th className="table-header text-left">User</th>
                <th className="table-header text-left">Email</th>
                <th className="table-header text-center">Role</th>
                <th className="table-header text-center">Joined</th>
                <th className="table-header text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="table-row">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-text-primary">{user.firstName} {user.lastName}</p>
                        <p className={`text-xs ${user.isVerified ? 'text-success' : 'text-warning'}`}>
                          {user.isVerified ? 'Verified' : 'Pending'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 text-text-muted">{user.email}</td>
                  <td className="py-4 px-5 text-center">
                    <span className={`badge ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-5 text-center text-sm text-text-muted">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditModal({ ...user, newRole: user.role })}
                        className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-none cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => setDeleteModal(user)}
                        className="p-2 rounded-lg bg-error/10 text-error hover:bg-error/20 transition-colors border-none cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {editModal && (
          <div className="modal-overlay" onClick={() => setEditModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-text-primary mb-5">Edit User Role</h2>
              <div className="flex items-center gap-3 p-4 bg-surface rounded-xl mb-6">
                <div className="avatar">
                  {editModal.firstName?.charAt(0)}{editModal.lastName?.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-text-primary">{editModal.firstName} {editModal.lastName}</p>
                  <p className="text-sm text-text-muted">{editModal.email}</p>
                </div>
              </div>
              <div className="form-group mb-6">
                <label className="label">Role</label>
                <select
                  value={editModal.newRole}
                  onChange={(e) => setEditModal({ ...editModal, newRole: e.target.value })}
                  className="select"
                >
                  <option value="student">Student</option>
                  <option value="proctor">Proctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-3">
                <button onClick={() => setEditModal(null)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={handleUpdateRole} className="btn-primary">
                  Update Role
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteModal && (
          <div className="modal-overlay" onClick={() => setDeleteModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold text-text-primary mb-4">Delete User</h2>
              <p className="text-text-muted mb-6">
                Are you sure you want to delete {deleteModal.firstName} {deleteModal.lastName}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setDeleteModal(null)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={() => handleDelete(deleteModal._id)} className="btn-error">
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
