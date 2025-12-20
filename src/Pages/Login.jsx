import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [activeRole, setActiveRole] = useState('student');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const roles = [
    { id: 'student', label: 'Student', color: '#3B82F6' },
    { id: 'admin', label: 'Admin', color: '#8B5CF6' },
    { id: 'proctor', label: 'Proctor', color: '#10B981' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
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
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const currentRole = roles.find(r => r.id === activeRole);

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
              <circle cx="200" cy="200" r="150" fill="#EEF2FF" />
              <circle cx="200" cy="200" r="120" fill="#E0E7FF" opacity="0.5" />

              {/* Login Form Illustration */}
              <rect x="120" y="100" width="160" height="180" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />

              {/* Avatar Circle */}
              <circle cx="200" cy="145" r="30" fill="#DBEAFE" />
              <circle cx="200" cy="140" r="12" fill="#3B82F6" />
              <ellipse cx="200" cy="162" rx="18" ry="12" fill="#3B82F6" />

              {/* Input Fields */}
              <rect x="145" y="185" width="110" height="12" rx="6" fill="#E2E8F0" />
              <rect x="145" y="205" width="110" height="12" rx="6" fill="#E2E8F0" />

              {/* Dots (Password) */}
              <circle cx="155" cy="231" r="4" fill="#94A3B8" />
              <circle cx="170" cy="231" r="4" fill="#94A3B8" />
              <circle cx="185" cy="231" r="4" fill="#94A3B8" />
              <circle cx="200" cy="231" r="4" fill="#94A3B8" />
              <circle cx="215" cy="231" r="4" fill="#94A3B8" />
              <circle cx="230" cy="231" r="4" fill="#94A3B8" />

              {/* Button */}
              <rect x="145" y="250" width="110" height="20" rx="10" fill="#3B82F6" />

              {/* Person */}
              <ellipse cx="100" cy="320" rx="35" ry="8" fill="#E2E8F0" />
              <path d="M85 320 L85 260 Q85 240 100 240 Q115 240 115 260 L115 320" fill="#60A5FA" />
              <circle cx="100" cy="225" r="20" fill="#FBBF24" />
              <circle cx="94" cy="222" r="3" fill="#1E293B" />
              <circle cx="106" cy="222" r="3" fill="#1E293B" />
              <path d="M95 230 Q100 235 105 230" stroke="#1E293B" strokeWidth="2" fill="none" />

              {/* Key */}
              <ellipse cx="70" cy="290" rx="15" ry="8" fill="#FCD34D" transform="rotate(-30 70 290)" />
              <rect x="80" y="285" width="40" height="8" rx="2" fill="#FCD34D" transform="rotate(-30 80 285)" />
              <rect x="108" y="270" width="8" height="15" rx="2" fill="#FCD34D" transform="rotate(-30 108 270)" />
              <rect x="118" y="265" width="8" height="12" rx="2" fill="#FCD34D" transform="rotate(-30 118 265)" />

              {/* Lock Icon */}
              <rect x="290" y="260" width="40" height="35" rx="6" fill="#FEE2E2" stroke="#F87171" strokeWidth="2" />
              <path d="M300 260 L300 250 Q310 235 320 250 L320 260" fill="none" stroke="#F87171" strokeWidth="3" />
              <circle cx="310" cy="278" r="5" fill="#F87171" />
              <rect x="308" y="280" width="4" height="8" fill="#F87171" />

              {/* Decorative Elements */}
              <circle cx="320" cy="120" r="8" fill="#A5B4FC" />
              <circle cx="80" cy="150" r="6" fill="#FCD34D" />
              <rect x="330" y="200" width="15" height="15" rx="3" fill="#86EFAC" transform="rotate(15 337 207)" />
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
            <h1 style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#1E293B',
              marginBottom: '32px',
              textAlign: 'center'
            }}>
              Login
            </h1>

            {/* Role Tabs */}
            <div style={{
              display: 'flex',
              backgroundColor: '#F1F5F9',
              borderRadius: '10px',
              padding: '4px',
              marginBottom: '28px'
            }}>
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setActiveRole(role.id)}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
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

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#475569',
                  marginBottom: '8px'
                }}>
                  Email
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                      e.target.style.borderColor = currentRole.color;
                      e.target.style.boxShadow = `0 0 0 3px ${currentRole.color}20`;
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

              {/* Password Field */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#475569',
                  marginBottom: '8px'
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter your password"
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
                      e.target.style.borderColor = currentRole.color;
                      e.target.style.boxShadow = `0 0 0 3px ${currentRole.color}20`;
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = '#E2E8F0';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#94A3B8',
                      padding: '0',
                      display: 'flex'
                    }}
                  >
                    {showPassword ? (
                      <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: currentRole.color,
                      cursor: 'pointer'
                    }}
                  />
                  <span style={{ fontSize: '14px', color: '#64748B' }}>Remember Me</span>
                </label>
                <Link
                  to="/forgot-password"
                  style={{
                    fontSize: '14px',
                    color: currentRole.color,
                    textDecoration: 'none',
                    fontWeight: '500'
                  }}
                >
                  Forgot Password?
                </Link>
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
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>

            {/* Sign Up Link */}
            <p style={{
              textAlign: 'center',
              marginTop: '24px',
              fontSize: '14px',
              color: '#64748B'
            }}>
              Don't have an account?{' '}
              <Link
                to="/register"
                style={{
                  color: currentRole.color,
                  textDecoration: 'none',
                  fontWeight: '600'
                }}
              >
                Sign up
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

export default Login;
