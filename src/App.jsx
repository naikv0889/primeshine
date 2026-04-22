import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import PricingPage from './pages/PricingPage';
import WeatherPage from './pages/WeatherPage';
import AboutPage from './pages/AboutPage';
import FaqPage from './pages/FaqPage';
import ContactPage from './pages/ContactPage';
import BookingFlow from './pages/booking/BookingFlow';
import AuthPage from './pages/AuthPage';
import PortalPage from './pages/portal/PortalPage';
import AdminPage from './pages/admin/AdminPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
};

const AppRoutes = ({ demoUser, setDemoUser }) => {
  const { pathname } = useLocation();
  const { user: authUser, profile } = useAuth();
  const isDashboard = pathname.startsWith('/portal') || pathname.startsWith('/admin');

  // Use real auth when Supabase is configured, otherwise fall back to demo user
  const user = authUser ? { name: profile?.full_name || authUser.email, role: profile?.role || 'customer', email: authUser.email } : demoUser;
  const setUser = authUser ? () => {} : setDemoUser;

  return (
    <>
      <ScrollToTop />
      <Header user={user} setUser={setUser} />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/weather" element={<WeatherPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/book/:step" element={<BookingFlow />} />
          <Route path="/book" element={<Navigate to="/book/1" replace />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/portal" element={<PortalPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {!isDashboard && <Footer />}
    </>
  );
};

const App = () => {
  const [demoUser, setDemoUser] = useState(null);
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes demoUser={demoUser} setDemoUser={setDemoUser} />
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
