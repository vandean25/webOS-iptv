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

  private isMockUser(): boolean {
    const creds = LoginService.getStoredCredentials();
    return creds?.username === 'demo' && creds?.password === 'demo';
  }

  public async getLiveCategories(): Promise<XtreamCategory[]> {
    if (this.isMockUser()) {
      return [
        { category_id: '1', category_name: 'Mock Category', parent_id: 0 }
      ];
    }

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
    if (this.isMockUser()) {
       return [
        {
          num: 1,
          name: 'Mock 4K HEVC',
          stream_type: 'live',
          stream_id: 99999,
          stream_icon: '',
          epg_channel_id: 'mock_epg',
          added: '1672531200',
          category_id: '1',
          custom_sid: '',
          tv_archive: 0,
          direct_source: '',
          tv_archive_duration: 0
        }
      ];
    }

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
      return response.data;
    } catch (error) {
      console.error('Failed to fetch streams', error);
      throw error;
    }
  }

  public getStreamUrl(streamId: number, extension: string = 'm3u8'): string {
    const creds = LoginService.getStoredCredentials();
    if (!creds) return '';
    const baseUrl = this.getBaseUrl();
    const { username, password } = creds;
    return `${baseUrl}/live/${username}/${password}/${streamId}.${extension}`;
  }

  public async getShortEPG(streamId: number, limit: number = 4): Promise<XtreamEPGResponse> {
      if (this.isMockUser()) {
        const now = Math.floor(Date.now() / 1000);
        return {
          epg_listings: [
            {
              id: '1',
              epg_id: '1',
              title: 'Mock Program Now',
              lang: 'en',
              start: new Date((now - 3600) * 1000).toISOString(),
              end: new Date((now + 3600) * 1000).toISOString(),
              description: 'This is a mock program description',
              channel_id: 'mock_epg',
              start_timestamp: (now - 3600).toString(),
              stop_timestamp: (now + 3600).toString()
            },
            {
              id: '2',
              epg_id: '1',
              title: 'Mock Program Next',
              lang: 'en',
              start: new Date((now + 3600) * 1000).toISOString(),
              end: new Date((now + 7200) * 1000).toISOString(),
              description: 'This is the next mock program',
              channel_id: 'mock_epg',
              start_timestamp: (now + 3600).toString(),
              stop_timestamp: (now + 7200).toString()
            }
          ]
        };
      }

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
