import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Unauthorized = () => {
  const { user } = useAuth();

  const getRedirectPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'proctor') return '/proctor';
    return '/dashboard';
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-5">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 rounded-3xl bg-error/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-12 h-12 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-text-primary mb-4">Access Denied</h1>
        <p className="text-text-muted mb-8">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <Link to={getRedirectPath()} className="btn-primary no-underline">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
