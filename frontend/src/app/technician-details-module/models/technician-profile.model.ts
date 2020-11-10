import { Skill, exampleSkill } from './skill.model';
import { SyncStatus } from '../../model/sync-status';
import { CrowdType } from './crowd-type';

export interface TechnicianProfile {
  externalId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  createdAt: string;
  syncStatus?: SyncStatus;
  address: {
    id: string;
    streetName: string;
    number: string;
    zipCode: string;
    city: string;
    country: string;
    syncStatus?: SyncStatus;
  };
  skills: Skill[];
  inactive: boolean;
  crowdType: CrowdType;
}

export const emptyTechnicianProfile = (): TechnicianProfile => ({
  externalId: '',
  firstName: '',
  lastName: '',
  email: '',
  mobilePhone: '',
  createdAt: '',
  address: {
    id: '',
    streetName: '',
    number: '',
    zipCode: '',
    city: '',
    country: '',
  },
  skills: [],
  inactive: false,
  crowdType: ''
});

export const exampleTechnicianProfile = (externalId = 'ASD123'): TechnicianProfile => ({
  externalId,
  firstName: 'John',
  lastName: 'Doe',
  email: 'asd@asd.de',
  mobilePhone: '12345',
  createdAt: '2019-11-19T13:13:41Z',
  address: {
    id: 'KJHUIZHJK',
    streetName: 'Ungererstrasse',
    number: '110',
    zipCode: '80805',
    city: 'Munich',
    country: 'Germany',
  },
  skills: [
    exampleSkill('DSA1'),
  ],
  inactive: false,
  crowdType: 'PARTNER_TECHNICIAN'
});
