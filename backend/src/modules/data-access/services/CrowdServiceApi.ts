import { HttpClientService, HttpMethod } from './HttpClientService';
import { UserData } from '@modules/common/types';
import * as request from 'request-promise-native';

export interface CrowdServiceResponse<T> {
  results: T[];
  numberOfElements?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  first?: boolean;
  last?: boolean;
}

export class CrowdServiceApi {
  private static API_PATH = '/cloud-crowd-service/api';

  public static async get<T>(userData: UserData, path: string, queryString?: Object): Promise<CrowdServiceResponse<T> | undefined> {
    return this.makeRequest<T>('GET', userData, path, queryString);
  }

  public static async put<T>(userData: UserData, path: string, data: T, queryString?: Object, useFormData?: boolean): Promise<CrowdServiceResponse<T> | undefined> {
    return this.makeRequest<T>('PUT', userData, path, queryString, data, useFormData);
  }

  public static async post<T>(userData: UserData, path: string, data: any, queryString?: Object, useFormData?: boolean): Promise<CrowdServiceResponse<T> | undefined> {
    return this.makeRequest<T>('POST', userData, path, queryString, data, useFormData);
  }

  public static async delete<T>(userData: UserData, path: string, data?: T, queryString?: Object, useFormData?: boolean): Promise<CrowdServiceResponse<T> | undefined> {
    return this.makeRequest<T>('DELETE', userData, path, queryString, data, useFormData);
  }

  public static stream(userData: UserData, path: string, queryString?: Object): request.RequestPromise {
    const pathSeparator = (path.indexOf('/') === 0) ? '' : '/';
    return HttpClientService.stream({
      method: 'GET',
      path: `${CrowdServiceApi.API_PATH}${pathSeparator}${path}`,
      userData,
      queryString,
    });
  }

  public static async makeRequest<T>(method: HttpMethod, userData: UserData, path: string, queryString?: Object, data?: any, useFormData?: boolean): Promise<CrowdServiceResponse<T> | undefined> {
    const pathSeparator = (path.indexOf('/') === 0) ? '' : '/';
    return HttpClientService.send<CrowdServiceResponse<T>>({
      method,
      path: `${CrowdServiceApi.API_PATH}${pathSeparator}${path}`,
      queryString,
      data,
      useFormData,
      userData,
    });
  }
}
