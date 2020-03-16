import { OAuthLoginResponse } from '../types/OAuthLoginResponse';
import { SessionData } from '../types/SessionData';

export class SessionDataFactory {
  public static create(loginResponse: OAuthLoginResponse): SessionData {
    const [selectedCompany] = loginResponse.companies;

    return {
      accountName: loginResponse.account,
      accountId: loginResponse.account_id.toString(10),
      userName: loginResponse.user,
      userId: loginResponse.user_id.toString(10),
      companyName: selectedCompany.name,
      companyId: selectedCompany.id.toString(10),
      authToken: SessionDataFactory.getFormattedToken(loginResponse),
      clusterUrl: loginResponse.cluster_url,
    };
  }

  private static getFormattedToken(loginResponse: OAuthLoginResponse): string {
    return `${loginResponse.token_type} ${loginResponse.access_token}`;
  }
}
