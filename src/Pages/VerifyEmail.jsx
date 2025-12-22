import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../Services/api';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    try {
      await api.get(`/auth/verify-email/${token}`);
      setStatus('success');
      setMessage('Your email has been verified successfully. You can now login to your account.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
    }
  };

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col">
      <header className="bg-card border-b border-border py-4 px-8">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-text-primary">AssessHub</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-5">
        <div className="bg-card rounded-2xl shadow-xl p-8 md:p-10 max-w-md w-full text-center">
          {status === 'verifying' && (
            <>
              <div className="w-16 h-16 border-4 border-border border-t-primary rounded-full animate-spin mx-auto mb-6"></div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">Verifying Email</h1>
              <p className="text-text-muted">Please wait while we verify your email address...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-success-light flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-3">Email Verified!</h1>
              <p className="text-text-muted mb-6">{message}</p>
              <Link to="/login" className="btn-primary w-full no-underline">
                Continue to Login
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 rounded-2xl bg-error-light flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-3">Verification Failed</h1>
              <p className="text-text-muted mb-6">{message}</p>
              <div className="flex flex-col gap-3">
                <Link to="/login" className="btn-primary w-full no-underline">
                  Go to Login
                </Link>
                <Link to="/register" className="btn-secondary w-full no-underline">
                  Create New Account
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default VerifyEmail;
