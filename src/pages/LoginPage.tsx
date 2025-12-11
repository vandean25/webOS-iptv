import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { FocusableInput } from '../components/FocusableInput';
import { FocusableButton } from '../components/FocusableButton';
import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import LoginService from '../services/LoginService';

const LoginPage: React.FC = () => {
  const [url, setUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  const { ref, focusSelf } = useFocusable();

  // Auto-fill from local storage if available to save typing
  useEffect(() => {
    const stored = LoginService.getStoredCredentials();
    if (stored) {
      setUrl(stored.url);
      setUsername(stored.username);
      setPassword(stored.password);
    }
    focusSelf(); // Set focus to this container/page initially
  }, [focusSelf]);

  const handleLogin = async () => {
    if (!url || !username || !password) return;

    try {
      await login({ url, username, password });
      navigate('/live');
    } catch {
      // Error is handled in store and displayed via state
    }
  };

  return (
    <div ref={ref} className="min-h-screen bg-background flex flex-col items-center justify-center p-safe-area">
      <div className="w-full max-w-md bg-surface p-8 rounded-xl shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-primary">Modern IPTV</h1>

        {error && (
          <div className="bg-red-900/50 text-red-200 p-3 rounded mb-6 text-sm border border-red-800">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-gray-400 text-xs uppercase mb-2">Playlist / API URL</label>
            <FocusableInput
              type="text"
              placeholder="http://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              focusKey="LOGIN_URL"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs uppercase mb-2">Username</label>
            <FocusableInput
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              focusKey="LOGIN_USER"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs uppercase mb-2">Password</label>
            <FocusableInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              focusKey="LOGIN_PASS"
              onEnterPress={handleLogin}
            />
          </div>

          <div className="pt-4">
            <FocusableButton
              label={isLoading ? 'Logging in...' : 'Login'}
              onClick={handleLogin}
              className="w-full"
              focusKey="LOGIN_BTN"
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;