export interface AppConfig {
  clientIdentifier: string;
  clientSecret: string;
  version: string;
}

export const exampleAppConfig = (): AppConfig => ({
  clientIdentifier: 'pp-123',
  clientSecret: 'not actually a secret, more like additional id',
  version: '1.0.0'
});
