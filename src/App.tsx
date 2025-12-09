import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { init } from '@noriginmedia/norigin-spatial-navigation';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LiveTVPage from './pages/LiveTVPage';
import { useAuthStore } from './store/authStore';

// Initialize Spatial Navigation
init({
  debug: false,
  visualDebug: false
});

const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App: React.FC = () => {
  const { checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <HashRouter>
      <div className="app-container w-screen h-screen bg-background text-text overflow-hidden font-sans">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/live"
            element={
              <ProtectedRoute>
                <LiveTVPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
