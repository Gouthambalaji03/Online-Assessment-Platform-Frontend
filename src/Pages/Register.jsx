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
    { id: 'student', label: 'Student', color: '#3B82F6', needsCode: false },
    { id: 'admin', label: 'Admin', color: '#8B5CF6', needsCode: true },
    { id: 'proctor', label: 'Proctor', color: '#10B981', needsCode: true }
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

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: '1px solid #E2E8F0',
    borderRadius: '10px',
    backgroundColor: '#FFFFFF',
    color: '#1E293B',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    boxSizing: 'border-box'
  };

  const handleFocus = (e) => {
    e.target.style.borderColor = currentRole.color;
    e.target.style.boxShadow = `0 0 0 3px ${currentRole.color}20`;
  };

  const handleBlur = (e) => {
    e.target.style.borderColor = '#E2E8F0';
    e.target.style.boxShadow = 'none';
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
          maxWidth: '950px',
          width: '100%',
          overflow: 'hidden'
        }}>
          {/* Left Side - Illustration */}
          <div style={{
            width: '420px',
            flexShrink: 0,
            backgroundColor: '#F8FAFC',
            padding: '48px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            borderRight: '1px solid #E2E8F0'
          }} className="hide-mobile">
            <svg viewBox="0 0 400 400" style={{ width: '100%', maxWidth: '300px', marginBottom: '32px' }}>
              {/* Background */}
              <circle cx="200" cy="200" r="150" fill="#EEF2FF" />
              <circle cx="200" cy="200" r="120" fill="#E0E7FF" opacity="0.5" />

              {/* Registration Form */}
              <rect x="110" y="80" width="180" height="220" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />

              {/* Form Header */}
              <rect x="130" y="100" width="140" height="8" rx="4" fill="#E2E8F0" />

              {/* Avatar with Plus */}
              <circle cx="200" cy="145" r="25" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" strokeDasharray="5 3" />
              <line x1="200" y1="135" x2="200" y2="155" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
              <line x1="190" y1="145" x2="210" y2="145" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />

              {/* Input Fields */}
              <rect x="130" y="185" width="60" height="10" rx="5" fill="#E2E8F0" />
              <rect x="200" y="185" width="60" height="10" rx="5" fill="#E2E8F0" />
              <rect x="130" y="205" width="130" height="10" rx="5" fill="#E2E8F0" />
              <rect x="130" y="225" width="130" height="10" rx="5" fill="#E2E8F0" />
              <rect x="130" y="245" width="130" height="10" rx="5" fill="#E2E8F0" />

              {/* Checkbox */}
              <rect x="130" y="265" width="12" height="12" rx="2" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="1" />
              <rect x="148" y="268" width="80" height="6" rx="3" fill="#E2E8F0" />

              {/* Button */}
              <rect x="130" y="285" width="130" height="20" rx="10" fill="#3B82F6" />

              {/* Person */}
              <ellipse cx="320" cy="320" rx="30" ry="6" fill="#E2E8F0" />
              <path d="M305 320 L305 275 Q305 260 320 260 Q335 260 335 275 L335 320" fill="#818CF8" />
              <circle cx="320" cy="245" r="18" fill="#FCD34D" />
              <circle cx="314" cy="242" r="2.5" fill="#1E293B" />
              <circle cx="326" cy="242" r="2.5" fill="#1E293B" />
              <path d="M315 250 Q320 254 325 250" stroke="#1E293B" strokeWidth="1.5" fill="none" />

              {/* Pencil */}
              <rect x="280" y="280" width="8" height="40" rx="1" fill="#FCD34D" transform="rotate(-45 284 300)" />
              <polygon points="275,320 280,325 270,330" fill="#F8B4B4" transform="rotate(-45 275 325)" />

              {/* Decorative Elements */}
              <circle cx="80" cy="150" r="8" fill="#86EFAC" />
              <circle cx="320" cy="100" r="6" fill="#FCD34D" />
              <rect x="70" y="250" width="12" height="12" rx="2" fill="#A5B4FC" transform="rotate(15 76 256)" />
              <circle cx="100" cy="300" r="5" fill="#FBBF24" />
            </svg>

            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1E293B', marginBottom: '8px', textAlign: 'center' }}>
              Join AssessHub Today
            </h2>
            <p style={{ fontSize: '14px', color: '#64748B', textAlign: 'center', lineHeight: '1.6' }}>
              Create your account and start your journey with seamless online assessments.
            </p>
          </div>

          {/* Right Side - Form */}
          <div style={{
            flex: 1,
            padding: '40px 48px',
            overflowY: 'auto',
            maxHeight: '80vh'
          }}>
            <h1 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1E293B',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              Create Account
            </h1>

            {/* Role Tabs */}
            <div style={{
              display: 'flex',
              backgroundColor: '#F1F5F9',
              borderRadius: '10px',
              padding: '4px',
              marginBottom: '24px'
            }}>
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setActiveRole(role.id)}
                  style={{
                    flex: 1,
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: activeRole === role.id ? '#FFFFFF' : 'transparent',
                    color: activeRole === role.id ? role.color : '#64748B',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: activeRole === role.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  {role.label}
                </button>
              ))}
            </div>

            {currentRole.needsCode && (
              <div style={{
                backgroundColor: '#FEF3C7',
                border: '1px solid #FCD34D',
                borderRadius: '8px',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <svg style={{ width: '20px', height: '20px', color: '#D97706', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span style={{ fontSize: '13px', color: '#92400E' }}>
                  {currentRole.label} registration requires an organization code from your administrator.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Name Fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="John"
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="Doe"
                    required
                    style={inputStyle}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                    style={{ ...inputStyle, paddingRight: '44px' }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                    <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Password */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Create a password"
                    required
                    style={{ ...inputStyle, paddingRight: '44px' }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '0', display: 'flex' }}
                  >
                    {showPassword ? (
                      <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>
                  Confirm Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="Confirm your password"
                    required
                    style={{ ...inputStyle, paddingRight: '44px' }}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '0', display: 'flex' }}
                  >
                    {showConfirmPassword ? (
                      <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Secret Code (for Admin/Proctor) */}
              {currentRole.needsCode && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#475569', marginBottom: '6px' }}>
                    Organization Code <span style={{ color: '#EF4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      value={formData.secretCode}
                      onChange={(e) => setFormData({ ...formData, secretCode: e.target.value })}
                      placeholder="Enter organization code"
                      required
                      style={{ ...inputStyle, paddingRight: '44px', backgroundColor: '#FFFBEB', borderColor: '#FCD34D' }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#F59E0B';
                        e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.2)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#FCD34D';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: '#F59E0B' }}>
                      <svg style={{ width: '18px', height: '18px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* Terms Checkbox */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '20px' }}>
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  style={{ width: '16px', height: '16px', marginTop: '2px', accentColor: currentRole.color, cursor: 'pointer' }}
                />
                <span style={{ fontSize: '13px', color: '#64748B', lineHeight: '1.5' }}>
                  I agree to the{' '}
                  <a href="#" style={{ color: currentRole.color, textDecoration: 'none', fontWeight: '500' }}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" style={{ color: currentRole.color, textDecoration: 'none', fontWeight: '500' }}>Privacy Policy</a>
                </span>
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
                  backgroundColor: loading ? '#94A3B8' : currentRole.color,
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
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Sign In Link */}
            <p style={{
              textAlign: 'center',
              marginTop: '20px',
              fontSize: '14px',
              color: '#64748B'
            }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: currentRole.color, textDecoration: 'none', fontWeight: '600' }}>
                Sign in
              </Link>
            </p>
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

export default Register;
