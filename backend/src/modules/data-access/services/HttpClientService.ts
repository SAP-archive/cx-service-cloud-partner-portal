import * as request from 'request-promise-native';
import { clientConfigService } from '../../common/services/ClientConfigService';
import { UserData } from '@modules/common/types';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class HttpClientService {
  public static async send<T>(options: {
    method: HttpMethod,
    path: string,
    headers?: Object,
    queryString?: Object,
    data?: any,
    useFormData?: boolean,
    userData: UserData,
  }): Promise<T> {
    const clientConfig = clientConfigService.getConfig();
    const pathSeparator = (options.path.indexOf('/') === 0) ? '' : '/';
    const dataPart = options.useFormData ? {formData: options.data, json: true} : {body: options.data, json: true};
    return request(
      `https://${clientConfig.backendClusterDomain}${pathSeparator}${options.path}`,
      {
        method: options.method,
        headers: {
          'Authorization': options.userData.authToken,
          'X-Client-ID': clientConfig.clientIdentifier,
          'X-Client-Version': clientConfig.clientVersion,
          'X-Account-Id': options.userData.accountId,
          'X-Company-Id': options.userData.companyId,
          'X-User-Id': options.userData.userId,
          'content-type': options.useFormData ? 'multipart/form-data; boundary=--------------------------523250607081183898636757' : 'application/json',
          ...options.headers,
        },
        qs: {
          ...options.queryString,
          'account': options.userData.accountName,
          'user': options.userData.userName,
          'company': options.userData.companyName,
        },
        ...dataPart
      },
    );
  }

  public static stream(options: {
    method: HttpMethod,
    path: string,
    headers?: Object,
    queryString?: Object,
    userData: UserData,
  }): request.RequestPromise {
    const clientConfig = clientConfigService.getConfig();
    const pathSeparator = (options.path.indexOf('/') === 0) ? '' : '/';
    return request({
      url: `https://${clientConfig.backendClusterDomain}${pathSeparator}${options.path}`,
      method: options.method,
      headers: {
        'Authorization': options.userData.authToken,
        'X-Client-Id': clientConfig.clientIdentifier,
        'X-Client-Version': clientConfig.clientVersion,
        'X-Account-Id': options.userData.accountId,
        'X-Company-Id': options.userData.companyId,
        'X-User-Id': options.userData.userId,
        ...options.headers,
      },
      qs: {
        ...options.queryString,
      },
    });
  }
}
