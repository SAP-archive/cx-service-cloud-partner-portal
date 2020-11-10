import { PartnerDispatchingStatus } from '../types/PartnerDispatchingStatus';
import { ServiceAssignmentState } from '../types/ServiceAssignmentState';
import { exampleTechnicianDto } from '@modules/data-access/models/Technician';

export interface AssignmentDTO {
  activity: {
    id: string;
    subject: string;
    endDateTime: string;
    startDateTime: string;
    dueDateTime: string;
    code: string;
  };
  address: {
    street: string;
    streetNo: string,
    city: string;
    zipCode: string;
  };
  serviceAssignment: {
    technician: string;
    partnerDispatchingStatus: PartnerDispatchingStatus;
    state: ServiceAssignmentState;
  };
}

export const exampleAssignmentDTO = (id = '123'): AssignmentDTO => ({
  activity: {
    id,
    code: '1',
    subject: 'fix the printer',
    startDateTime: '01.08.2020',
    endDateTime: '01.08.2020',
    dueDateTime: '04.08.2020',
  },
  address: {
    city: 'City',
    street: 'Street',
    streetNo: '1',
    zipCode: '00-123',
  },
  serviceAssignment: {
    partnerDispatchingStatus: 'CONFIRMED',
    technician: exampleTechnicianDto().externalId,
    state: 'ASSIGNED',
  }
});

export interface AssignmentUpdateDTO {
  responsible: string;
  endDateTime: string;
  startDateTime: string;
}

export const exampleAssignmentUpdateDTO = (): AssignmentUpdateDTO => ({
  responsible: exampleAssignmentDTO().serviceAssignment.technician,
  endDateTime: exampleAssignmentDTO().activity.endDateTime,
  startDateTime: exampleAssignmentDTO().activity.startDateTime,
});
