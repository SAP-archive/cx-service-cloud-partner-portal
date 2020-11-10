import { DispatchingStatus } from './dispatching-status';
import { ServiceAssignmentState } from './service-assignment-state';
import { exampleTechnician, Technician } from '../../technicians-list-module/models/technician.model';

export interface Assignment {
  id: string;
  code: string;
  subject: string;
  address: string;
  partnerDispatchingStatus: DispatchingStatus;
  startDateTime: string;
  endDateTime: string;
  dueDateTime: string;
  responsiblePerson: Technician;
  isValid?: boolean;
  serviceAssignmentState: ServiceAssignmentState;
}

export const exampleAssignment = (
  id = '123',
  partnerDispatchingStatus: DispatchingStatus = 'NOTIFIED',
  serviceAssignmentState: ServiceAssignmentState = 'ASSIGNED',
): Assignment => ({
  id,
  code: '1',
  subject: 'fix the printer',
  address: 'Street 1, City, 00-123',
  startDateTime: '01.08.2020',
  endDateTime: '01.08.2020',
  dueDateTime: '04.08.2020',
  partnerDispatchingStatus,
  responsiblePerson: exampleTechnician(),
  isValid: true,
  serviceAssignmentState,
});


export const newAssignment = (id = '123') => exampleAssignment(id, 'NOTIFIED');

export const readyToPlanAssignment = (id = '123') => exampleAssignment(id, 'ACCEPTED', 'ASSIGNED');

export const ongoingAssignment = (id = '123') => exampleAssignment(id, 'ACCEPTED', 'RELEASED');

export const closedAssignment = (id = '123') => exampleAssignment(id, 'ACCEPTED', 'CLOSED');
