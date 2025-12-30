import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';

const Home = () => {
  const features = [
    {
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      title: 'Question Banks',
      desc: 'Create and manage comprehensive question banks with MCQs, true/false, and more.',
      color: 'primary'
    },
    {
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Exam Scheduling',
      desc: 'Schedule exams with flexible timing options and automatic notifications.',
      color: 'success'
    },
    {
      icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
      title: 'AI Proctoring',
      desc: 'Advanced proctoring with video monitoring, browser lockdown, and behavior analysis.',
      color: 'error'
    },
    {
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Auto Grading',
      desc: 'Instant automated grading for objective questions with manual review options.',
      color: 'warning'
    },
    {
      icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      title: 'Analytics',
      desc: 'Detailed performance analytics with question-wise analysis and trends.',
      color: 'info'
    },
    {
      icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      title: 'Secure Platform',
      desc: 'Enterprise-grade security with encrypted data and secure exam delivery.',
      color: 'purple'
    }
  ];

  const colorClasses = {
    primary: { bg: 'bg-primary/10', text: 'text-primary' },
    success: { bg: 'bg-success/10', text: 'text-success' },
    error: { bg: 'bg-error/10', text: 'text-error' },
    warning: { bg: 'bg-warning/10', text: 'text-warning' },
    info: { bg: 'bg-info/10', text: 'text-info' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-500' }
  };

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />

      {/* Hero Section - Responsive */}
      <section className="relative pt-20 sm:pt-24 md:pt-32 pb-12 sm:pb-16 md:pb-20 px-4 overflow-hidden">
        {/* Background gradients - responsive sizing */}
        <div className="absolute inset-0">
          <div className="absolute top-10 sm:top-20 left-1/4 w-[250px] sm:w-[350px] md:w-[500px] h-[250px] sm:h-[350px] md:h-[500px] bg-primary/10 rounded-full blur-[60px] sm:blur-[80px] md:blur-[100px]"></div>
          <div className="absolute bottom-10 sm:bottom-20 right-1/4 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] bg-success/10 rounded-full blur-[50px] sm:blur-[60px] md:blur-[80px]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center animate-fade-in">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 border border-primary/20 mb-4 sm:mb-6">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-primary text-xs sm:text-sm font-medium">Next-Gen Assessment Platform</span>
            </div>

            {/* Heading */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-text-primary">
              Transform Your
              <span className="block gradient-text">
                Online Assessments
              </span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-6 sm:mb-8 md:mb-10 leading-relaxed px-2">
              A comprehensive platform for conducting secure online exams with advanced proctoring,
              automated grading, and powerful analytics.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <Link to="/register" className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 no-underline w-full sm:w-auto justify-center">
                Get Started Free
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link to="/login" className="btn-secondary text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 no-underline w-full sm:w-auto justify-center">
                Sign In
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 sm:mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              { number: '50K+', label: 'Students' },
              { number: '1000+', label: 'Exams Conducted' },
              { number: '99.9%', label: 'Uptime' },
              { number: '4.9/5', label: 'Rating' }
            ].map((stat, i) => (
              <div key={i} className="text-center p-2 sm:p-3 md:p-4">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">{stat.number}</p>
                <p className="text-text-muted mt-1 text-xs sm:text-sm font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-text-primary">Powerful Features</h2>
            <p className="text-text-muted text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">Everything you need to conduct secure and efficient online assessments</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {features.map((feature, i) => (
              <div key={i} className="stat-card group hover:border-primary/30 p-4 sm:p-5 md:p-6">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 transition-all duration-300 ${colorClasses[feature.color].bg}`}>
                  <svg
                    className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors ${colorClasses[feature.color].text}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1.5 sm:mb-2 text-text-primary">{feature.title}</h3>
                <p className="text-text-muted text-xs sm:text-sm md:text-base">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-20 px-4 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[150px] sm:w-[200px] md:w-[300px] h-[150px] sm:h-[200px] md:h-[300px] bg-white/10 rounded-full blur-[50px] sm:blur-[60px] md:blur-[80px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[100px] sm:w-[150px] md:w-[200px] h-[100px] sm:h-[150px] md:h-[200px] bg-white/5 rounded-full blur-[40px] sm:blur-[50px] md:blur-[60px]"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-white">Ready to Get Started?</h2>
          <p className="text-blue-100 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-xl mx-auto px-2">
            Join thousands of educators and students who trust AssessHub for their online assessments.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl no-underline">
            Start Free Trial
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-6 sm:py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-primary flex items-center justify-center">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-text-primary text-sm sm:text-base">AssessHub</span>
          </div>
          <p className="text-text-muted text-xs sm:text-sm">© 2025 AssessHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
