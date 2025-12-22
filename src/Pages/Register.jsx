import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [activeRole, setActiveRole] = useState('student');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    secretCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { id: 'student', label: 'Student', color: 'blue', needsCode: false },
    { id: 'admin', label: 'Admin', color: 'purple', needsCode: true },
    { id: 'proctor', label: 'Proctor', color: 'green', needsCode: true }
  ];

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

    const currentRole = roles.find(r => r.id === activeRole);
    if (currentRole.needsCode && !formData.secretCode) {
      toast.error(`${currentRole.label} registration requires a secret code`);
      return;
    }

    if (!agreeTerms) {
      toast.error('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setLoading(true);
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: activeRole,
        secretCode: formData.secretCode
      });
      toast.success('Registration successful! Please check your email to verify your account.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const currentRole = roles.find(r => r.id === activeRole);

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

      <main className="flex-1 flex items-center justify-center p-5 md:p-10">
        <div className="bg-card rounded-2xl shadow-xl flex max-w-[950px] w-full overflow-hidden">
          <div className="w-[420px] shrink-0 bg-surface p-12 hidden md:flex flex-col items-center justify-center border-r border-border">
            <svg viewBox="0 0 400 400" className="w-full max-w-[280px] mb-8">
              <circle cx="200" cy="200" r="150" fill="#EEF2FF" />
              <circle cx="200" cy="200" r="120" fill="#E0E7FF" opacity="0.5" />
              <rect x="110" y="80" width="180" height="220" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
              <rect x="130" y="100" width="140" height="8" rx="4" fill="#E2E8F0" />
              <circle cx="200" cy="145" r="25" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" strokeDasharray="5 3" />
              <line x1="200" y1="135" x2="200" y2="155" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
              <line x1="190" y1="145" x2="210" y2="145" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
              <rect x="130" y="185" width="60" height="10" rx="5" fill="#E2E8F0" />
              <rect x="200" y="185" width="60" height="10" rx="5" fill="#E2E8F0" />
              <rect x="130" y="205" width="130" height="10" rx="5" fill="#E2E8F0" />
              <rect x="130" y="225" width="130" height="10" rx="5" fill="#E2E8F0" />
              <rect x="130" y="245" width="130" height="10" rx="5" fill="#E2E8F0" />
              <rect x="130" y="265" width="12" height="12" rx="2" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1" />
              <rect x="148" y="268" width="80" height="6" rx="3" fill="#E2E8F0" />
              <rect x="130" y="285" width="130" height="20" rx="10" fill="#3B82F6" />
              <ellipse cx="320" cy="320" rx="30" ry="6" fill="#E2E8F0" />
              <path d="M305 320 L305 275 Q305 260 320 260 Q335 260 335 275 L335 320" fill="#818CF8" />
              <circle cx="320" cy="245" r="18" fill="#FCD34D" />
              <circle cx="314" cy="242" r="2.5" fill="#1E293B" />
              <circle cx="326" cy="242" r="2.5" fill="#1E293B" />
              <path d="M315 250 Q320 254 325 250" stroke="#1E293B" strokeWidth="1.5" fill="none" />
              <rect x="280" y="280" width="8" height="40" rx="1" fill="#FCD34D" transform="rotate(-45 284 300)" />
              <polygon points="275,320 280,325 270,330" fill="#F8B4B4" transform="rotate(-45 275 325)" />
              <circle cx="80" cy="150" r="8" fill="#86EFAC" />
              <circle cx="320" cy="100" r="6" fill="#FCD34D" />
              <rect x="70" y="250" width="12" height="12" rx="2" fill="#A5B4FC" transform="rotate(15 76 256)" />
              <circle cx="100" cy="300" r="5" fill="#FBBF24" />
            </svg>

            <h2 className="text-xl font-bold text-text-primary mb-2 text-center">Join AssessHub Today</h2>
            <p className="text-sm text-text-muted text-center leading-relaxed">
              Create your account and start your journey with seamless online assessments.
            </p>
          </div>

          <div className="flex-1 p-8 md:p-10 overflow-y-auto max-h-[85vh]">
            <h1 className="text-2xl font-bold text-text-primary mb-6 text-center">Create Account</h1>

            <div className="flex bg-surface-secondary rounded-xl p-1 mb-6 gap-1">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setActiveRole(role.id)}
                  className={`flex-1 py-2.5 px-3 rounded-lg border-none text-sm font-semibold cursor-pointer transition-all duration-200 ${
                    activeRole === role.id
                      ? `bg-card shadow-sm ${getRoleColor()}`
                      : 'bg-transparent text-text-muted hover:text-text-secondary'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>

            {currentRole.needsCode && (
              <div className="bg-warning-light border border-warning rounded-xl py-3 px-4 mb-5 flex items-center gap-3">
                <svg className="w-5 h-5 text-warning-dark shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-xs text-warning-dark">
                  {currentRole.label} registration requires an organization code from your administrator.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John"
                    required
                    className="input"
                  />
                </div>
                <div className="form-group">
                  <label className="label">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                    required
                    className="input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="label">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                    className="input pr-11"
                  />
                  <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-light">
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
                    placeholder="Create a password"
                    required
                    className="input pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-text-light p-0 flex hover:text-text-secondary"
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

              <div className="form-group">
                <label className="label">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm your password"
                    required
                    className="input pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-text-light p-0 flex hover:text-text-secondary"
                  >
                    {showConfirmPassword ? (
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

              {currentRole.needsCode && (
                <div className="form-group">
                  <label className="label">
                    Organization Code <span className="text-error">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={formData.secretCode}
                      onChange={(e) => setFormData({ ...formData, secretCode: e.target.value })}
                      placeholder="Enter organization code"
                      required
                      className="input pr-11 bg-warning-light/30 border-warning focus:border-warning-dark"
                    />
                    <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-warning">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="checkbox mt-0.5"
                />
                <span className="text-xs text-text-muted leading-relaxed">
                  I agree to the{' '}
                  <a href="#" className={`no-underline font-medium ${getRoleColor()} hover:underline`}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className={`no-underline font-medium ${getRoleColor()} hover:underline`}>Privacy Policy</a>
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-6 text-base font-semibold text-white rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 border-none ${
                  loading ? 'bg-text-light cursor-not-allowed' : getButtonBg()
                }`}
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            <p className="text-center mt-5 text-sm text-text-muted">
              Already have an account?{' '}
              <Link to="/login" className={`font-semibold no-underline ${getRoleColor()} hover:underline`}>
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
