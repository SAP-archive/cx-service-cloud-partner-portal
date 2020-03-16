import * as request from 'request-promise-native';
import { OAuthLoginResponse } from '../types/OAuthLoginResponse';
import { clientConfigService } from '@modules/common';
import { ClientConfiguration } from '@modules/common/types/ClientConfiguration';
import crypto = require('crypto');

export interface LoginData {
  accountName: string;
  userName: string;
  password: string;
}

export interface ChangePasswordData {
  accountName: string;
  userName: string;
  oldPassword: string;
  newPassword: string;
}

export class AuthService {
  public static async login(loginData: LoginData): Promise<OAuthLoginResponse> {
    const clientConfig = clientConfigService.getConfig();
    return request({
      method: 'POST',
      uri: `${AuthService.getOAuthUrl(clientConfig)}/token`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Basic ${AuthService.getBasicAuth(clientConfig)}`,
        'X-Client-Id': clientConfig.clientIdentifier,
        'X-Client-Version': clientConfig.clientVersion,
        'X-Request-ID': crypto.randomBytes(16).toString('hex'),
      },
      form: {
        grant_type: 'password',
        username: `${loginData.accountName}/${loginData.userName}`,
        password: loginData.password,
      },
    }).then((response: string) => JSON.parse(response));
  }

  public static async changePassword(changePasswordData: ChangePasswordData): Promise<undefined> {
    const clientConfig = clientConfigService.getConfig();
    return request({
      method: 'POST',
      uri: `${AuthService.getOAuthUrl(clientConfig)}/change_password`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Basic ${(AuthService.getBasicAuth(clientConfig))}`,
        'X-Client-Id': clientConfig.clientIdentifier,
        'X-Client-Version': clientConfig.clientVersion,
        'X-Request-ID': crypto.randomBytes(16).toString('hex'),
      },
      body: `old_password=${changePasswordData.oldPassword}&username=${changePasswordData.accountName}%2F${changePasswordData.userName}&new_password=${changePasswordData.newPassword}`,
    }).then((response: string) => JSON.parse(response));
  }

  public static async logout(token: string): Promise<string> {
    const clientConfig = clientConfigService.getConfig();
    const basicAuth = new Buffer(`${clientConfig.clientIdentifier}:${clientConfig.clientSecret}`).toString('base64');
    return request({
      method: 'DELETE',
      uri: `${AuthService.getOAuthUrl(clientConfig)}/token/${token}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Basic ${basicAuth}`,
        'X-Client-Id': clientConfig.clientIdentifier,
        'X-Client-Version': clientConfig.clientVersion,
        'X-Request-ID': crypto.randomBytes(16).toString('hex'),
      },
    });
  }

  private static getOAuthUrl(clientConfig: ClientConfiguration): string {
    return `${clientConfig.directoryServiceUrl}/api/oauth2/v1`;
  }

  private static getBasicAuth(clientConfig: ClientConfiguration) {
    return new Buffer(`${clientConfig.clientIdentifier}:${clientConfig.clientSecret}`).toString('base64');
  }
}
