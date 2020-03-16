import { UserData } from '@modules/common/types';
import { ProfileObjectDao } from '@modules/data-access/daos/ProfileObjectDao';
import { ProfileObjectDto } from '@modules/data-access/dtos/profileObjectDto';

export class ProfileObjectService {
  public static read(userData: UserData): Promise<ProfileObjectDto> {
    return ProfileObjectDao.fetch(userData);
  }

  public static readMaxAttachmentSize(userData: UserData) {
    const microserviceSizeCap = 20000000;
    return this.read(userData)
      .then(profileObject => profileObject.maxAttachmentSize < microserviceSizeCap ? profileObject.maxAttachmentSize : microserviceSizeCap);
  }
}
