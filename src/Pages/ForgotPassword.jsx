import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../Services/api';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Password reset link sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col">
      {/* Header - responsive padding */}
      <header className="bg-card border-b border-border py-3 px-4 sm:py-4 sm:px-6 md:px-8">
        <Link to="/" className="flex items-center gap-2 sm:gap-2.5 no-underline">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-primary flex items-center justify-center">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-lg sm:text-xl font-bold text-text-primary">AssessHub</span>
        </Link>
      </header>

      {/* Main content - responsive padding */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="bg-card rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl flex flex-col md:flex-row max-w-[900px] w-full overflow-hidden">
          {/* Left side - Illustration (hidden on mobile and small tablets) */}
          <div className="hidden lg:flex flex-1 bg-surface p-6 lg:p-10 xl:p-12 items-center justify-center border-r border-border">
            <svg viewBox="0 0 400 400" className="w-full max-w-[240px] xl:max-w-[280px]">
              <circle cx="200" cy="200" r="150" fill="#EEF2FF" />
              <circle cx="200" cy="200" r="120" fill="#E0E7FF" opacity="0.5" />
              {/* Key illustration */}
              <rect x="140" y="120" width="120" height="160" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
              <circle cx="200" cy="170" r="35" fill="#DBEAFE" />
              <path d="M200 150 L200 190 M185 170 L215 170" stroke="#3B82F6" strokeWidth="6" strokeLinecap="round" />
              <rect x="165" y="220" width="70" height="12" rx="6" fill="#E2E8F0" />
              <rect x="175" y="245" width="50" height="20" rx="10" fill="#3B82F6" />
              {/* Decorative elements */}
              <circle cx="100" cy="130" r="20" fill="#FEF3C7" />
              <path d="M95 125 L100 130 L110 120" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <rect x="290" y="150" width="30" height="30" rx="6" fill="#DCFCE7" />
              <path d="M300 160 L300 175 M308 167 L300 175 L292 167" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="320" cy="250" r="15" fill="#FEE2E2" />
              <path d="M315 245 L325 255 M325 245 L315 255" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" />
              <circle cx="80" cy="270" r="8" fill="#A5B4FC" />
              <rect x="110" cy="320" width="15" height="15" rx="3" fill="#86EFAC" transform="rotate(15 117 327)" />
              {/* Email envelope */}
              <rect x="270" y="90" width="50" height="35" rx="4" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
              <path d="M270 95 L295 115 L320 95" stroke="#3B82F6" strokeWidth="2" fill="none" />
            </svg>
          </div>

          {/* Right side - Form */}
          <div className="flex-1 p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col justify-center">
            {sent ? (
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-success/10 flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <svg className="w-7 h-7 sm:w-8 sm:h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-text-primary mb-2 sm:mb-3">Check Your Email</h1>
                <p className="text-sm sm:text-base text-text-muted mb-5 sm:mb-6 px-2">
                  We've sent a password reset link to <strong className="text-text-primary break-all">{email}</strong>.
                  Please check your inbox and click the link to reset your password.
                </p>
                <Link to="/login" className="btn-primary w-full no-underline inline-flex items-center justify-center text-sm sm:text-base py-3 sm:py-3.5">
                  Back to Login
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-6 sm:mb-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <svg className="w-7 h-7 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-1.5 sm:mb-2">Forgot Password?</h1>
                  <p className="text-sm sm:text-base text-text-muted">Enter your email and we'll send you a reset link</p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
                  <div className="form-group">
                    <label className="label text-sm sm:text-base">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                        className="input pr-10 sm:pr-12 text-sm sm:text-base py-2.5 sm:py-3"
                      />
                      <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-text-light">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 sm:py-3.5 px-4 sm:px-6 text-sm sm:text-base font-semibold text-white rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 border-none ${
                      loading ? 'bg-text-light cursor-not-allowed' : 'bg-primary hover:bg-primary-hover active:scale-[0.98]'
                    }`}
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      'Send Reset Link'
                    )}
                  </button>
                </form>

                <p className="text-center mt-5 sm:mt-6 text-xs sm:text-sm text-text-muted">
                  Remember your password?{' '}
                  <Link to="/login" className="text-primary font-semibold no-underline hover:underline">
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;
