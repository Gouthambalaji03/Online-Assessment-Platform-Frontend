import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../Services/api';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
      toast.success('Password reset successfully');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
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
              {/* Lock with key illustration */}
              <rect x="140" y="130" width="120" height="140" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
              {/* Lock body */}
              <rect x="165" y="170" width="70" height="60" rx="8" fill="#3B82F6" />
              <path d="M185 170 L185 150 Q200 130 215 150 L215 170" fill="none" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" />
              {/* Keyhole */}
              <circle cx="200" cy="195" r="10" fill="#DBEAFE" />
              <rect x="196" y="200" width="8" height="15" rx="2" fill="#DBEAFE" />
              {/* Key */}
              <g transform="translate(230, 260) rotate(-45)">
                <circle cx="0" cy="0" r="15" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" />
                <rect x="10" y="-4" width="40" height="8" rx="2" fill="#FCD34D" stroke="#F59E0B" strokeWidth="2" />
                <rect x="40" y="-8" width="4" height="8" fill="#F59E0B" />
                <rect x="48" y="-8" width="4" height="6" fill="#F59E0B" />
              </g>
              {/* Decorative elements */}
              <circle cx="100" cy="130" r="20" fill="#DCFCE7" />
              <path d="M95 130 L100 135 L110 125" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <rect x="290" y="150" width="30" height="30" rx="6" fill="#FEF3C7" />
              <circle cx="305" cy="165" r="8" fill="#F59E0B" />
              <circle cx="80" cy="250" r="8" fill="#A5B4FC" />
              <rect x="300" y="260" width="15" height="15" rx="3" fill="#86EFAC" transform="rotate(15 307 267)" />
              {/* Shield */}
              <path d="M320 90 L320 115 Q320 130 305 135 Q290 130 290 115 L290 90 Q305 85 320 90 Z" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
              <path d="M300 105 L305 110 L315 100" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </div>

          {/* Right side - Form */}
          <div className="flex-1 p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col justify-center">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-1.5 sm:mb-2">Reset Password</h1>
              <p className="text-sm sm:text-base text-text-muted">Enter your new password below</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
              <div className="form-group">
                <label className="label text-sm sm:text-base">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter new password"
                    required
                    className="input pr-10 sm:pr-12 text-sm sm:text-base py-2.5 sm:py-3"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-text-light p-0 flex hover:text-text-secondary"
                  >
                    {showPassword ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="label text-sm sm:text-base">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm new password"
                    required
                    className="input pr-10 sm:pr-12 text-sm sm:text-base py-2.5 sm:py-3"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-text-light p-0 flex hover:text-text-secondary"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
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
                    <span>Resetting...</span>
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </form>

            <p className="text-center mt-5 sm:mt-6 text-xs sm:text-sm text-text-muted">
              Remember your password?{' '}
              <Link to="/login" className="text-primary font-semibold no-underline hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResetPassword;
