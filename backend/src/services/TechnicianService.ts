import { UserData } from '@modules/common/types';
import { SingleOperationResultWithViewModelId, TechnicianDao } from '@modules/data-access/daos/TechnicianDao';
import { TechnicianDto } from '@modules/data-access/models/Technician';
import { Address, Skill } from '@modules/data-access/models';
import { SkillDto } from '@modules/data-access/dtos';
import { SkillCertificatesService } from './SkillCertificatesService';
import { NewSkillCertificate } from '@modules/data-access/models/SkillCertificate';
import { UpdateTechnicianRequest } from 'api/TechnicianController';
import { SkillDao } from '@modules/data-access/daos/SkillDao';

export class TechnicianService {
  public static readAll(userData: UserData): Promise<TechnicianDto[]> {
    return TechnicianDao.readAll(userData);
  }

  public static read(userData: UserData, technicianId: string): Promise<TechnicianDto> {
    return TechnicianDao.read(userData, technicianId);
  }

  public static remove(userData: UserData, technicianId: string): Promise<undefined> {
    return TechnicianDao.remove(userData, technicianId);
  }

  public static async update(
    userData: UserData,
    technicianId: string,
    data: UpdateTechnicianRequest['body'],
  ): Promise<[void, TechnicianDto, Address]> {
    return TechnicianDao.updateSkills(userData, technicianId, data.skills, data.certificates.remove)
      .then((batchOperationsResult) => Promise.all([
        SkillCertificatesService.uploadAll(
          userData,
          technicianId,
          data.certificates.add,
          TechnicianService.getViewModelSkillIdMap(batchOperationsResult),
        ),
        TechnicianDao.updateProfile(userData, technicianId, data.profile),
        TechnicianDao.updateAddress(userData, technicianId, data.profile.address),
      ]));
  }

  public static async create(
    userData: UserData,
    data: {
      profile: TechnicianDto,
      skills: Skill[],
      certificates: NewSkillCertificate[],
    }): Promise<TechnicianDto> {
    let technicianExternalId;
    return TechnicianDao.create(userData, data.profile)
      .then(profile => {
        technicianExternalId = profile.externalId;
        return Promise.all<any>([
          TechnicianDao.updateSkills(userData, technicianExternalId, {add: data.skills, remove: []}),
          TechnicianDao.updateAddress(userData, technicianExternalId, data.profile.address),
        ])
          .then(([batchOperationsResult]) => SkillCertificatesService.uploadAll(
            userData,
            technicianExternalId,
            data.certificates,
            TechnicianService.getViewModelSkillIdMap(batchOperationsResult),
          ));
      })
      .then(() => TechnicianDao.read(userData, technicianExternalId));
  }

  public static async readSkills(userData: UserData, technicianId: string, tagExternalId: string): Promise<SkillDto[]> {
    return SkillDao.getAll(userData, technicianId);
  }

  public static async assignSkill(userData: UserData, technicianId: string, tagExternalId: string): Promise<SkillDto> {
    return TechnicianDao.assignSkill(userData, technicianId, tagExternalId);
  }

  public static async removeSkill(userData: UserData, technicianId: string, skillId: string): Promise<void> {
    return TechnicianDao.removeSkill(userData, technicianId, skillId);
  }

  private static getViewModelSkillIdMap(batchOperationsResult: SingleOperationResultWithViewModelId[]): { [key: string]: string } {
    return batchOperationsResult.reduce(
      (result, operationResult) => {
        result[operationResult.viewModelId] = operationResult.entry && operationResult.entry.uuid;
        return result;
      },
      {},
    );
  }
}
