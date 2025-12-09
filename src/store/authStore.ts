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

export const useAuthStore = create<AuthState>((set, get) => ({
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
      const stored = LoginService.getStoredCredentials();
      if (stored) {
          // Restore basic session state.
          // Ideally we should validate with API, but for immediate UX:
          set({ isAuthenticated: true, isLoading: false });

          // Trigger background validation/login to get full user info
          get().login(stored).catch(() => {
             // If background login fails, logout
             get().logout();
          });
      }
  }
}));
