import { DtoVersionProvider } from './DtoVersionsProvider';
import { HttpClientService } from './HttpClientService';
import { DtoName } from '../types/DtoName';
import { UserData } from '@modules/common/types';

type DataApiResponse<T> = {
  data: T[],
};

export class DataApiService {
  private static DATA_API_PATH = '/api/data/v4';

  public static async findById<T>(userData: UserData, entity: DtoName, id: string, fields?: string[]): Promise<T | undefined> {
    return HttpClientService.send<DataApiResponse<T>>({
      method: 'GET',
      path: `${DataApiService.DATA_API_PATH}/${entity}/${id}`,
      queryString: {
        dtos: DtoVersionProvider.getVersionsParameter([entity]),
        fields: fields ? fields.join(';') : undefined,
      },
      userData,
    }).then(result => {
      const record = result.data[0];
      return record[Object.keys(record)[0]];
    });
  }

  public static async download<T>(userData: UserData, entity: DtoName, fields?: string[]): Promise<T | undefined> {
    return HttpClientService.send<DataApiResponse<T>>({
      method: 'POST',
      path: `${DataApiService.DATA_API_PATH}/${entity}/actions/download`,
      data: {
        dtos: DtoVersionProvider.getVersionsParameter([entity]),
        fields: fields ? fields.join(',') : undefined,
        expand: [],
      },
      userData,
    }).then(result => {
      const record = result.data[0];
      return record[Object.keys(record)[0]];
    });
  }
}
