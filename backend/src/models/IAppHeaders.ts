export interface IAppHeaders {
  requestId: string;
  clientId: string;
  clientVersion: string;
  forwardedFor: string;
  cloudHost: string;
  noTokenProlongation?: string;
}
