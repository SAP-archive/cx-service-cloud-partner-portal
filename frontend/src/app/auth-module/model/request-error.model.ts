
export interface CloudErrorChild {
  error: string;
  message: string;
  values: string[];
  id: string;
}

export interface CloudError {
  error: string;
  message: string;
  values: string[];
  children: undefined | CloudErrorChild[];
}

export interface RequestError {
  code: number;
  message: string;
  cloudError?: CloudError | null;
  SAMLRedirectURL?: string;
}

export const exampleRequestError = (): RequestError => ({
  code: 500,
  message: 'my-message',
  cloudError:  null
});

