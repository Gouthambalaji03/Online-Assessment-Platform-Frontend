import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-card border-b border-border h-16">
      <div className="max-w-full h-full px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 no-underline">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-text-primary">AssessHub</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                to={user.role === 'admin' ? '/admin' : user.role === 'proctor' ? '/proctor' : '/dashboard'}
                className="text-text-secondary no-underline text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 hover:bg-surface-secondary hover:text-text-primary"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-3">
                <div className="avatar">
                  {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
                </div>
                <span className="text-sm text-text-secondary font-medium">
                  {user.firstName} {user.lastName}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-transparent border-none p-2 cursor-pointer text-text-muted flex items-center justify-center rounded-lg transition-all duration-200 hover:bg-surface-secondary hover:text-text-primary"
                  title="Logout"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-surface-secondary text-text-secondary py-2.5 px-5 rounded-lg text-sm font-medium no-underline transition-all duration-200 hover:bg-border"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary py-2.5 px-5 no-underline"
              >
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
