import { UnifiedPerson } from '../../../models/UnifiedPerson';
import { UserData } from '@modules/common/types';
import { DataApiService, DtoVersionProvider, QueryApiService } from '@modules/data-access';
import { UnifiedPersonDto } from '../dtos/UnifiedPersonDto';

export class UnifiedPersonDao {
  public static async findForCurrentUser(userData: UserData): Promise<UnifiedPerson | undefined> {
    return UnifiedPersonDao.findByUserName(userData, userData.userName);
  }

  public static async findPartnerIdForCurrentUser(userData: UserData): Promise<string | undefined> {
    const [entry] = await QueryApiService.query<{ person: UnifiedPersonDto }>(
      userData,
      `SELECT
        person.id,
        person.businessPartner
      FROM UnifiedPerson person
      WHERE person.userName = '${userData.userName}'`,
      {
        UnifiedPerson: DtoVersionProvider.getVersion('UnifiedPerson'),
      },
    );

    return !!entry ? entry.person.businessPartner : undefined;
  }

  public static async findByUserName(userData: UserData, userName: string): Promise<UnifiedPerson | undefined> {
    const [entry] = await QueryApiService.query<{ person: UnifiedPersonDto }>(
      userData,
      `SELECT
        person.id,
        person.firstName,
        person.lastName,
        person.inactive,
        person.personStatus
      FROM UnifiedPerson person
      WHERE person.userName = '${userName}'`,
      {
        UnifiedPerson: DtoVersionProvider.getVersion('UnifiedPerson'),
      },
    );

    return !!entry ? UnifiedPersonDao.mapDtoToModel(entry.person) : undefined;
  }

  public static async findById(userData: UserData, id: string): Promise<UnifiedPerson | undefined> {
    return DataApiService.findById<UnifiedPersonDto>(userData, 'UnifiedPerson', id)
      .then(entry => !!entry ? UnifiedPersonDao.mapDtoToModel(entry) : undefined);
  }

  public static async readAll(userData: UserData): Promise<UnifiedPerson[]> {
    return QueryApiService.query<{ person: UnifiedPersonDto }>(userData, 'SELECT person FROM UnifiedPerson person', {
      UnifiedPerson: DtoVersionProvider.getVersion('UnifiedPerson'),
    }).then(results =>
      results.map(entry =>
        UnifiedPersonDao.mapDtoToModel(entry.person)));
  }

  private static mapDtoToModel(personDto: UnifiedPersonDto): UnifiedPerson {
    return { ...personDto };
  }
}
