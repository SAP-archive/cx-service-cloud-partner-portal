import * as request from 'request-promise-native';
import { OAuthLoginResponse } from '../types/OAuthLoginResponse';
import { clientConfigService } from '@modules/common';
import { ClientConfiguration } from '@modules/common/types/ClientConfiguration';
import crypto = require('crypto');
import querystring = require('querystring');
import { VaultService } from '../../../services/VaultService';
export interface LoginData {
  accountName: string;
  userName: string;
  password: string;
}

export interface ResetPasswordData {
  accountName: string;
  userName: string;
  user_email_address: string;
  verification_code: string;
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
      headers: this.getHeaders(),
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
      headers: this.getHeaders(),
      body: `old_password=${changePasswordData.oldPassword}&username=${changePasswordData.accountName}%2F${changePasswordData.userName}&new_password=${changePasswordData.newPassword}`,
    }).then((response: string) => JSON.parse(response));
  }

  public static async userPartialEmailAddress(data: ResetPasswordData): Promise<string> {

    const clientConfig = clientConfigService.getConfig();
    return request({
      method: 'POST',
      uri: `${AuthService.getOAuthUrl(clientConfig)}/userPartialEmailAddress`,
      headers: {
        ...this.getHeadersForRestPwd(),
        Accept: 'text/plain',
      },
      body: `accountName=${data.accountName}&userName=${data.userName}`,
    });
  }

  public static async sendVerificationCode(data: ResetPasswordData): Promise<undefined> {
    const clientConfig = clientConfigService.getConfig();
    return request({
      method: 'POST',
      uri: `${AuthService.getOAuthUrl(clientConfig)}/send_verification_code`,
      headers: this.getHeadersForRestPwd(),
      body: querystring.stringify(data as any),
    });
  }

  public static async verifyVerificationCode(data: ResetPasswordData): Promise<undefined> {
    const clientConfig = clientConfigService.getConfig();
    return request({
      method: 'POST',
      uri: `${AuthService.getOAuthUrl(clientConfig)}/verify_verification_code`,
      headers: this.getHeadersForRestPwd(),
      body: querystring.stringify(data as any),
    });
  }

  public static async resetPassword(data: ResetPasswordData): Promise<undefined> {
    const clientConfig = clientConfigService.getConfig();
    return request({
      method: 'POST',
      uri: `${AuthService.getOAuthUrl(clientConfig)}/reset_password`,
      headers: this.getHeadersForRestPwd(),
      body: querystring.stringify(data as any),
    });
  }

  public static async logout(token: string): Promise<string> {
    const clientConfig = clientConfigService.getConfig();
    return request({
      method: 'DELETE',
      uri: `${AuthService.getOAuthUrl(clientConfig)}/token/${token}`,
      headers: this.getHeaders(),
    });
  }

  private static getOAuthUrl(clientConfig: ClientConfiguration): string {
    return `${clientConfig.directoryServiceUrl}/api/oauth2/v1`;
  }

  private static getBasicAuth(clientConfig: ClientConfiguration) {
    return Buffer.from(`${clientConfig.clientIdentifier}:${clientConfig.clientSecret}`).toString('base64');
  }

  private static getHeaders() {
    const clientConfig = clientConfigService.getConfig();
    return {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Authorization': `Basic ${AuthService.getBasicAuth(clientConfig)}`,
      'X-Client-Id': clientConfig.clientIdentifier,
      'X-Client-Version': clientConfig.clientVersion,
      'X-Request-ID': crypto.randomBytes(16).toString('hex'),
    };
  }

  private static getHeadersForRestPwd() {
    const client = {
      'clientIdentifier': VaultService.CLIENT_ID,
      'clientSecret': VaultService.CLIENT_SECRET
    };

    return {
      ...this.getHeaders(),
      Authorization: `Basic ${this.getBasicAuth(client as ClientConfiguration)}`,
    };
  }
}
