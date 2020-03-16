import { UserData } from '@modules/common/types';
import { DataApiService } from '@modules/data-access';
import { ProfileObjectDto } from '@modules/data-access/dtos/profileObjectDto';

export class ProfileObjectDao {
  public static async fetch(userData: UserData): Promise<ProfileObjectDto> {
    return DataApiService.download<ProfileObjectDto>(userData, 'ProfileObject');
  }
}
