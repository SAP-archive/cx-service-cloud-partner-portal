import { UserData } from '@modules/common/types';
import { TechnicianDao } from '@modules/data-access/daos/TechnicianDao';
import { TechnicianDto } from '@modules/data-access/models/Technician';
import { Skill } from '@modules/data-access/models';
import { SkillDto } from '@modules/data-access/dtos';
import { NewSkillCertificate } from '@modules/data-access/models/SkillCertificate';
import { UpdateTechnicianRequest } from 'api/TechnicianController';
import { SkillDao } from '@modules/data-access/daos/SkillDao';
import { CrowdServiceResponse } from '../modules/data-access/services/CrowdServiceApi';
import { omit } from '../utils/omit';

export class TechnicianService {
  public static readAll(userData: UserData): Promise<TechnicianDto[]> {
    return TechnicianDao.readAll(userData);
  }

  public static search(userData: UserData, queryParams: { page: number, size: number, name?: string, externalId?: string }): Promise<CrowdServiceResponse<TechnicianDto>> {
    return TechnicianDao.search(userData, queryParams);
  }

  public static read(userData: UserData, technicianId: string): Promise<TechnicianDto> {
    return TechnicianDao.read(userData, technicianId);
  }

  public static remove(userData: UserData, technicianId: string): Promise<unknown> {
    return TechnicianDao.read(userData, technicianId).then( (technician: TechnicianDto) => {
      return TechnicianDao.remove(userData, technician);
    });
  }

  public static async update(
    userData: UserData,
    technicianId: string,
    data: UpdateTechnicianRequest['body'],
  ): Promise<TechnicianDto> {
    if (!data.profile.crowdType) {
      return Promise.all([
        TechnicianDao.updateSkills(userData, technicianId, data.skills, data.certificates),
        TechnicianDao.updateProfile(userData, technicianId, { ...omit(data.profile, 'crowdType') })
      ]).then(([, technician]) => technician);
    } else {
      return TechnicianDao.changeRole(userData, technicianId, data.profile.crowdType).then(() => {
        return Promise.all([
          TechnicianDao.updateSkills(userData, technicianId, data.skills, data.certificates),
          TechnicianDao.updateProfile(userData, technicianId, data.profile)
        ]).then(([, technician]) => technician);
      });
    }
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
        return TechnicianDao.updateSkills(userData, technicianExternalId, { add: data.skills, remove: [] }, { add: data.certificates, remove: [] });
      })
      .then(() => TechnicianDao.read(userData, technicianExternalId));
  }

  public static async readSkills(userData: UserData, technicianId: string, tagExternalId: string): Promise<SkillDto[]> {
    return TechnicianService.fetchSkills(userData, technicianId, 0, 1000)
      .then(response => response.results);
  }

  public static async fetchSkills(userData: UserData, technicianId: string, page: number, size: number): Promise<CrowdServiceResponse<SkillDto>> {
    return SkillDao.getByPage(userData, technicianId, page, size);
  }

  public static async assignSkill(userData: UserData, technicianId: string, tagExternalId: string): Promise<SkillDto> {
    return TechnicianDao.assignSkill(userData, technicianId, tagExternalId);
  }

  public static async removeSkill(userData: UserData, technicianId: string, skillId: string): Promise<void> {
    return TechnicianDao.removeSkill(userData, technicianId, skillId);
  }
}
