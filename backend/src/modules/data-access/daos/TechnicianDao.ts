import { CrowdServiceApi } from '../services/CrowdServiceApi';
import { UserData } from '@modules/common/types';
import { TechnicianDto } from '../models/Technician';
import { Address, Skill } from '../models';
import { SkillDto } from '../dtos';
import { HttpClientService } from '@modules/data-access';

export type OperationResult = { requestId: string, status: string, error: any, entry: SkillDto, failure: boolean };
export type SingleOperationResultWithViewModelId = OperationResult & { viewModelId?: string };

export class TechnicianDao {
  public static async readAll(userData: UserData): Promise<TechnicianDto[]> {
    return CrowdServiceApi.get<TechnicianDto>(userData, 'crowd/v2/technicians', {size: 120})
      .then(response => response.results);
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
    } as Partial<TechnicianDto>)
      .then(response => response.results[0]);
  }

  public static async updateProfile(userData: UserData, technicianId: string, data: any): Promise<TechnicianDto> {
    return CrowdServiceApi.put<TechnicianDto>(userData, `crowd/v2/technicians/external-id/${technicianId}`, data)
      .then(response => response.results[0]);
  }

  public static async updateAddress(userData: UserData, technicianId: string, addressData: Address): Promise<Address> {
    if (addressData.id) {
      return CrowdServiceApi.put<Address>(userData, `crowd/v2/technicians/${technicianId}/addresses/${addressData.id}`, addressData)
        .then(response => response.results[0]);
    }

    return CrowdServiceApi.post<Address>(userData, `crowd/v2/technicians/${technicianId}/addresses`, {
      streetName: addressData.streetName,
      number: addressData.number,
      city: addressData.city,
      zipCode: addressData.zipCode,
      country: addressData.country,
    } as Address)
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
          throw  new Error('Skill does not exist on technician.');
        }
        return CrowdServiceApi.delete(userData, `crowd/v2/technicians/${technicianId}/skills/${skill.uuid}`);
      });
  }

  public static async updateSkills(
    userData: UserData,
    technicianId: string,
    skills: { add: Skill[]; remove: Skill[] },
    removeCertificatesFrom: Skill[] = [],
  ): Promise<SingleOperationResultWithViewModelId[]> {
    const idFactory = function () {
      let id = 0;
      return () => id++;
    }();

    const viewModelIds = skills.add.map(skill => skill.viewModelId);
    const addRequests = skills.add.map(skill => TechnicianDao.mapSkillToRequest(skill, 'CREATE', idFactory));
    const requestIds = addRequests.map(request => request.requestId);
    const requestIdToViewModelIdMap = requestIds.reduce(
      (map, requestId, index) => {
        map[requestId] = viewModelIds[index];
        return map;
      },
      {},
    );

    return CrowdServiceApi.post<OperationResult>(
      userData,
      `crowd/v2/technicians/${technicianId}/skills/actions/batch`,
      {
        requests: [
          ...addRequests,
          ...removeCertificatesFrom.map(skill => TechnicianDao.mapSkillIdToRemoveCertificateRequest(skill, idFactory)),
          ...skills.remove.map(skill => TechnicianDao.mapSkillToRequest(skill, 'DELETE', idFactory)),
        ],
      },
    )
      .then(response => response.results.map((result) => ({
        ...result,
        viewModelId: requestIdToViewModelIdMap[result.requestId],
      })));
  }

  public static remove(userData: UserData, technicianId: string): Promise<undefined> {
    return HttpClientService.send<undefined>({
      method: 'DELETE',
      userData,
      path: `/cloud-crowd-service/api/crowd/v2/technicians/external-id/${technicianId}`,
    });
  }

  private static mapSkillToRequest(
    skill: Skill,
    operation: 'CREATE' | 'DELETE',
    idFactory: () => number,
  ) {
    return {
      requestId: idFactory(),
      operation,
      skill,
    };
  }

  private static mapSkillIdToRemoveCertificateRequest(
    skill: Skill,
    idFactory: () => number,
  ) {
    return {
      requestId: idFactory(),
      operation: 'UPDATE',
      skill: {
        ...skill,
        certificate: null,
      },
    };
  }
}
