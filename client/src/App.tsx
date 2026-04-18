import React, { useState, useEffect } from 'react';
import { Toaster } from 'sonner';
import { AdminDashboard } from './features/admin';
import { NGODashboard } from './features/ngo';
import { CakeDashboard } from './features/cake';
import { UserDashboard } from './features/user';
import { UserProvider } from './features/user/context/UserContext';
import { LoginPage } from './features/auth/LoginPage';

import { VerifyPage } from './shared/pages/VerifyPage';

type Role = 'admin' | 'ngo' | 'cake' | 'user';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<any>(null);

  // Simple public routing for verification
  const isVerifyPath = window.location.pathname.startsWith('/verify/');
  if (isVerifyPath) {
    console.log("Router: Rendering VerifyPage for path", window.location.pathname);
    return <VerifyPage />;
  }

  // Auto-login from localStorage if needed (optional implementation)
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
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setUser(null);
    localStorage.removeItem('forest_role');
    localStorage.removeItem('forest_user');
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="relative h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      {/* Global floating button removed; delegating logout controls to specific dashboards */}

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
  );
}

export default App;

