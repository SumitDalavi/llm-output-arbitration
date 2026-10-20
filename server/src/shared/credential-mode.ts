export type ProviderMode = 'mock' | 'live';

export interface CredentialStatus {
  openai: ProviderMode;
  database: ProviderMode;
}

export function isRealOpenAIKey(key?: string): boolean {
  return !!key && key.startsWith('sk-') && !key.startsWith('sk-dummy') && key.length >= 20;
}

export function isRealPostgresUrl(url?: string): boolean {
  return !!url && (url.startsWith('postgres://') || url.startsWith('postgresql://'));
}

export function detectCredentialStatus(): CredentialStatus {
  return {
    openai: isRealOpenAIKey(process.env.OPENAI_API_KEY) ? 'live' : 'mock',
    database: isRealPostgresUrl(process.env.DATABASE_URL) ? 'live' : 'mock',
  };
}

export const credentialStatus = detectCredentialStatus();
