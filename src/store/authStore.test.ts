import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from './authStore';
import LoginService from '../services/LoginService';

// Mock LoginService
vi.mock('../services/LoginService', () => ({
  default: {
    login: vi.fn(),
    logout: vi.fn(),
    clearCredentials: vi.fn(),
    getStoredCredentials: vi.fn(),
    isLoggedIn: vi.fn(),
  }
}));

describe('AuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({
      isAuthenticated: false,
      userInfo: null,
      serverInfo: null,
      isLoading: false,
      error: null
    });
    vi.resetAllMocks();
  });

  it('should have initial state', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isLoading).toBe(false);
  });

  it('should handle successful login', async () => {
    const mockCredentials = { url: 'http://test.com', username: 'u', password: 'p' };
    const mockResponse = {
      user_info: { username: 'u' },
      server_info: { url: 'http://test.com' }
    };

    (LoginService.login as any).mockResolvedValue(mockResponse);

    await useAuthStore.getState().login(mockCredentials);

    const state = useAuthStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(true);
    expect(state.userInfo).toEqual(mockResponse.user_info);
    expect(state.error).toBeNull();
  });

  it('should handle login failure', async () => {
    const mockCredentials = { url: 'http://test.com', username: 'u', password: 'p' };
    (LoginService.login as any).mockRejectedValue(new Error('Auth failed'));

    try {
        await useAuthStore.getState().login(mockCredentials);
    } catch {
        // expected
    }

    const state = useAuthStore.getState();
    expect(state.isLoading).toBe(false);
    expect(state.isAuthenticated).toBe(false);
    expect(state.error).toBe('Auth failed');
  });

  it('should handle logout', () => {
    // Set logged in state first
    useAuthStore.setState({ isAuthenticated: true, userInfo: {} as any });

    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.userInfo).toBeNull();
    expect(LoginService.clearCredentials).toHaveBeenCalled();
  });
});
