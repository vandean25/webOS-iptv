import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginService from './LoginService';
import axios from 'axios';
import type { XtreamLoginResponse } from '../types/xtream';

vi.mock('axios');

describe('LoginService', () => {
  const mockCredentials = {
    url: 'http://example.com',
    username: 'user',
    password: 'pass'
  };

  const mockSuccessResponse: XtreamLoginResponse = {
    user_info: {
      username: 'user',
      password: 'pass',
      message: 'Login Success',
      auth: 1,
      status: 'Active',
      exp_date: '123456789',
      is_trial: '0',
      active_cons: '0',
      created_at: '123456789',
      max_connections: '1',
      allowed_output_formats: ['ts']
    },
    server_info: {
      url: 'http://example.com',
      port: '8080',
      https_port: '443',
      server_protocol: 'http',
      rtmp_port: '8888',
      timezone: 'Europe/Paris',
      timestamp_now: 123456,
      time_now: '2023-01-01',
      process: true
    }
  };

  beforeEach(() => {
    vi.resetAllMocks();
    localStorage.clear();
  });

  it('should login successfully and save credentials', async () => {
    (axios.get as any).mockResolvedValue({ data: mockSuccessResponse });

    const result = await LoginService.login(mockCredentials);

    expect(result).toEqual(mockSuccessResponse);
    expect(axios.get).toHaveBeenCalledWith(
      'http://example.com/player_api.php',
      { params: { username: 'user', password: 'pass' } }
    );
    expect(LoginService.getStoredCredentials()).toEqual(mockCredentials);
  });

  it('should throw error on auth failure (auth: 0)', async () => {
    const mockFailResponse = {
      ...mockSuccessResponse,
      user_info: { ...mockSuccessResponse.user_info, auth: 0 }
    };
    (axios.get as any).mockResolvedValue({ data: mockFailResponse });

    await expect(LoginService.login(mockCredentials)).rejects.toThrow('Authentication failed');
    expect(LoginService.getStoredCredentials()).toBeNull();
  });

  it('should throw error on network error', async () => {
     const error = new Error('Network Error');
     (axios.isAxiosError as any) = vi.fn().mockReturnValue(true);
     // Note: axios.isAxiosError is a static method, mocking it properly in vitest might require different approach or just rely on axios implementation if not mocked out entirely.
     // Since we mocked 'axios' module, axios.isAxiosError might be undefined or need explicit mock.
     // A simpler way with vi.mock('axios') usually mocks the default export.

     // Let's refine the mock to handle the error properly
     (axios.get as any).mockRejectedValue(error);
     // Re-implement isAxiosError for the test if it's lost in mock
     (axios as any).isAxiosError = (payload: any) => payload === error;

     await expect(LoginService.login(mockCredentials)).rejects.toThrow('Network Error');
  });
});
