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

      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-success/10 rounded-full blur-[80px]"></div>
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-primary text-sm font-medium">Next-Gen Assessment Platform</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-text-primary">
              Transform Your
              <span className="block gradient-text">
                Online Assessments
              </span>
            </h1>

            <p className="text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
              A comprehensive platform for conducting secure online exams with advanced proctoring, 
              automated grading, and powerful analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary text-base px-8 py-4 no-underline">
                Get Started Free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
              <Link to="/login" className="btn-secondary text-base px-8 py-4 no-underline">
                Sign In
              </Link>
            </div>
          </div>

          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '50K+', label: 'Students' },
              { number: '1000+', label: 'Exams Conducted' },
              { number: '99.9%', label: 'Uptime' },
              { number: '4.9/5', label: 'Rating' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-4xl font-bold text-primary">{stat.number}</p>
                <p className="text-text-muted mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-text-primary">Powerful Features</h2>
            <p className="text-text-muted text-lg">Everything you need to conduct secure and efficient online assessments</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="stat-card group hover:border-primary/30">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${colorClasses[feature.color].bg}`}>
                  <svg 
                    className={`w-6 h-6 transition-colors ${colorClasses[feature.color].text}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">{feature.title}</h3>
                <p className="text-text-muted">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[300px] h-[300px] bg-white/10 rounded-full blur-[80px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[200px] h-[200px] bg-white/5 rounded-full blur-[60px]"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <h2 className="text-4xl font-bold mb-4 text-white">Ready to Get Started?</h2>
          <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of educators and students who trust AssessHub for their online assessments.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl no-underline">
            Start Free Trial
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </section>

      <footer className="bg-card border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-text-primary">AssessHub</span>
          </div>
          <p className="text-text-muted text-sm">© 2025 AssessHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
