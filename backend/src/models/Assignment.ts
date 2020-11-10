import { PartnerDispatchingStatus } from '../types/PartnerDispatchingStatus';
import { ServiceAssignmentState } from '../types/ServiceAssignmentState';
import { TechnicianDto } from '@modules/data-access/models';
import { exampleTechnicianDto } from '@modules/data-access/models/Technician';

export interface Assignment {
  id: string;
  code: string;
  subject: string;
  address: string;
  partnerDispatchingStatus: PartnerDispatchingStatus;
  startDateTime: string;
  endDateTime: string;
  dueDateTime: string;
  responsiblePerson: TechnicianDto;
  serviceAssignmentState: ServiceAssignmentState;
}

export const exampleAssignment = (id = '123'): Assignment => ({
  id,
  code: '1',
  subject: 'fix the printer',
  address: 'Street 1, City, 00-123',
  startDateTime: '01.08.2020',
  endDateTime: '01.08.2020',
  dueDateTime: '04.08.2020',
  partnerDispatchingStatus: 'CONFIRMED',
  responsiblePerson: exampleTechnicianDto(),
  serviceAssignmentState: 'ASSIGNED',
});
