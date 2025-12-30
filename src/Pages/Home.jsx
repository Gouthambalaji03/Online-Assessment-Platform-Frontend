import { Link } from 'react-router-dom';
import Navbar from '../Components/Navbar';

const Home = () => {
  const features = [
    {
      icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
      title: 'Question Banks',
      desc: 'Create and manage comprehensive question banks.'
    },
    {
      icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Exam Scheduling',
      desc: 'Schedule exams with flexible timing options.'
    },
    {
      icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z',
      title: 'AI Proctoring',
      desc: 'Advanced proctoring with video monitoring.'
    },
    {
      icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      title: 'Auto Grading',
      desc: 'Instant automated grading for objective questions.'
    }
  ];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center py-12 sm:py-16 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight text-text-primary">
            Online Assessment
            <span className="block gradient-text">Platform</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-text-muted max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed">
            Conduct secure online exams with advanced proctoring and automated grading.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link to="/register" className="btn-primary text-sm sm:text-base px-6 sm:px-8 py-3 no-underline w-full sm:w-auto justify-center">
              Get Started
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link to="/login" className="btn-secondary text-sm sm:text-base px-6 sm:px-8 py-3 no-underline w-full sm:w-auto justify-center">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-12 px-4 bg-card border-t border-border">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {features.map((feature, i) => (
              <div key={i} className="text-center p-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feature.icon} />
                  </svg>
                </div>
                <h3 className="text-sm sm:text-base font-semibold mb-1 text-text-primary">{feature.title}</h3>
                <p className="text-text-muted text-xs sm:text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-4 sm:py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold text-text-primary text-sm">AssessHub</span>
          </div>
          <p className="text-text-muted text-xs">© 2025 AssessHub. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
