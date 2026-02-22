import type { GistData, SyncStatus } from '@/types';
import { gistDataSchema } from './schema';

const GITHUB_API_BASE = 'https://api.github.com';
const GIST_FILE_NAME = 'leetcode-tracker.json';

export interface Gist {
  id: string;
  html_url: string;
  files: Record<string, {
    content?: string;
    filename: string;
  }>;
  created_at: string;
  updated_at: string;
}

export interface GitHubError {
  message: string;
  status: number;
}

export class GitHubGistClient {
  private token: string;
  private apiVersion = '2022-11-28';

  constructor(token: string) {
    this.token = token;
  }

  private get headers(): HeadersInit {
    return {
      'Accept': 'application/vnd.github+json',
      'Authorization': `Bearer ${this.token}`,
      'X-GitHub-Api-Version': this.apiVersion,
    };
  }

  private async fetch<T>(url: string, options?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.headers,
          ...options?.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          message: errorData.message || `HTTP ${response.status}`,
          status: response.status,
        } as GitHubError;
      }

      return response.json();
    } catch (error) {
      if (error instanceof Error && 'status' in error) {
        throw error;
      }
      throw {
        message: error instanceof Error ? error.message : 'Network error',
        status: 0,
      } as GitHubError;
    }
  }

  async listGists(): Promise<Gist[]> {
    const url = `${GITHUB_API_BASE}/gists`;
    const gists = await this.fetch<Gist[]>(url);
    
    return gists.filter(gist => 
      Object.keys(gist.files).includes(GIST_FILE_NAME)
    );
  }

  async getGist(gistId: string): Promise<Gist> {
    const url = `${GITHUB_API_BASE}/gists/${gistId}`;
    return this.fetch<Gist>(url);
  }

  async createGist(data: GistData): Promise<Gist> {
    const url = `${GITHUB_API_BASE}/gists`;
    
    const gistData = {
      description: 'LeetCode Tracker Data',
      public: false,
      files: {
        [GIST_FILE_NAME]: {
          content: JSON.stringify(data, null, 2),
        },
      },
    };

    return this.fetch<Gist>(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gistData),
    });
  }

  async updateGist(gistId: string, data: GistData): Promise<Gist> {
    const url = `${GITHUB_API_BASE}/gists/${gistId}`;
    
    const gistData = {
      description: 'LeetCode Tracker Data',
      files: {
        [GIST_FILE_NAME]: {
          content: JSON.stringify(data, null, 2),
        },
      },
    };

    return this.fetch<Gist>(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(gistData),
    });
  }

  async deleteGist(gistId: string): Promise<void> {
    const url = `${GITHUB_API_BASE}/gists/${gistId}`;
    
    await this.fetch(url, {
      method: 'DELETE',
    });
  }

  async loadGistData(gistId: string): Promise<GistData | null> {
    try {
      const gist = await this.getGist(gistId);
      const file = gist.files[GIST_FILE_NAME];
      
      if (!file?.content) {
        throw new Error('Gist file not found');
      }

      const parsedData = JSON.parse(file.content);
      const result = gistDataSchema.safeParse(parsedData);
      
      if (result.success) {
        return result.data;
      }
      
      console.error('Invalid gist data:', result.error);
      return null;
    } catch (error) {
      console.error('Failed to load gist data:', error);
      return null;
    }
  }
}

let gistClient: GitHubGistClient | null = null;

export function getGistClient(): GitHubGistClient {
  if (!gistClient) {
    const token = import.meta.env.VITE_GITHUB_TOKEN || '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';
    gistClient = new GitHubGistClient(token);
  }
  return gistClient;
}

export async function syncToGist(
  data: GistData,
  onStatusChange?: (status: SyncStatus) => void
): Promise<{ success: boolean; gistId?: string; error?: string }> {
  onStatusChange?.('syncing');
  
  try {
    const client = getGistClient();
    
    if (data.gistId) {
      await client.updateGist(data.gistId, data);
    } else {
      const existingGists = await client.listGists();
      
      if (existingGists.length > 0) {
        const gist = await client.updateGist(existingGists[0].id, data);
        data.gistId = gist.id;
      } else {
        const gist = await client.createGist(data);
        data.gistId = gist.id;
      }
    }
    
    onStatusChange?.('success');
    return { success: true, gistId: data.gistId };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sync failed';
    console.error('Failed to sync to gist:', error);
    onStatusChange?.('error');
    return { success: false, error: message };
  }
}

export async function syncFromGist(
  gistId: string,
  onStatusChange?: (status: SyncStatus) => void
): Promise<{ success: boolean; data?: GistData; error?: string }> {
  onStatusChange?.('syncing');
  
  try {
    const client = getGistClient();
    const data = await client.loadGistData(gistId);
    
    if (!data) {
      throw new Error('Failed to parse gist data');
    }
    
    onStatusChange?.('success');
    return { success: true, data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Sync failed';
    console.error('Failed to sync from gist:', error);
    onStatusChange?.('error');
    return { success: false, error: message };
  }
}
