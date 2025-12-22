import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'proctor') return '/proctor';
    return '/dashboard';
  };

  return (
    <nav className="bg-card/90 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-text-primary">AssessHub</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm text-text-muted hover:text-text-primary transition-colors no-underline">
              Features
            </a>
            <a href="#pricing" className="text-sm text-text-muted hover:text-text-primary transition-colors no-underline">
              Pricing
            </a>
            <a href="#about" className="text-sm text-text-muted hover:text-text-primary transition-colors no-underline">
              About
            </a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link to={getDashboardLink()} className="btn-primary text-sm no-underline">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm no-underline">
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary text-sm no-underline">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-transparent border-none cursor-pointer text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-colors"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              <a href="#features" className="py-2 px-4 text-text-muted hover:text-text-primary hover:bg-surface-secondary rounded-lg transition-colors no-underline">
                Features
              </a>
              <a href="#pricing" className="py-2 px-4 text-text-muted hover:text-text-primary hover:bg-surface-secondary rounded-lg transition-colors no-underline">
                Pricing
              </a>
              <a href="#about" className="py-2 px-4 text-text-muted hover:text-text-primary hover:bg-surface-secondary rounded-lg transition-colors no-underline">
                About
              </a>
              <div className="border-t border-border my-2"></div>
              {user ? (
                <Link to={getDashboardLink()} className="btn-primary text-center no-underline">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary text-center no-underline">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary text-center no-underline">
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
