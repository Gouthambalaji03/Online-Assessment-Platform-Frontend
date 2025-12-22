import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-surface-secondary">
      <Navbar />
      <Sidebar />
      <main className="ml-[260px] pt-[88px] pr-8 pb-8 pl-8 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
