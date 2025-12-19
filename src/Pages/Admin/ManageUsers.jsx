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

  const getRoleBadge = (role) => {
    const styles = {
      admin: 'bg-red-500/20 text-red-400',
      proctor: 'bg-blue-500/20 text-blue-400',
      student: 'bg-green-500/20 text-green-400'
    };
    return styles[role] || styles.student;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Users</h1>
            <p className="text-gray-400">View and manage platform users</p>
          </div>
        </div>

        <div className="glass-card p-4 mb-6">
          <div className="flex gap-4">
            <select
              className="input-field w-auto"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Users</option>
              <option value="student">Students</option>
              <option value="admin">Admins</option>
              <option value="proctor">Proctors</option>
            </select>
          </div>
        </div>

        <div className="table-container">
          <div className="grid grid-cols-12 table-header">
            <div className="col-span-4">User</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Joined</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>
          {users.map((user) => (
            <div key={user._id} className="grid grid-cols-12 table-row items-center">
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-400">
                    {user.isVerified ? (
                      <span className="text-green-400">Verified</span>
                    ) : (
                      <span className="text-yellow-400">Pending</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="col-span-3 text-gray-400 truncate">{user.email}</div>
              <div className="col-span-2">
                <span className={`badge ${getRoleBadge(user.role)}`}>
                  {user.role}
                </span>
              </div>
              <div className="col-span-2 text-gray-400 text-sm">
                {new Date(user.createdAt).toLocaleDateString()}
              </div>
              <div className="col-span-1 flex justify-end gap-2">
                <button
                  onClick={() => setEditModal({ ...user, newRole: user.role })}
                  className="p-2 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => setDeleteModal(user)}
                  className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {editModal && (
          <div className="modal-overlay" onClick={() => setEditModal(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h2 className="text-xl font-bold mb-4">Edit User Role</h2>
              <div className="flex items-center gap-3 mb-6 p-4 bg-slate-800/50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                  {editModal.firstName?.charAt(0)}{editModal.lastName?.charAt(0)}
                </div>
                <div>
                  <p className="font-medium">{editModal.firstName} {editModal.lastName}</p>
                  <p className="text-sm text-gray-400">{editModal.email}</p>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <select
                  className="input-field"
                  value={editModal.newRole}
                  onChange={(e) => setEditModal({ ...editModal, newRole: e.target.value })}
                >
                  <option value="student">Student</option>
                  <option value="proctor">Proctor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
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
              <h2 className="text-xl font-bold mb-4">Delete User</h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to delete {deleteModal.firstName} {deleteModal.lastName}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <button onClick={() => setDeleteModal(null)} className="btn-secondary">
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteModal._id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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

