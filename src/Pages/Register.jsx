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
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { id: 'student', label: 'Student', icon: '🎓', needsCode: false },
    { id: 'admin', label: 'Admin', icon: '⚙️', needsCode: true },
    { id: 'proctor', label: 'Proctor', icon: '👁️', needsCode: true }
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

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-[#F8FAFC]">
        <div className="w-full max-w-[420px]">
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#2563EB] flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-[#1E293B]">AssessHub</span>
            </Link>
            <Link to="/login" className="text-sm text-[#64748B] hover:text-[#1E293B] transition-colors">
              Have an account? <span className="text-[#2563EB] font-semibold">Sign in</span>
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-[32px] font-bold text-[#1E293B] mb-2 tracking-tight">Create an account</h1>
            <p className="text-[#64748B] text-base">Start your journey with us today</p>
          </div>

          <div className="tab-group mb-6">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setActiveRole(role.id)}
                className={`tab-item ${activeRole === role.id ? 'active' : ''}`}
              >
                <span>{role.icon}</span>
                <span>{role.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">First name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="John"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">Last name</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">Email address</label>
              <input
                type="email"
                className="input-field"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-12"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#64748B] transition-colors"
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

            <div>
              <label className="block text-sm font-medium text-[#475569] mb-2">Confirm password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            {currentRole.needsCode && (
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-2">
                  {currentRole.label} Secret Code
                  <span className="text-[#EF4444] ml-1">*</span>
                </label>
                <input
                  type="password"
                  className="input-field border-[#F59E0B]/30 bg-[#FEF3C7]/30 focus:border-[#F59E0B] focus:ring-[#F59E0B]/20"
                  placeholder="Enter organization code"
                  value={formData.secretCode}
                  onChange={(e) => setFormData({ ...formData, secretCode: e.target.value })}
                  required
                />
                <p className="text-xs text-[#64748B] mt-2">Contact your administrator for the code</p>
              </div>
            )}

            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-0.5 rounded border-[#E2E8F0] text-[#2563EB] focus:ring-[#2563EB] focus:ring-offset-0"
              />
              <span className="text-sm text-[#64748B]">
                I agree to the{' '}
                <a href="#" className="text-[#2563EB] hover:text-[#1D4ED8] transition-colors">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-[#2563EB] hover:text-[#1D4ED8] transition-colors">Privacy Policy</a>
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <p className="text-center mt-6 text-[#64748B] lg:hidden">
            Already have an account?{' '}
            <Link to="/login" className="text-[#2563EB] hover:text-[#1D4ED8] font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-80 h-80 rounded-full relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm border border-white/20"></div>
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-white/15 to-transparent"></div>
            <div className="absolute inset-16 rounded-full bg-white/10"></div>
            <div className="absolute top-12 left-16 w-16 h-16 rounded-full bg-white/20 blur-xl"></div>
          </div>
        </div>
        <div className="absolute top-12 left-12 w-24 h-24 rounded-full bg-blue-400/20 blur-2xl"></div>
        <div className="absolute bottom-24 right-12 w-40 h-40 rounded-full bg-indigo-400/20 blur-2xl"></div>
        <div className="absolute bottom-12 right-12 text-right">
          <h2 className="text-2xl font-bold text-white mb-2">Join AssessHub</h2>
          <p className="text-blue-100 text-sm max-w-xs leading-relaxed">Experience seamless online assessments with our comprehensive platform.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
