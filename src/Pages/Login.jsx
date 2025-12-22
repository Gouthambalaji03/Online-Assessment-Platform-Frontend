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
    { id: 'student', label: 'Student', color: 'blue' },
    { id: 'admin', label: 'Admin', color: 'purple' },
    { id: 'proctor', label: 'Proctor', color: 'green' }
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

  const getRoleClasses = (roleId) => {
    const baseClasses = "flex-1 py-2.5 px-4 rounded-lg border-none text-sm font-semibold cursor-pointer transition-all duration-200";
    if (activeRole === roleId) {
      return `${baseClasses} bg-white shadow-sm ${
        roleId === 'student' ? 'text-blue-500' :
        roleId === 'admin' ? 'text-purple-500' : 'text-emerald-500'
      }`;
    }
    return `${baseClasses} bg-transparent text-text-muted`;
  };

  const getButtonClasses = () => {
    const baseClasses = "w-full py-3.5 px-6 text-base font-semibold text-white rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center gap-2";
    if (loading) return `${baseClasses} bg-text-light cursor-not-allowed`;
    if (activeRole === 'student') return `${baseClasses} bg-blue-500 hover:bg-blue-600`;
    if (activeRole === 'admin') return `${baseClasses} bg-purple-500 hover:bg-purple-600`;
    return `${baseClasses} bg-emerald-500 hover:bg-emerald-600`;
  };

  const getLinkColor = () => {
    if (activeRole === 'student') return 'text-blue-500 hover:text-blue-600';
    if (activeRole === 'admin') return 'text-purple-500 hover:text-purple-600';
    return 'text-emerald-500 hover:text-emerald-600';
  };

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col">
      <header className="bg-card border-b border-border py-4 px-8">
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-9 h-9 rounded-lg bg-blue-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-text-primary">AssessHub</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-5 md:p-10">
        <div className="bg-card rounded-2xl shadow-lg flex max-w-[900px] w-full overflow-hidden">
          <div className="flex-1 bg-surface p-12 hidden md:flex items-center justify-center border-r border-border">
            <svg viewBox="0 0 400 400" className="w-full max-w-[320px]">
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

          <div className="flex-1 p-12 flex flex-col justify-center">
            <h1 className="text-3xl font-bold text-text-primary mb-8 text-center">Login</h1>

            <div className="flex bg-surface-secondary rounded-lg p-1 mb-7">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setActiveRole(role.id)}
                  className={getRoleClasses(role.id)}
                >
                  {role.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="stack-md">
              <div className="form-group">
                <label className="label">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email"
                    required
                    className="input pr-12"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="label">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
                    required
                    className="input pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-text-light p-0 flex"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="checkbox" />
                  <span className="text-sm text-text-muted">Remember Me</span>
                </label>
                <Link to="/forgot-password" className={`text-sm font-medium no-underline ${getLinkColor()}`}>
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" disabled={loading} className={getButtonClasses()}>
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>

              {needsVerification && (
                <div className="mt-5 p-4 bg-warning-light rounded-lg border border-warning">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-warning shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-warning-dark mb-2">Email Verification Required</p>
                      <p className="text-xs text-warning-dark/80 mb-3">
                        Please check your email inbox and click the verification link to activate your account.
                      </p>
                      <button
                        type="button"
                        onClick={handleResendVerification}
                        disabled={resendingEmail}
                        className={`py-2 px-4 ${resendingEmail ? 'bg-gray-300' : 'bg-warning'} text-white rounded-md text-xs font-medium ${resendingEmail ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {resendingEmail ? 'Sending...' : 'Resend Verification Email'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>

            <p className="text-center mt-6 text-sm text-text-muted">
              Don't have an account?{' '}
              <Link to="/register" className={`font-semibold no-underline ${getLinkColor()}`}>
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
