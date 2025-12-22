import { useState } from 'react';
import Layout from '../Components/Layout';
import { useAuth } from '../Context/AuthContext';
import api from '../Services/api';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.put('/auth/profile', profileData);
      updateUser(response.data.user);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="animate-fadeIn max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Profile Settings</h1>
          <p className="text-sm text-text-muted">Manage your account information and security</p>
        </div>

        <div className="card overflow-hidden p-0">
          <div className="p-6 border-b border-border bg-gradient-to-r from-primary/10 to-transparent">
            <div className="flex items-center gap-4">
              <div className="avatar avatar-xl">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-1">{user?.firstName} {user?.lastName}</h2>
                <p className="text-sm text-text-muted mb-2">{user?.email}</p>
                <span className="badge-primary capitalize">{user?.role}</span>
              </div>
            </div>
          </div>

          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'profile'
                  ? 'text-primary border-primary'
                  : 'text-text-muted border-transparent hover:text-text-primary'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'security'
                  ? 'text-primary border-primary'
                  : 'text-text-muted border-transparent hover:text-text-primary'
              }`}
            >
              Security
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileUpdate} className="stack-md">
                <div className="grid grid-cols-2 gap-6">
                  <div className="form-group">
                    <label className="label">First Name</label>
                    <input
                      type="text"
                      className="input"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="label">Last Name</label>
                    <input
                      type="text"
                      className="input"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="label">Email Address</label>
                  <input
                    type="email"
                    className="input bg-surface-secondary text-text-muted cursor-not-allowed"
                    value={user?.email}
                    disabled
                  />
                  <p className="text-xs text-text-light mt-1">Email cannot be changed</p>
                </div>

                <div className="form-group">
                  <label className="label">Phone Number</label>
                  <input
                    type="tel"
                    className="input"
                    placeholder="+1 (555) 000-0000"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-fit">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      Save Changes
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handlePasswordChange} className="stack-md">
                <div className="form-group">
                  <label className="label">Current Password</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="••••••••"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="label">New Password</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="••••••••"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="label">Confirm New Password</label>
                  <input
                    type="password"
                    className="input"
                    placeholder="••••••••"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-fit">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      Change Password
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
