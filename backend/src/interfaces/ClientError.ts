export interface ClientError {
  code?: number;
  statusCode?: number;
  message: string;
  details?: string;
  values?: string[];
}
