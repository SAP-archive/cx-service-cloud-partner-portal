import { ServiceManagementHttpClientService, HttpMethod } from './ServiceManagementHttpClientService';
import { UserData } from '@modules/common/types';

export class ServiceManagementApi {
  private static API_PATH = '/api/service-management';

  public static async post(userData: UserData, path: string, data: any, queryString?: Object, useFormData?: boolean): Promise<number| undefined> {
    return this.makeRequest('POST', userData, path, queryString, data, useFormData);
  }

  public static async makeRequest(method: HttpMethod, userData: UserData, path: string, queryString?: Object, data?: any, useFormData?: boolean): Promise<number| undefined> {
    const pathSeparator = (path.indexOf('/') === 0) ? '' : '/';
    return ServiceManagementHttpClientService.send<number>({
      method,
      path: `${ServiceManagementApi.API_PATH}${pathSeparator}${path}`,
      queryString,
      data,
      useFormData,
      userData,
    });
  }
}
