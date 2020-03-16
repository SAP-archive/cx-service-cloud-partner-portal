import { HttpClientService } from './HttpClientService';
import { UserData } from '@modules/common/types';

export type DtoVersions = {[entity: string]: number};
export type QueryApiResponse = {data: any[]};

export class QueryApiService {
  public static async query<T>(userData: UserData, query: string, dtoVersions: DtoVersions): Promise<T[]> {
    return HttpClientService.send<QueryApiResponse>({
      method: 'POST',
      data: {query},
      path: '/api/query/v1',
      userData,
      queryString: {
        dtos: QueryApiService.getDtoVersionString(dtoVersions),
      },
    }).then(response => response.data);
  }

  private static getDtoVersionString(versions: DtoVersions): string {
    return Object.keys(versions).reduce((result, keyName) =>
      (result.length > 0)
        ? `${result};${keyName}.${versions[keyName]}`
        : `${keyName}.${versions[keyName]}`, '');
  }
}
