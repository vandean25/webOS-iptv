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

    // --- MOCK LOGIN BYPASS ---
    if (username === 'demo' && password === 'demo') {
        console.log("Using Mock Login Bypass");
        const mockResponse: XtreamLoginResponse = {
            user_info: {
                username: "demo_user",
                password: "demopassword",
                message: "Welcome Demo User!",
                auth: 1,
                status: "Active",
                exp_date: "1672531199", // Some future date
                is_trial: "0",
                active_cons: "1",
                created_at: "1577836800",
                max_connections: "2",
                allowed_output_formats: ["m3u8", "ts"]
            },
            server_info: {
                url: "demo.url",
                port: "80",
                https_port: "443",
                server_protocol: "http",
                rtmp_port: "8080",
                timezone: "UTC",
                timestamp_now: Math.floor(Date.now() / 1000),
                time_now: new Date().toISOString()
            }
        };
        this.saveCredentials(credentials);
        return mockResponse;
    }

    const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    const apiUrl = `${baseUrl}/player_api.php`;

    try {
      const response = await axios.get<XtreamLoginResponse>(apiUrl, {
        params: {
          username,
          password
        }
      });

      if (response.data?.user_info?.auth === 0) {
        throw new Error('Authentication failed (Invalid Credentials)');
      }

      if (!response.data?.user_info) {
        throw new Error('Invalid API response');
      }

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
