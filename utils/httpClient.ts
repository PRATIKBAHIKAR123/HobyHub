import { getStoredToken } from "./localStorage";

class HttpClient {
  private static instance: HttpClient;
  private authModalCallback: ((show: boolean) => void) | null = null;

  private constructor() {}

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  public setAuthModalCallback(callback: (show: boolean) => void) {
    this.authModalCallback = callback;
  }

  private async handleResponse(response: Response) {
    if (!response.ok) {
      const data = await response.json();
      if (data.message === "Unauthorized" && this.authModalCallback) {
        this.authModalCallback(true);
      }
      throw new Error(data.message || 'Request failed');
    }
    return response.json();
  }

  public async get(url: string, options: RequestInit = {}) {
    const token = getStoredToken();
    const headers = {
      ...options.headers,
      'Authorization': token ? `Bearer ${token}` : '',
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    return this.handleResponse(response);
  }

  public async post(url: string, data: any, options: RequestInit = {}) {
    const token = getStoredToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      'Authorization': token ? `Bearer ${token}` : '',
    };

    const response = await fetch(url, {
      ...options,
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  public async put(url: string, data: any, options: RequestInit = {}) {
    const token = getStoredToken();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      'Authorization': token ? `Bearer ${token}` : '',
    };

    const response = await fetch(url, {
      ...options,
      method: 'PUT',
      headers,
      body: JSON.stringify(data),
    });

    return this.handleResponse(response);
  }

  public async delete(url: string, options: RequestInit = {}) {
    const token = getStoredToken();
    const headers = {
      ...options.headers,
      'Authorization': token ? `Bearer ${token}` : '',
    };

    const response = await fetch(url, {
      ...options,
      method: 'DELETE',
      headers,
    });

    return this.handleResponse(response);
  }
}

export const httpClient = HttpClient.getInstance(); 