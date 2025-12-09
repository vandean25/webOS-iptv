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
