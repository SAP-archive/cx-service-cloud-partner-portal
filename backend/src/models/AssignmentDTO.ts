import { PartnerDispatchingStatus } from '../types/PartnerDispatchingStatus';
import { ServiceAssignmentState } from '../types/ServiceAssignmentState';
import { SyncStatus } from '../types/SyncStatus';
import { exampleTechnicianDto } from '@modules/data-access/models/Technician';
import { Equipment, exampleEquipment } from './Equipment';

export interface AssignmentDTO {
  activity: {
    id: string;
    subject: string;
    endDateTime: string;
    startDateTime: string;
    dueDateTime: string;
    code: string;
    syncStatus: SyncStatus;
    lastChanged: number;
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
    syncStatus: SyncStatus;
    lastChanged: number;
  };
  serviceCall: {
    priority: string;
    typeName: string;
  };
  serviceAssignmentStatus: {
    name: string;
  };
  equipments: Equipment[];
}

export const exampleAssignmentDTO = (id = '123'): AssignmentDTO => ({
  activity: {
    id,
    code: '1',
    subject: 'fix the printer',
    startDateTime: '01.08.2020',
    endDateTime: '01.08.2020',
    dueDateTime: '04.08.2020',
    syncStatus: 'IN_CLOUD',
    lastChanged: 1610529398,
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
    syncStatus: 'IN_CLOUD',
    lastChanged: 1610529399,
  },
  serviceCall: {
    priority: 'HIGH',
    typeName: 'Repair',
  },
  serviceAssignmentStatus: null,
  equipments: [
    exampleEquipment()
  ],
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
