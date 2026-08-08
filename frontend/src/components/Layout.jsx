import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AIChatWidget from './AIChatWidget';
import AuthModal from './AuthModal';

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', background: '#F1F3F6' }}>
      <Navbar />
      <main style={{ flex: 1, paddingTop: 104 }}>
        <Outlet />
      </main>
      <Footer />
      <AIChatWidget />
      <AuthModal />
    </div>
  );
}
