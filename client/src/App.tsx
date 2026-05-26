import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AdminDashboard } from './features/admin';
import { NGODashboard } from './features/ngo';
import { CakeDashboard } from './features/cake';
import { UserDashboard } from './features/user';
import { UserProvider } from './features/user/context/UserContext';
import { LoginPage } from './features/auth/LoginPage';
import { LandingPage } from './features/landing/pages/LandingPage';
import { Navbar } from './features/landing/components/Navbar';
import { AboutPage } from './features/landing/pages/AboutPage';
import { StoriesPage } from './features/landing/pages/StoriesPage';
import { PlantPage } from './features/landing/pages/PlantPage';
import { ExplorePage } from './features/landing/pages/ExplorePage';
import { WhatsAppButton } from './shared/components/WhatsAppButton';
import { VerifyPage } from './shared/pages/VerifyPage';
import { PaymentSuccessPage } from './features/landing/pages/PaymentSuccessPage';
import { TermsPage } from './features/landing/pages/TermsPage';
import { PrivacyPage } from './features/landing/pages/PrivacyPage';
import { IndividualPage } from './features/landing/pages/IndividualPage';
import { IndustriesPage } from './features/landing/pages/IndustriesPage';
import { InstitutesPage } from './features/landing/pages/InstitutesPage';
import { configureLeafletIcons } from './shared/utils/leaflet-icons';

// Initialize global Leaflet icon fix
configureLeafletIcons();

type Role = 'admin' | 'ngo' | 'cake' | 'user';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Simple public routing for verification
  const isVerifyPath = location.pathname.startsWith('/verify/');
  if (isVerifyPath) {
    return <VerifyPage />;
  }

  // Auto-login from localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem('forest_role');
    const savedUser = localStorage.getItem('forest_user');
    if (savedRole && savedUser) {
      setRole(savedRole as Role);
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (newRole: Role, userData: any) => {
    setRole(newRole);
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('forest_role', newRole);
    localStorage.setItem('forest_user', JSON.stringify(userData));
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setUser(null);
    localStorage.removeItem('forest_role');
    localStorage.removeItem('forest_user');
    navigate('/');
  };

  const commonProps = {
    onHomeClick: () => navigate('/'),
    onAboutClick: () => navigate('/about'),
    onStoriesClick: () => navigate('/stories'),
    onPlantClick: () => navigate('/plant'),
    onLoginClick: () => navigate('/login'),
    onContactClick: () => {
      navigate('/about');
      setTimeout(() => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },
    isAuthenticated,
    onDashboardClick: () => navigate('/dashboard'),
    onLogoutClick: handleLogout,
    onIndividualClick: () => navigate('/challenges/individual'),
    onIndustriesClick: () => navigate('/challenges/industries'),
    onInstitutesClick: () => navigate('/challenges/institutes')
  };

  const isLoginPage = location.pathname === '/login';
  const isDashboardPage = location.pathname === '/dashboard';

  return (
    <>
      <WhatsAppButton />
      <Toaster position="top-right" richColors />
      
      {/* Public Navbar shown on all non-login, non-dashboard pages */}
      {!isLoginPage && !isDashboardPage && <Navbar {...commonProps} />}

      <Routes>
        <Route path="/" element={
          <LandingPage 
            {...commonProps} 
            onExploreClick={(type) => navigate(`/explore/${type}`)} 
          />
        } />
        <Route path="/about" element={<AboutPage {...commonProps} />} />
        <Route path="/stories" element={<StoriesPage {...commonProps} />} />
        <Route path="/plant" element={<PlantPage {...commonProps} />} />
        <Route path="/explore/:type" element={<ExploreWrapper {...commonProps} />} />
        <Route path="/payment-success" element={<PaymentSuccessPage />} />
        <Route path="/terms-and-conditions" element={<TermsPage {...commonProps} />} />
        <Route path="/privacy-policy" element={<PrivacyPage {...commonProps} />} />
        <Route path="/challenges/individual" element={<IndividualPage />} />
        <Route path="/challenges/industries" element={<IndustriesPage />} />
        <Route path="/challenges/institutes" element={<InstitutesPage />} />
        
        <Route path="/login" element={
          isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <LoginPage onLogin={handleLogin} onBack={() => navigate('/')} />
          )
        } />

        {/* Dashboard subroute - Strictly rendered full-screen if authenticated */}
        <Route path="/dashboard" element={
          isAuthenticated ? (
            <div className="relative h-screen bg-gray-50">
              <div className="h-full overflow-hidden">
                {role === 'admin' && <AdminDashboard handleLogout={handleLogout} />}
                {role === 'ngo' && <NGODashboard user={user} handleLogout={handleLogout} />}
                {role === 'cake' && <CakeDashboard user={user} handleLogout={handleLogout} />}
                {role === 'user' && (
                  <UserProvider initialUser={user}>
                    <UserDashboard handleLogout={handleLogout} />
                  </UserProvider>
                )}
              </div>
            </div>
          ) : (
            <Navigate to="/login" replace />
          )
        } />
      </Routes>
    </>
  );
}

function ExploreWrapper(props: any) {
  const { type } = useParams<{ type: string }>();
  return <ExplorePage type={(type as any) || 'gifts'} {...props} />;
}

export default App;
