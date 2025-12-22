import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../Services/api';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resendStatus, setResendStatus] = useState(''); // '', 'sending', 'sent', 'error'
  const [resendMessage, setResendMessage] = useState('');
  const hasVerified = useRef(false);

  useEffect(() => {
    if (token && !hasVerified.current) {
      hasVerified.current = true;
      verifyEmail();
    }
  }, [token]);

  const verifyEmail = async () => {
    try {
      const response = await api.get(`/auth/verify-email/${token}`);
      setStatus('success');
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
    }
  };

  const handleResendVerification = async (e) => {
    e.preventDefault();
    if (!resendEmail) return;

    setResendStatus('sending');
    try {
      const response = await api.post('/auth/resend-verification', { email: resendEmail });
      setResendStatus('sent');
      setResendMessage(response.data.message);
    } catch (error) {
      setResendStatus('error');
      setResendMessage(error.response?.data?.message || 'Failed to resend verification email');
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
        <div style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          padding: '48px',
          maxWidth: '450px',
          width: '100%',
          textAlign: 'center'
        }}>
          {status === 'verifying' && (
            <>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px',
                border: '4px solid #E2E8F0',
                borderTopColor: '#3B82F6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>
                Verifying Your Email
              </h2>
              <p style={{ color: '#64748B', fontSize: '16px' }}>
                Please wait while we verify your email address...
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px',
                backgroundColor: '#D1FAE5',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg style={{ width: '40px', height: '40px', color: '#10B981' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>
                Email Verified!
              </h2>
              <p style={{ color: '#64748B', fontSize: '16px', marginBottom: '24px' }}>
                {message}
              </p>
              <p style={{ color: '#94A3B8', fontSize: '14px', marginBottom: '24px' }}>
                Redirecting to login in 3 seconds...
              </p>
              <Link
                to="/login"
                style={{
                  display: 'inline-block',
                  padding: '12px 32px',
                  backgroundColor: '#10B981',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '10px',
                  fontWeight: '600',
                  transition: 'background-color 0.2s'
                }}
              >
                Go to Login
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div style={{
                width: '80px',
                height: '80px',
                margin: '0 auto 24px',
                backgroundColor: '#FEE2E2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg style={{ width: '40px', height: '40px', color: '#EF4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1E293B', marginBottom: '12px' }}>
                Verification Failed
              </h2>
              <p style={{ color: '#64748B', fontSize: '16px', marginBottom: '24px' }}>
                {message}
              </p>

              {/* Resend Verification Form */}
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1E293B', marginBottom: '12px' }}>
                  Need a new verification link?
                </h3>
                <form onSubmit={handleResendVerification}>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      marginBottom: '12px',
                      boxSizing: 'border-box'
                    }}
                    required
                  />
                  <button
                    type="submit"
                    disabled={resendStatus === 'sending'}
                    style={{
                      width: '100%',
                      padding: '12px',
                      backgroundColor: resendStatus === 'sending' ? '#94A3B8' : '#10B981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: resendStatus === 'sending' ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {resendStatus === 'sending' ? 'Sending...' : 'Resend Verification Email'}
                  </button>
                </form>
                {resendStatus === 'sent' && (
                  <p style={{ color: '#10B981', fontSize: '14px', marginTop: '12px', textAlign: 'center' }}>
                    {resendMessage}
                  </p>
                )}
                {resendStatus === 'error' && (
                  <p style={{ color: '#EF4444', fontSize: '14px', marginTop: '12px', textAlign: 'center' }}>
                    {resendMessage}
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                  to="/login"
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    backgroundColor: '#F1F5F9',
                    color: '#475569',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    fontWeight: '600'
                  }}
                >
                  Go to Login
                </Link>
                <Link
                  to="/register"
                  style={{
                    display: 'inline-block',
                    padding: '12px 24px',
                    backgroundColor: '#3B82F6',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '10px',
                    fontWeight: '600'
                  }}
                >
                  Register Again
                </Link>
              </div>
            </>
          )}
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

export default VerifyEmail;
