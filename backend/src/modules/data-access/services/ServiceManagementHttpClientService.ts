import * as request from 'request-promise-native';
import { clientConfigService } from '../../common/services/ClientConfigService';
import { UserData } from '@modules/common/types';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export class ServiceManagementHttpClientService {
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
        const dataPart = options.useFormData ? { formData: options.data, json: true } : { body: options.data, json: true };
        const domainUrl = clientConfig.backendClusterDomain.split('.')[0] + '.coresystems.net';
        return request(
            `https://${domainUrl}${pathSeparator}${options.path}`,
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
                    'X-Account-Name': options.userData.accountName,
                    'X-Company-Name': options.userData.companyName,
                    ...options.headers,
                },
                qs: {
                    ...options.queryString,
                },
                ...dataPart
            },
        );
    }
}
