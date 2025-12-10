import axios from 'axios';
import type { XtreamCredentials, XtreamLoginResponse } from '../types/xtream';

const STORAGE_KEY = 'xtream_credentials';

class LoginService {
  private static instance: LoginService;

  private constructor() {}

  public static getInstance(): LoginService {
    if (!LoginService.instance) {
      LoginService.instance = new LoginService();
    }
    return LoginService.instance;
  }

  /**
   * Attempts to login to the Xtream Codes API.
   * If successful, saves credentials to localStorage.
   */
  public async login(credentials: XtreamCredentials): Promise<XtreamLoginResponse> {
    const { url, username, password } = credentials;

    // Ensure URL ends with / or remove it to construct properly?
    // Usually Xtream API is at base_url/player_api.php
    // Let's normalize the URL.
    const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    const apiUrl = `${baseUrl}/player_api.php`;

    try {
      const response = await axios.get<XtreamLoginResponse>(apiUrl, {
        params: {
          username,
          password
        }
      });

      // Basic validation: check if user_info exists or auth status
      // Some APIs return status 200 but logic error in body
      if (response.data?.user_info?.auth === 0) {
        throw new Error('Authentication failed (Invalid Credentials)');
      }

      if (!response.data?.user_info) {
        throw new Error('Invalid API response');
      }

      // Save credentials if successful
      this.saveCredentials(credentials);

      return response.data;
    } catch (error: any) {
        if (axios.isAxiosError(error)) {
            throw new Error(`Network Error: ${error.message}`);
        }
        throw error;
    }
  }

  public saveCredentials(credentials: XtreamCredentials): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(credentials));
  }

  public getStoredCredentials(): XtreamCredentials | null {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    try {
      return JSON.parse(stored) as XtreamCredentials;
    } catch {
      return null;
    }
  }

  public clearCredentials(): void {
    localStorage.removeItem(STORAGE_KEY);
  }

  public isLoggedIn(): boolean {
    return !!this.getStoredCredentials();
  }
}

export default LoginService.getInstance();
