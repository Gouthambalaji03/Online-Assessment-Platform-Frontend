import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F1F5F9' }}>
      <Navbar />
      <Sidebar />
      <main style={{
        marginLeft: '260px',
        paddingTop: '72px',
        padding: '88px 32px 32px 292px',
        minHeight: '100vh'
      }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
