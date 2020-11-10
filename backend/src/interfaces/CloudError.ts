export interface CloudError {
  error?: string;
  message?: string;
  values?: any[];
  id?: string;
  children?: CloudError[];
}
