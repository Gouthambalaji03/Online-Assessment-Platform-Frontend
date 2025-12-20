import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navStyle = {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    zIndex: '40',
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #E2E8F0',
    height: '64px'
  };

  const containerStyle = {
    maxWidth: '100%',
    height: '100%',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const logoContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none'
  };

  const logoIconStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    backgroundColor: '#2563EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const logoTextStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1E293B'
  };

  const rightSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  };

  const dashboardLinkStyle = {
    color: '#475569',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    padding: '8px 16px',
    borderRadius: '8px',
    transition: 'all 0.2s ease'
  };

  const userAvatarStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '600',
    color: '#FFFFFF'
  };

  const userNameStyle = {
    fontSize: '14px',
    color: '#475569',
    fontWeight: '500'
  };

  const logoutBtnStyle = {
    background: 'none',
    border: 'none',
    padding: '8px',
    cursor: 'pointer',
    color: '#64748B',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
    transition: 'all 0.2s ease'
  };

  const authBtnPrimaryStyle = {
    backgroundColor: '#2563EB',
    color: '#FFFFFF',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'all 0.2s ease'
  };

  const authBtnSecondaryStyle = {
    backgroundColor: '#F1F5F9',
    color: '#475569',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'all 0.2s ease'
  };

  return (
    <nav style={navStyle}>
      <div style={containerStyle}>
        <Link to="/" style={logoContainerStyle}>
          <div style={logoIconStyle}>
            <svg style={{ width: '24px', height: '24px', color: '#FFFFFF' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span style={logoTextStyle}>AssessHub</span>
        </Link>

        <div style={rightSectionStyle}>
          {user ? (
            <>
              <Link
                to={user.role === 'admin' ? '/admin' : user.role === 'proctor' ? '/proctor' : '/dashboard'}
                style={dashboardLinkStyle}
              >
                Dashboard
              </Link>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={userAvatarStyle}>
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </div>
                <span style={userNameStyle}>
                  {user.firstName} {user.lastName}
                </span>
                <button
                  onClick={handleLogout}
                  style={logoutBtnStyle}
                  title="Logout"
                >
                  <svg style={{ width: '20px', height: '20px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" style={authBtnSecondaryStyle}>
                Sign In
              </Link>
              <Link to="/register" style={authBtnPrimaryStyle}>
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
