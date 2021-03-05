import { HttpClientService, HttpMethod } from './HttpClientService';
import { UserData } from '@modules/common/types';

export interface CrowdDispatchingApiResponse<T> {
  results: T[];
  numberOfElements?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  first?: boolean;
  last?: boolean;
}

export class CrowdDispatchingApi {
  private static API_PATH = '/cloud-partner-dispatch-service/api';

  public static async get<T>(userData: UserData, path: string, queryString?: Object): Promise<CrowdDispatchingApiResponse<T>> {
    return this.makeRequest('GET', userData, path, queryString);
  }

  public static async put(userData: UserData, path: string, data: any, queryString?: Object, useFormData?: boolean): Promise<undefined> {
    return this.makeRequest('PUT', userData, path, queryString, data, useFormData);
  }

  public static async post<T>(userData: UserData, path: string, data: any, queryString?: Object, useFormData?: boolean): Promise<T> {
    return this.makeRequest<T>('POST', userData, path, queryString, data, useFormData);
  }

  public static async delete(userData: UserData, path: string, data?: any, queryString?: Object, useFormData?: boolean): Promise<undefined> {
    return this.makeRequest('DELETE', userData, path, queryString, data, useFormData);
  }

  private static async makeRequest<T>(
    method: HttpMethod,
    userData: UserData,
    path: string,
    queryString?: Object,
    data?: any,
    useFormData?: boolean,
  ): Promise<any> {
    const pathSeparator = (path.indexOf('/') === 0) ? '' : '/';
    return HttpClientService.send<CrowdDispatchingApiResponse<T> | T | undefined>({
      method,
      path: `${CrowdDispatchingApi.API_PATH}${pathSeparator}${path}`,
      queryString,
      data,
      useFormData,
      userData,
    });
  }
}
