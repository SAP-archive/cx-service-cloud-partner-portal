import { CrowdServiceApi, CrowdServiceResponse } from '../services/CrowdServiceApi';
import { UserData } from '@modules/common/types';
import { TechnicianDto } from '../models/Technician';
import { Address, CrowdType, Skill } from '../models';
import { SkillDto } from '../dtos';
import { HttpClientService } from '@modules/data-access';
import { NewSkillCertificate } from '../models/SkillCertificate';
import { SkillCertificateDao } from './SkillCertificateDao';
import { CrowdTypeDto } from '../dtos/CrowdTypeDto';

export type OperationResult = { requestId: string, status: string, error: any, entry: SkillDto, failure: boolean };

export class TechnicianDao {
  public static async readAll(userData: UserData): Promise<TechnicianDto[]> {
    return CrowdServiceApi.get<TechnicianDto>(userData, 'crowd/v2/technicians', { size: 1000 })
      .then(response => response.results);
  }

  public static async search(userData: UserData, queryParams: { page: number, size: number, name?: string, externalId?: string }): Promise<CrowdServiceResponse<TechnicianDto>> {
    return CrowdServiceApi.get<TechnicianDto>(userData, 'crowd/v2/technicians', {
      page: queryParams.page,
      size: queryParams.size,
      name: queryParams.name || '',
      externalId: queryParams.externalId || '',
    });
  }

  public static async read(userData: UserData, technicianId: string): Promise<TechnicianDto> {
    return CrowdServiceApi.get<TechnicianDto>(userData, `crowd/v2/technicians/external-id/${technicianId}`)
      .then(response => response.results[0]);
  }

  public static async create(userData: UserData, technicianData: Partial<TechnicianDto>): Promise<TechnicianDto> {
    return CrowdServiceApi.post<TechnicianDto>(userData, `crowd/v2/technicians`, {
      firstName: technicianData.firstName,
      lastName: technicianData.lastName,
      email: technicianData.email,
      mobilePhone: technicianData.mobilePhone,
      inactive: technicianData.inactive,
      address: TechnicianDao.resolveAddress(technicianData.address)
    } as Partial<TechnicianDto>)
      .then(response => response.results[0]);
  }

  public static async updateProfile(userData: UserData, technicianId: string, data: any): Promise<TechnicianDto> {
    const addressId: string = data.address && data.address.id ? data.address.id : '';
    let result: TechnicianDto;
    return CrowdServiceApi.put<TechnicianDto>(userData, `crowd/v2/technicians/external-id/${technicianId}`, {...data, address: TechnicianDao.resolveAddress(data.address)})
      .then(response => {
        result = response.results[0];
        if (addressId && TechnicianDao.isEmptyAddress(data.address)) {
          return TechnicianDao.deleteAddress(userData, technicianId, data.address.id);
        }
        return result;
      })
      .then(() => TechnicianDao.resolveUpdateProfileResult(result));
  }

  private static resolveAddress(address: Address): Address {
      return TechnicianDao.isEmptyAddress(address) ? null : address;
  }

  private static isEmptyAddress(address: Address): boolean {
    const isEmpty = (value: string | null) => {
      return !value || (typeof value === 'string' && !value.trim());
    };
    return !address || isEmpty(address.city) && isEmpty(address.country) && isEmpty(address.number) && isEmpty(address.streetName) && isEmpty(address.zipCode) ? true : false;
  }

  private static async deleteAddress(userData: UserData, technicianId: string, addressId: string): Promise<unknown> {
    return CrowdServiceApi.delete(userData, `crowd/v2/technicians/${technicianId}/addresses/${addressId}`);
  }

  private static resolveUpdateProfileResult(technician: TechnicianDto): TechnicianDto {
    return TechnicianDao.isEmptyAddress(technician.address) ? {...technician, address: null } : technician;
  }

  public static async changeRole(userData: UserData, personId: string, crowdUserType: CrowdType): Promise<CrowdTypeDto> {
    return CrowdServiceApi.post<CrowdTypeDto>(userData, `crowd-partner/v1/users/${personId}/actions/change-role`, { crowdUserType })
      .then(response => response.results[0]);
  }

  public static async assignSkill(userData: UserData, technicianId: string, tagExternalId: string): Promise<SkillDto> {
    return CrowdServiceApi.post<SkillDto>(userData, `crowd/v2/technicians/${technicianId}/skills`, {
      tagExternalId,
    }).then(response => response.results[0]);
  }

  public static async removeSkill(userData: UserData, technicianId: string, tagExternalId: string): Promise<any> {
    return CrowdServiceApi.get<SkillDto>(userData, `crowd/v2/technicians/${technicianId}/skills`)
      .then(result => {
        const skill = result.results.find(entry => entry.tagExternalId === tagExternalId);
        if (!skill) {
          throw new Error('Skill does not exist on technician.');
        }
        return CrowdServiceApi.delete(userData, `crowd/v2/technicians/${technicianId}/skills/${skill.uuid}`);
      });
  }

  public static async updateSkills(
    userData: UserData,
    technicianId: string,
    skills: { add: Skill[]; remove: Skill[] },
    certificates: { add: NewSkillCertificate[]; remove: Skill[]; },
  ): Promise<Array<OperationResult | Skill>> {
    const skillsToAddWithCert = [];
    const skillsToAddWithoutCert = [];
    const skillsToUpdate = certificates.remove;
    const skillsToDelete = skills.remove;

    skills.add.forEach(skill => {
      const certToAdd = certificates.add.find(cert => cert.viewModelId === skill.viewModelId);
      if (certToAdd) {
        certificates.add.splice(certificates.add.indexOf(certToAdd), 1);
        skillsToAddWithCert.push({ skill, certificate: certToAdd });
      } else {
        skillsToAddWithoutCert.push(skill);
      }
    });

    const requests = [
      ...skillsToAddWithCert.map(skill => TechnicianDao.postSkill(userData, technicianId, skill)),
      ...certificates.add.map(cert => SkillCertificateDao.uploadDocument(userData, technicianId, cert.skillId, cert))
    ];
    if (skillsToAddWithoutCert.length + skillsToDelete.length + skillsToUpdate.length > 0) {
      requests.push(TechnicianDao.postSkillsInBatch(userData, technicianId, skillsToAddWithoutCert, skillsToDelete, skillsToUpdate));
    }
    return Promise.all(requests);
  }

  public static remove(userData: UserData, tech: TechnicianDto): Promise<unknown> {
    const technicianId = tech.externalId;
    const addressId = tech.address && tech.address.id ? tech.address.id : '';
    return HttpClientService.send<undefined>({
      method: 'DELETE',
      userData,
      path: `/cloud-crowd-service/api/crowd/v2/technicians/external-id/${technicianId}`,
    }).then(response => {
      if (addressId) {
        return TechnicianDao.deleteAddress(userData, technicianId, addressId).catch((err) => {
          console.error(`Failed to delete address ${addressId} for technician ${technicianId}`, err);
        }).finally(() => response);
      }
      return response;
    });
  }

  private static postSkill(userData: UserData, technicianId: string, { skill, certificate }: { skill: Skill; certificate: NewSkillCertificate }): Promise<Skill> {
    return CrowdServiceApi.post<Skill>(userData, `crowd/v2/technicians/${technicianId}/skills`,
      {
        file: {
          value: Buffer.from(certificate.fileContents, 'base64'),
          options: {
            filename: certificate.fileName,
            contentType: certificate.contentType,
          },
        },
        skill: {
          value: Buffer.from(JSON.stringify(skill)),
          options: {
            fileName: 'skill.json',
            contentType: 'application/json'
          }
        }
      }, undefined, true)
      .then(response => response.results[0]);
  }

  private static postSkillsInBatch(
    userData: UserData,
    technicianId: string,
    skillsToAdd: Skill[],
    skillsToDelete: Skill[],
    skillsToUpdate: Skill[]
  ): Promise<any> {
    let requestId = 0;
    return CrowdServiceApi.post<OperationResult>(
      userData,
      `crowd/v2/technicians/${technicianId}/skills/actions/batch`,
      {
        requests: [
          ...skillsToAdd.map(skill => ({ requestId: requestId++, operation: 'CREATE', skill })),
          ...skillsToDelete.map(skill => ({ requestId: requestId++, operation: 'DELETE', skill })),
          ...skillsToUpdate.map(skill => ({ requestId: requestId++, operation: 'UPDATE', skill: { ...skill, certificate: null } })),
        ],
      },
    );
  }
}
