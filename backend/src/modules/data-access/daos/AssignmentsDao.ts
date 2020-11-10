import { UserData } from '@modules/common/types';
import { CrowdServiceResponse } from '@modules/data-access/services/CrowdServiceApi';
import { Assignment } from '../../../models/Assignment';
import { CrowdDispatchingApi } from '@modules/data-access/services/CrowdDispatchingApi';
import { ServiceManagementApi } from '@modules/data-access/services/ServiceManagementApi';
import { AssignmentDTO, AssignmentUpdateDTO } from '../../../models/AssignmentDTO';
import { PartnerDispatchingStatus } from '../../../types/PartnerDispatchingStatus';
import { AssignmentDispatchActions, AssignmentDispatchDTO } from '../../../models/AssignmentDispatchDTO';
import { ServiceAssignmentState } from '../../../types/ServiceAssignmentState';
import { AssignmentsStats } from '../../../models/AssignmentsStats';
import { TechnicianDao } from '@modules/data-access/daos/TechnicianDao';
import { TechnicianDto } from '@modules/data-access/models';
import { ClientError } from '../../../interfaces/ClientError';

export interface AssignmentsFilter {
  partnerDispatchingStatus?: PartnerDispatchingStatus;
  serviceAssignmentState?: ServiceAssignmentState;
}

export class AssignmentsDao {
  public static async getByPage(userData: UserData, page: number, size: number, filter: AssignmentsFilter): Promise<CrowdServiceResponse<Assignment>> {
    const assignmentDtos = await CrowdDispatchingApi.get<AssignmentDTO>(
      userData,
      '/v1/assignment-details',
      {
        page,
        size,
        ...filter,
      },
    );
    const technicianIds = assignmentDtos.results
      .map(assignmentDto => assignmentDto.serviceAssignment.technician)
      .join(',');
    const technicians = await TechnicianDao.search(userData, {page, size, externalId: technicianIds});
    return {
      ...assignmentDtos,
      results: assignmentDtos.results.map(dto =>
        AssignmentsDao.convertDtoToAssignment(
          dto,
          technicians.results.find(technician => technician.externalId === dto.serviceAssignment.technician)),
      ),
    };
  }

  public static async update(userData: UserData, assignment: Assignment): Promise<Assignment> {
    return CrowdDispatchingApi.put<AssignmentUpdateDTO>(userData, `/v1/assignment-details/${assignment.id}`, {
      startDateTime: assignment.startDateTime,
      endDateTime: assignment.endDateTime,
      responsible: assignment.responsiblePerson.externalId,
    }).then(() => assignment);
  }

  public static async dispatch(userData: UserData, assignment: Assignment, action: AssignmentDispatchActions): Promise<Assignment> {
    return CrowdDispatchingApi.post<AssignmentDispatchDTO>(userData, `/partner-dispatch/v1/${action}`, {
      activityId: assignment.id,
      technicianId: assignment.responsiblePerson.externalId,
    }).then(() => AssignmentsDao.getStatusUpdatedAssignment(assignment, action));
  }

  public static async close(userData: UserData, assignment: Assignment): Promise<Assignment> {
    return ServiceManagementApi.post(userData, `/v2/activities/${assignment.id}/actions/close`, {}).then(() => ({
      ...assignment,
      serviceAssignmentState: 'CLOSED',
    }) as Assignment);
  }

  public static getError(errorResponse: any): ClientError {
    let message = 'BACKEND_ERROR_UNEXPECTED';
    if (errorResponse.error && errorResponse.error.detail) {
      message = errorResponse.error.detail;
    } else if (errorResponse.message) {
      message = errorResponse.message;
    }
    return {
      code: errorResponse.statusCode || 500,
      message,
    };
  }

  public static async getStats(userData: UserData): Promise<AssignmentsStats> {
    return Promise.all([
      AssignmentsDao.getByPage(userData, 0, 1, {partnerDispatchingStatus: 'NOTIFIED', serviceAssignmentState: 'ASSIGNED'}),
      AssignmentsDao.getByPage(userData, 0, 1, {partnerDispatchingStatus: 'ACCEPTED', serviceAssignmentState: 'ASSIGNED'}),
      AssignmentsDao.getByPage(userData, 0, 1, {partnerDispatchingStatus: 'ACCEPTED', serviceAssignmentState: 'RELEASED'}),
      AssignmentsDao.getByPage(userData, 0, 1, {partnerDispatchingStatus: 'ACCEPTED', serviceAssignmentState: 'CLOSED'}),
    ]).then(([
               newAssignmentsResult,
               readyToGoAssignmentsResult,
               ongoingAssignmentsResult,
               closedAssignmentsResult,
             ]) => {
      return {
        newCount: newAssignmentsResult.totalElements,
        readyToPlanCount: readyToGoAssignmentsResult.totalElements,
        ongoingCount: ongoingAssignmentsResult.totalElements,
        closedCount: closedAssignmentsResult.totalElements,
      };
    });
  }

  private static convertDtoToAssignment(assignmentDTO: AssignmentDTO, technicianDto: TechnicianDto): Assignment {
    return {
      id: assignmentDTO.activity.id,
      code: assignmentDTO.activity.code,
      address: AssignmentsDao.prepareAddressString(assignmentDTO.address),
      startDateTime: assignmentDTO.activity.startDateTime,
      endDateTime: assignmentDTO.activity.endDateTime,
      dueDateTime: assignmentDTO.activity.dueDateTime,
      responsiblePerson: technicianDto,
      partnerDispatchingStatus: assignmentDTO.serviceAssignment.partnerDispatchingStatus,
      serviceAssignmentState: assignmentDTO.serviceAssignment.state,
      subject: assignmentDTO.activity.subject,
    };
  }

  private static getStatusUpdatedAssignment(assignment: Assignment, action: AssignmentDispatchActions): Assignment {
    switch (action) {
      case 'accept':
        return {
          ...assignment,
          partnerDispatchingStatus: 'ACCEPTED',
        };
      case 'reject':
        return {
          ...assignment,
          partnerDispatchingStatus: 'REJECTED',
        };
      case 'release':
        return {
          ...assignment,
          serviceAssignmentState: 'RELEASED',
        };
      default:
        return assignment;
    }
  }

  private static prepareAddressString(address: AssignmentDTO['address'] | null): string {
    if (!address) {
      return '-';
    }
    const street = `${address.street || ''} ${address.streetNo || ''}`.trim();
    return `${street ? street + ', ' : ''}${address.city ? address.city + ', ' : ''}${address.zipCode || ''}`;
  }
}
