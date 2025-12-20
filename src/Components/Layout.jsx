import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Navbar />
      <Sidebar />
      <main className="ml-64 pt-16 p-6 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default Layout;
