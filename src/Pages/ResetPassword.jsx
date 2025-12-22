import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../Services/api';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password: formData.password });
      setResetSuccess(true);
      toast.success('Password reset successful!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F1F5F9',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '16px 32px'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: '#3B82F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg style={{ width: '20px', height: '20px', color: 'white' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B' }}>AssessHub</span>
        </Link>
      </header>

      {/* Main Content */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        {/* Card Container */}
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          maxWidth: '900px',
          width: '100%',
          overflow: 'hidden'
        }}>
          {/* Left Side - Illustration */}
          <div style={{
            flex: '1',
            backgroundColor: '#F8FAFC',
            padding: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRight: '1px solid #E2E8F0'
          }} className="hide-mobile">
            <svg viewBox="0 0 400 400" style={{ width: '100%', maxWidth: '320px' }}>
              {/* Background Elements */}
              <circle cx="200" cy="200" r="150" fill="#DCFCE7" />
              <circle cx="200" cy="200" r="120" fill="#BBF7D0" opacity="0.5" />

              {/* Shield with Lock */}
              <path d="M200 80 L280 120 L280 200 Q280 280 200 320 Q120 280 120 200 L120 120 Z" fill="#FFFFFF" stroke="#10B981" strokeWidth="4" />

              {/* Lock Inside Shield */}
              <rect x="165" y="160" width="70" height="60" rx="10" fill="#10B981" />
              <rect x="175" y="140" width="50" height="30" rx="25" fill="none" stroke="#10B981" strokeWidth="6" />

              {/* Checkmark */}
              <circle cx="200" cy="185" r="15" fill="#FFFFFF" />
              <path d="M190 185 L197 192 L212 177" stroke="#10B981" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />

              {/* Stars */}
              <polygon points="320,100 323,110 333,110 325,117 328,127 320,121 312,127 315,117 307,110 317,110" fill="#FBBF24" />
              <polygon points="90,150 92,157 100,157 94,162 96,170 90,165 84,170 86,162 80,157 88,157" fill="#FBBF24" />
              <polygon points="330,250 332,257 340,257 334,262 336,270 330,265 324,270 326,262 320,257 328,257" fill="#FBBF24" />

              {/* Decorative Elements */}
              <circle cx="70" cy="280" r="10" fill="#A5B4FC" />
              <rect x="300" cy="320" width="20" height="20" rx="5" fill="#86EFAC" transform="rotate(15 310 330)" />
            </svg>
          </div>

          {/* Right Side - Form */}
          <div style={{
            flex: '1',
            padding: '48px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {!resetSuccess ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <svg style={{ width: '32px', height: '32px', color: '#10B981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h1 style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#1E293B',
                    marginBottom: '12px'
                  }}>
                    Set New Password
                  </h1>
                  <p style={{
                    fontSize: '15px',
                    color: '#64748B',
                    lineHeight: '1.6'
                  }}>
                    Your new password must be different from previously used passwords.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* New Password Field */}
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#475569',
                      marginBottom: '8px'
                    }}>
                      New Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="Enter new password"
                        required
                        style={{
                          width: '100%',
                          padding: '14px 48px 14px 16px',
                          fontSize: '15px',
                          border: '1px solid #E2E8F0',
                          borderRadius: '10px',
                          backgroundColor: '#FFFFFF',
                          color: '#1E293B',
                          outline: 'none',
                          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#10B981';
                          e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#E2E8F0';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: 'absolute',
                          right: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#94A3B8',
                          padding: '0',
                          display: 'flex'
                        }}
                      >
                        {showPassword ? (
                          <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px' }}>
                      Must be at least 6 characters
                    </p>
                  </div>

                  {/* Confirm Password Field */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#475569',
                      marginBottom: '8px'
                    }}>
                      Confirm Password
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        required
                        style={{
                          width: '100%',
                          padding: '14px 48px 14px 16px',
                          fontSize: '15px',
                          border: '1px solid #E2E8F0',
                          borderRadius: '10px',
                          backgroundColor: '#FFFFFF',
                          color: '#1E293B',
                          outline: 'none',
                          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
                          boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#10B981';
                          e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#E2E8F0';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{
                          position: 'absolute',
                          right: '16px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#94A3B8',
                          padding: '0',
                          display: 'flex'
                        }}
                      >
                        {showConfirmPassword ? (
                          <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '14px 24px',
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#FFFFFF',
                      backgroundColor: loading ? '#94A3B8' : '#10B981',
                      border: 'none',
                      borderRadius: '10px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {loading ? (
                      <>
                        <div style={{
                          width: '20px',
                          height: '20px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTopColor: 'white',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }}></div>
                        Resetting...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px'
                }}>
                  <svg style={{ width: '32px', height: '32px', color: '#10B981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#1E293B',
                  marginBottom: '12px'
                }}>
                  Password Reset!
                </h2>
                <p style={{
                  fontSize: '15px',
                  color: '#64748B',
                  lineHeight: '1.6',
                  marginBottom: '24px'
                }}>
                  Your password has been successfully reset.<br />
                  You can now login with your new password.
                </p>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    backgroundColor: '#10B981',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Continue to Login
                </button>
              </div>
            )}

            {/* Back to Login Link */}
            <div style={{
              textAlign: 'center',
              marginTop: '24px'
            }}>
              <Link
                to="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#64748B',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}
              >
                <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to login
              </Link>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .hide-mobile { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;
