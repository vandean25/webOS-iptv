import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import LoginService from './LoginService';
import LiveService from './LiveService';
import axios from 'axios';

vi.mock('axios');

describe('Mock Login Bypass', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should bypass login API call when using demo credentials', async () => {
    const credentials = {
      url: 'http://test.local',
      username: 'demo',
      password: 'demo'
    };

    const response = await LoginService.login(credentials);

    expect(response.user_info.username).toBe('demo_user');
    expect(response.user_info.message).toBe('Login Success via Mock');
    expect(response.server_info.process).toBe(true);
    expect(axios.get).not.toHaveBeenCalled();

    // Verify persistence
    const stored = LoginService.getStoredCredentials();
    expect(stored).toEqual(credentials);
  });

  it('should call normal API when using other credentials', async () => {
    const credentials = {
      url: 'http://real.api',
      username: 'real_user',
      password: 'real_password'
    };

    (axios.get as any).mockResolvedValue({
      data: {
        user_info: { auth: 1 },
        server_info: {}
      }
    });

    await LoginService.login(credentials);

    expect(axios.get).toHaveBeenCalledWith(
      'http://real.api/player_api.php',
      expect.any(Object)
    );
  });
});

describe('LiveService Mock Bypass', () => {
  beforeEach(async () => {
    localStorage.clear();
    vi.resetAllMocks();

    // Login as demo user first
    await LoginService.login({
      url: 'http://test.local',
      username: 'demo',
      password: 'demo'
    });
  });

  it('should return mock categories for demo user', async () => {
    const categories = await LiveService.getLiveCategories();
    expect(categories).toHaveLength(1);
    expect(categories[0].category_name).toBe('Mock Category');
    expect(axios.get).not.toHaveBeenCalled();
  });

  it('should return mock streams for demo user', async () => {
    const streams = await LiveService.getLiveStreams();
    expect(streams).toHaveLength(1);
    expect(streams[0].name).toBe('Mock 4K HEVC');
    expect(streams[0].stream_id).toBe(99999);
    expect(axios.get).not.toHaveBeenCalled();
  });

  it('should return mock EPG for demo user', async () => {
      const epg = await LiveService.getShortEPG(99999);
      expect(epg.epg_listings).toHaveLength(2);
      expect(epg.epg_listings[0].title).toBe('Mock Program Now');
      expect(axios.get).not.toHaveBeenCalled();
  });
});
