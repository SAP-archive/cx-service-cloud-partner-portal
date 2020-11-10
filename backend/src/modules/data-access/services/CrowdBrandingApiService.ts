import { HttpClientService, HttpMethod } from './HttpClientService';
import { UserData } from '@modules/common/types';
import * as request from 'request-promise-native';

export interface BrandingServiceResponse<T> {
  results: T[];
  numberOfElements?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  first?: boolean;
  last?: boolean;
}

export class CrowdBrandingApiService {
  private static API_PATH = '/cloud-crowd-branding-service/api';

  public static async get<T>(userData: UserData, path: string, queryString?: Object): Promise<T> {
    return this.makeRequest<T>('GET', userData, path, queryString);
  }

  public static async put<T>(userData: UserData, path: string, data: T, queryString?: Object, useFormData?: boolean): Promise<T> {
    return this.makeRequest<T>('PUT', userData, path, queryString, data, useFormData);
  }

  public static async post<T>(userData: UserData, path: string, data: any, queryString?: Object, useFormData?: boolean): Promise<T> {
    return this.makeRequest<T>('POST', userData, path, queryString, data, useFormData);
  }

  public static async delete<T>(userData: UserData, path: string, data?: T, queryString?: Object, useFormData?: boolean): Promise<void> {
    return this.makeRequest<void>('DELETE', userData, path, queryString, data, useFormData);
  }

  public static stream(userData: UserData, path: string, queryString?: Object): request.RequestPromise {
    const pathSeparator = (path.indexOf('/') === 0) ? '' : '/';
    return HttpClientService.stream({
      method: 'GET',
      path: `${CrowdBrandingApiService.API_PATH}${pathSeparator}${path}`,
      userData,
      queryString,
    });
  }

  private static async makeRequest<T>(method: HttpMethod, userData: UserData, path: string, queryString?: Object, data?: any, useFormData?: boolean): Promise<T | undefined> {
    const pathSeparator = (path.indexOf('/') === 0) ? '' : '/';
    return HttpClientService.send<T>({
      method,
      path: `${CrowdBrandingApiService.API_PATH}${pathSeparator}${path}`,
      queryString,
      data,
      useFormData,
      userData,
    });
  }
}
