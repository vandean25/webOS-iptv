import axios from 'axios';
import LoginService from './LoginService';
import type { XtreamCategory, XtreamStream, XtreamEPGResponse } from '../types/xtream';

class LiveService {
  private static instance: LiveService;

  private constructor() {}

  public static getInstance(): LiveService {
    if (!LiveService.instance) {
      LiveService.instance = new LiveService();
    }
    return LiveService.instance;
  }

  private getBaseUrl(): string {
    const creds = LoginService.getStoredCredentials();
    if (!creds) throw new Error('No credentials found');
    return creds.url.endsWith('/') ? creds.url.slice(0, -1) : creds.url;
  }

  private getAuthParams() {
    const creds = LoginService.getStoredCredentials();
    if (!creds) throw new Error('No credentials found');
    return {
      username: creds.username,
      password: creds.password
    };
  }

  public async getLiveCategories(): Promise<XtreamCategory[]> {
    const baseUrl = this.getBaseUrl();
    try {
      const response = await axios.get<XtreamCategory[]>(`${baseUrl}/player_api.php`, {
        params: {
          ...this.getAuthParams(),
          action: 'get_live_categories'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch categories', error);
      throw error;
    }
  }

  public async getLiveStreams(categoryId?: string): Promise<XtreamStream[]> {
    const baseUrl = this.getBaseUrl();
    const params: any = {
      ...this.getAuthParams(),
      action: 'get_live_streams'
    };
    if (categoryId) {
      params.category_id = categoryId;
    }

    try {
      const response = await axios.get<XtreamStream[]>(`${baseUrl}/player_api.php`, {
        params
      });

      // INJECT MOCK CHANNEL FOR TESTING
      const mockChannel: XtreamStream = {
        num: 1,
        name: "[4K] [HEVC] Test Channel",
        stream_type: "live",
        stream_id: 99999,
        stream_icon: "https://upload.wikimedia.org/wikipedia/commons/c/c5/Big_buck_bunny_poster_big.jpg",
        epg_channel_id: null,
        added: "2024-01-01 12:00:00",
        category_id: categoryId || "1",
        custom_sid: null,
        tv_archive: 0,
        direct_source: "",
        tv_archive_duration: 0
      };

      return [...response.data, mockChannel];
    } catch (error) {
      console.error('Failed to fetch streams', error);
      throw error;
    }
  }

  public getStreamUrl(streamId: number, extension: string = 'm3u8'): string {
    if (streamId === 99999) {
      // Public Apple 4K HEVC Test Stream
      return "https://devstreaming-cdn.apple.com/videos/streaming/examples/bipbop_adv_example_hevc/master.m3u8";
    }

    const creds = LoginService.getStoredCredentials();
    if (!creds) return '';
    const baseUrl = this.getBaseUrl();
    const { username, password } = creds;
    return `${baseUrl}/live/${username}/${password}/${streamId}.${extension}`;
  }

  public async getShortEPG(streamId: number, limit: number = 4): Promise<XtreamEPGResponse> {
      const baseUrl = this.getBaseUrl();
      // standard Xtream API call for short EPG
      // action=get_short_epg&stream_id=ID&limit=LIMIT
      try {
        const response = await axios.get<XtreamEPGResponse>(`${baseUrl}/player_api.php`, {
            params: {
                ...this.getAuthParams(),
                action: 'get_short_epg',
                stream_id: streamId,
                limit
            }
        });
        return response.data;
      } catch (error) {
        console.error('Failed to fetch EPG', error);
        // Return empty structure on failure to prevent UI crash
        return { epg_listings: [] };
      }
  }
}

export default LiveService.getInstance();
