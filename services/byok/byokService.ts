export interface ApiKeyConfig {
  geminiApiKey?: string;
  groqApiKey?: string;
  openRouterApiKey?: string;
  stabilityApiKey?: string;
  unsplashApiKey?: string;
}

export interface ModelConfig {
  provider: 'gemini' | 'groq' | 'openrouter';
  model: string;
  apiKey: string;
}

export const DEFAULT_MODELS = {
  text: {
    provider: 'gemini',
    model: 'gemini-1.5-flash',
  },
  image: {
    provider: 'gemini',
    model: 'imagen-3.0-generate-001',
  }
} as const;

export class BYOKService {
  private apiKeys: ApiKeyConfig = {};
  private readonly STORAGE_KEY = 'medigenius_api_keys';

  constructor() {
    this.loadApiKeys();
  }

  private loadApiKeys(): void {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        this.apiKeys = JSON.parse(stored);
      } catch (error) {
        console.error('Failed to parse stored API keys:', error);
      }
    }
  }

  public setApiKeys(keys: ApiKeyConfig): void {
    this.apiKeys = { ...this.apiKeys, ...keys };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.apiKeys));
  }

  public getApiKey(provider: string): string | undefined {
    switch (provider) {
      case 'gemini':
        return this.apiKeys.geminiApiKey;
      case 'groq':
        return this.apiKeys.groqApiKey;
      case 'openrouter':
        return this.apiKeys.openRouterApiKey;
      case 'stability':
        return this.apiKeys.stabilityApiKey;
      case 'unsplash':
        return this.apiKeys.unsplashApiKey;
      default:
        return undefined;
    }
  }

  public hasValidKey(provider: string): boolean {
    const key = this.getApiKey(provider);
    return Boolean(key && key.trim().length > 0);
  }

  public getAvailableProviders(): string[] {
    return Object.keys(this.apiKeys).filter(provider =>
      this.hasValidKey(provider.replace('ApiKey', ''))
    );
  }

  public clearAllKeys(): void {
    this.apiKeys = {};
    localStorage.removeItem(this.STORAGE_KEY);
  }

  public getHealthStatus(): Record<string, boolean> {
    const health: Record<string, boolean> = {};

    // Test Gemini
    if (this.hasValidKey('gemini')) {
      health.gemini = true; // We'll test this asynchronously
    }

    // Test other providers
    if (this.hasValidKey('groq')) health.groq = true;
    if (this.hasValidKey('openrouter')) health.openrouter = true;
    if (this.hasValidKey('stability')) health.stability = true;
    if (this.hasValidKey('unsplash')) health.unsplash = true;

    return health;
  }
}
