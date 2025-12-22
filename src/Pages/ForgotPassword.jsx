import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../Services/api';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setEmailSent(true);
      toast.success('Password reset link sent to your email!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
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
              <circle cx="200" cy="200" r="150" fill="#FEF3C7" />
              <circle cx="200" cy="200" r="120" fill="#FDE68A" opacity="0.5" />

              {/* Lock with Key Illustration */}
              <rect x="150" y="140" width="100" height="120" rx="15" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="3" />
              <rect x="170" y="140" width="60" height="30" rx="15" fill="#FFFFFF" stroke="#F59E0B" strokeWidth="3" />
              <path d="M175 140 L175 120 Q200 90 225 120 L225 140" fill="none" stroke="#F59E0B" strokeWidth="4" />

              {/* Keyhole */}
              <circle cx="200" cy="190" r="15" fill="#F59E0B" />
              <rect x="195" y="200" width="10" height="25" fill="#F59E0B" />

              {/* Key */}
              <ellipse cx="120" cy="280" rx="25" ry="15" fill="#3B82F6" />
              <rect x="140" y="273" width="80" height="14" rx="3" fill="#3B82F6" />
              <rect x="200" y="263" width="10" height="24" rx="2" fill="#3B82F6" />
              <rect x="215" y="268" width="10" height="19" rx="2" fill="#3B82F6" />

              {/* Question Marks */}
              <text x="80" y="150" fontSize="40" fill="#F59E0B" opacity="0.6">?</text>
              <text x="300" y="180" fontSize="30" fill="#F59E0B" opacity="0.6">?</text>
              <text x="320" y="300" fontSize="25" fill="#F59E0B" opacity="0.6">?</text>

              {/* Decorative Elements */}
              <circle cx="320" cy="120" r="10" fill="#A5B4FC" />
              <circle cx="80" cy="320" r="8" fill="#86EFAC" />
              <rect x="60" y="200" width="20" height="20" rx="5" fill="#FBBF24" transform="rotate(15 70 210)" />
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
            {!emailSent ? (
              <>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px'
                  }}>
                    <svg style={{ width: '32px', height: '32px', color: '#F59E0B' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h1 style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#1E293B',
                    marginBottom: '12px'
                  }}>
                    Forgot Password?
                  </h1>
                  <p style={{
                    fontSize: '15px',
                    color: '#64748B',
                    lineHeight: '1.6'
                  }}>
                    No worries, we'll send you reset instructions.
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#475569',
                      marginBottom: '8px'
                    }}>
                      Email Address
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
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
                          e.target.style.borderColor = '#F59E0B';
                          e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#E2E8F0';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                      <div style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#94A3B8'
                      }}>
                        <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
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
                      backgroundColor: loading ? '#94A3B8' : '#F59E0B',
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
                        Sending...
                      </>
                    ) : (
                      'Send Reset Link'
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#1E293B',
                  marginBottom: '12px'
                }}>
                  Check your email
                </h2>
                <p style={{
                  fontSize: '15px',
                  color: '#64748B',
                  lineHeight: '1.6',
                  marginBottom: '24px'
                }}>
                  We sent a password reset link to<br />
                  <span style={{ fontWeight: '600', color: '#1E293B' }}>{email}</span>
                </p>
                <button
                  onClick={() => setEmailSent(false)}
                  style={{
                    width: '100%',
                    padding: '14px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#475569',
                    backgroundColor: '#F1F5F9',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Try different email
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

export default ForgotPassword;
