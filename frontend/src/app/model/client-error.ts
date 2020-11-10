export interface ClientError {
  code: number;
  message: string;
  details?: string;
  values?: string[];
}

export const exampleClientError = () => ({
  code: 400,
  message: 'ERROR',
  details: 'something goes wrong',
  values: [
    'missing required fields'
  ],
});
