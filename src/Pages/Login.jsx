import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';
import api from '../Services/api';

const Login = () => {
  const [activeRole, setActiveRole] = useState('student');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { id: 'student', label: 'Student' },
    { id: 'admin', label: 'Admin' },
    { id: 'proctor', label: 'Proctor' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNeedsVerification(false);
    try {
      const user = await login(formData.email, formData.password, activeRole);
      toast.success('Login successful!');
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'proctor') {
        navigate('/proctor');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response?.data?.needsVerification) {
        setNeedsVerification(true);
        toast.warning('Please verify your email to continue');
      } else {
        toast.error(error.response?.data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setResendingEmail(true);
    try {
      await api.post('/auth/resend-verification', { email: formData.email });
      toast.success('Verification email sent! Check your inbox.');
      setNeedsVerification(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send verification email');
    } finally {
      setResendingEmail(false);
    }
  };

  const getRoleColor = () => {
    if (activeRole === 'student') return 'text-primary';
    if (activeRole === 'admin') return 'text-purple-500';
    return 'text-emerald-500';
  };

  const getButtonBg = () => {
    if (activeRole === 'student') return 'bg-primary hover:bg-primary-hover';
    if (activeRole === 'admin') return 'bg-purple-500 hover:bg-purple-600';
    return 'bg-emerald-500 hover:bg-emerald-600';
  };

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col">
      {/* Header - responsive */}
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

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="bg-card rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl flex flex-col lg:flex-row max-w-[900px] w-full overflow-hidden">
          {/* Left side - Illustration (hidden on mobile/tablet) */}
          <div className="hidden lg:flex flex-1 bg-surface p-8 xl:p-12 items-center justify-center border-r border-border">
            <svg viewBox="0 0 400 400" className="w-full max-w-[240px] xl:max-w-[280px]">
              <circle cx="200" cy="200" r="150" fill="#EEF2FF" />
              <circle cx="200" cy="200" r="120" fill="#E0E7FF" opacity="0.5" />
              <rect x="120" y="100" width="160" height="180" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
              <circle cx="200" cy="145" r="30" fill="#DBEAFE" />
              <circle cx="200" cy="140" r="12" fill="#3B82F6" />
              <ellipse cx="200" cy="162" rx="18" ry="12" fill="#3B82F6" />
              <rect x="145" y="185" width="110" height="12" rx="6" fill="#E2E8F0" />
              <rect x="145" y="205" width="110" height="12" rx="6" fill="#E2E8F0" />
              <circle cx="155" cy="231" r="4" fill="#94A3B8" />
              <circle cx="170" cy="231" r="4" fill="#94A3B8" />
              <circle cx="185" cy="231" r="4" fill="#94A3B8" />
              <circle cx="200" cy="231" r="4" fill="#94A3B8" />
              <circle cx="215" cy="231" r="4" fill="#94A3B8" />
              <circle cx="230" cy="231" r="4" fill="#94A3B8" />
              <rect x="145" y="250" width="110" height="20" rx="10" fill="#3B82F6" />
              <ellipse cx="100" cy="320" rx="35" ry="8" fill="#E2E8F0" />
              <path d="M85 320 L85 260 Q85 240 100 240 Q115 240 115 260 L115 320" fill="#60A5FA" />
              <circle cx="100" cy="225" r="20" fill="#FBBF24" />
              <circle cx="94" cy="222" r="3" fill="#1E293B" />
              <circle cx="106" cy="222" r="3" fill="#1E293B" />
              <path d="M95 230 Q100 235 105 230" stroke="#1E293B" strokeWidth="2" fill="none" />
              <ellipse cx="70" cy="290" rx="15" ry="8" fill="#FCD34D" transform="rotate(-30 70 290)" />
              <rect x="80" y="285" width="40" height="8" rx="2" fill="#FCD34D" transform="rotate(-30 80 285)" />
              <rect x="108" y="270" width="8" height="15" rx="2" fill="#FCD34D" transform="rotate(-30 108 270)" />
              <rect x="118" y="265" width="8" height="12" rx="2" fill="#FCD34D" transform="rotate(-30 118 265)" />
              <rect x="290" y="260" width="40" height="35" rx="6" fill="#FEE2E2" stroke="#F87171" strokeWidth="2" />
              <path d="M300 260 L300 250 Q310 235 320 250 L320 260" fill="none" stroke="#F87171" strokeWidth="3" />
              <circle cx="310" cy="278" r="5" fill="#F87171" />
              <rect x="308" y="280" width="4" height="8" fill="#F87171" />
              <circle cx="320" cy="120" r="8" fill="#A5B4FC" />
              <circle cx="80" cy="150" r="6" fill="#FCD34D" />
              <rect x="330" y="200" width="15" height="15" rx="3" fill="#86EFAC" transform="rotate(15 337 207)" />
            </svg>
          </div>

          {/* Right side - Form */}
          <div className="flex-1 p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col justify-center">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-text-primary mb-6 sm:mb-8 text-center">Welcome Back</h1>

            {/* Role selector */}
            <div className="flex bg-surface-secondary rounded-lg sm:rounded-xl p-1 mb-5 sm:mb-7 gap-1">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setActiveRole(role.id)}
                  className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 rounded-md sm:rounded-lg border-none text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-200 ${
                    activeRole === role.id
                      ? `bg-card shadow-sm ${getRoleColor()}`
                      : 'bg-transparent text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5">
              <div className="form-group">
                <label className="label text-sm sm:text-base">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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

              <div className="form-group">
                <label className="label text-sm sm:text-base">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
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

              <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="checkbox" />
                  <span className="text-xs sm:text-sm text-text-muted">Remember me</span>
                </label>
                <Link to="/forgot-password" className={`text-xs sm:text-sm font-medium no-underline ${getRoleColor()} hover:underline`}>
                  Forgot Password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 sm:py-3.5 px-4 sm:px-6 text-sm sm:text-base font-semibold text-white rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 border-none active:scale-[0.98] ${
                  loading ? 'bg-text-light cursor-not-allowed' : getButtonBg()
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  'Sign in'
                )}
              </button>

              {needsVerification && (
                <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-warning-light rounded-lg sm:rounded-xl border border-warning">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-warning shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-semibold text-warning-dark mb-1 sm:mb-2">Email Verification Required</p>
                      <p className="text-xs text-warning-dark mb-2 sm:mb-3">
                        Please check your email inbox and click the verification link to activate your account.
                      </p>
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={resendingEmail}
                        className={`py-1.5 sm:py-2 px-3 sm:px-4 text-white rounded-md sm:rounded-lg text-xs font-medium transition-colors border-none cursor-pointer ${
                          resendingEmail ? 'bg-text-light cursor-not-allowed' : 'bg-warning hover:bg-warning-dark'
                        }`}
                      >
                        {resendingEmail ? 'Sending...' : 'Resend Verification Email'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>

            <p className="text-center mt-5 sm:mt-6 text-xs sm:text-sm text-text-muted">
              Don't have an account?{' '}
              <Link to="/register" className={`font-semibold no-underline ${getRoleColor()} hover:underline`}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
