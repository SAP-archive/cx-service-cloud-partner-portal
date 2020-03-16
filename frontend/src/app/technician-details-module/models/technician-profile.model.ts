import { Skill, exampleSkill } from './skill.model';

export interface TechnicianProfile {
  externalId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  createdAt: string;
  address: {
    id: string;
    streetName: string;
    number: string;
    zipCode: string;
    city: string;
    country: string;
  };
  skills: Skill[];
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
  ]
});
