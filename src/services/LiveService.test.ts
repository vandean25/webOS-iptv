import { describe, it, expect, vi, beforeEach } from 'vitest';
import LiveService from './LiveService';
import axios from 'axios';
import LoginService from './LoginService';

vi.mock('axios');
vi.mock('./LoginService');

describe('LiveService', () => {
  const mockCategories = [
    { category_id: '1', category_name: 'News', parent_id: 0 }
  ];

  const mockStreams = [
    {
        num: 1, name: 'CNN', stream_type: 'live', stream_id: 100,
        stream_icon: '', epg_channel_id: '', added: '123',
        category_id: '1', custom_sid: '', tv_archive: 0,
        direct_source: '', tv_archive_duration: 0
    }
  ];

  beforeEach(() => {
    vi.resetAllMocks();
    (LoginService.getStoredCredentials as any).mockReturnValue({
      url: 'http://example.com',
      username: 'user',
      password: 'pass'
    });
  });

  it('should fetch categories successfully', async () => {
    (axios.get as any).mockResolvedValue({ data: mockCategories });

    const result = await LiveService.getLiveCategories();

    expect(result).toEqual(mockCategories);
    expect(axios.get).toHaveBeenCalledWith(
      'http://example.com/player_api.php',
      expect.objectContaining({
        params: {
          username: 'user',
          password: 'pass',
          action: 'get_live_categories'
        }
      })
    );
  });

  it('should fetch streams successfully', async () => {
    (axios.get as any).mockResolvedValue({ data: mockStreams });

    const result = await LiveService.getLiveStreams('1');

    // Expect the original stream PLUS the injected mock channel
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual(mockStreams[0]);
    expect(result[1]).toEqual(expect.objectContaining({
      stream_id: 99999,
      name: "[4K] [HEVC] Test Channel"
    }));

    expect(axios.get).toHaveBeenCalledWith(
      'http://example.com/player_api.php',
      expect.objectContaining({
        params: {
          username: 'user',
          password: 'pass',
          action: 'get_live_streams',
          category_id: '1'
        }
      })
    );
  });
});
