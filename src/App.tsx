import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { init } from '@noriginmedia/norigin-spatial-navigation';
import LoginPage from './pages/LoginPage';
import LiveTVPage from './pages/LiveTVPage';
import FavoritesPage from './pages/FavoritesPage';
import CategoriesPage from './pages/CategoriesPage';
import SearchPage from './pages/SearchPage';
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
  const { isAuthenticated, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <HashRouter>
      <div className="app-container w-screen h-screen bg-background-dark text-white overflow-hidden font-display">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/favorites"
            element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute>
                <CategoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <SearchPage />
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
          <Route path="*" element={<Navigate to={isAuthenticated ? "/favorites" : "/login"} replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
