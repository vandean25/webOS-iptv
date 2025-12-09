import { create } from 'zustand';
import type { XtreamCredentials, XtreamUserInfo, XtreamServerInfo } from '../types/xtream';
import LoginService from '../services/LoginService';

interface AuthState {
  isAuthenticated: boolean;
  userInfo: XtreamUserInfo | null;
  serverInfo: XtreamServerInfo | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (credentials: XtreamCredentials) => Promise<void>;
  logout: () => void;
  checkSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  userInfo: null,
  serverInfo: null,
  isLoading: false,
  error: null,

  login: async (credentials: XtreamCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await LoginService.login(credentials);
      set({
        isAuthenticated: true,
        userInfo: response.user_info,
        serverInfo: response.server_info,
        isLoading: false
      });
    } catch (error: any) {
      set({
        error: error.message || 'Login failed',
        isLoading: false,
        isAuthenticated: false
      });
      throw error;
    }
  },

  logout: () => {
    LoginService.clearCredentials();
    set({
      isAuthenticated: false,
      userInfo: null,
      serverInfo: null,
      error: null
    });
  },

  checkSession: () => {
      // In a real app, we might want to validate the stored token/credentials with the API silently here.
      // For now, if we have stored credentials, we might need to re-login to get the latest session data
      // or just load the last known state if persisted.
      // Since LoginService stores credentials, let's auto-login if they exist.
      const stored = LoginService.getStoredCredentials();
      if (stored) {
          // We trigger a login in background? Or just let the user click 'connect'?
          // Usually auto-login is better.
          // For now, let's just mark that we *can* login, but maybe we shouldn't block rendering.
          // A robust way:
          // We can't be "Authenticated" just by having credentials, we need the session data (user_info).
          // So checkSession should probably try to login.
          // Let's implement this later or manually call login from the UI on mount if credentials exist.
      }
  }
}));
