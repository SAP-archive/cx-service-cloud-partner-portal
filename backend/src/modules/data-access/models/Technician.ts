import { Skill } from './Skill';
import { Address } from './Address';

export interface TechnicianDto {
  readonly externalId: string;
  readonly skills: Skill[];
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly businessPartner: string;
  readonly mobilePhone: string;
  readonly createdAt: string;
  readonly address?: Address;
}

export const exampleTechnicianDto = (): TechnicianDto => ({
  externalId: 'e5d8c4733056414f92b2',
  skills: [],
  email: 'john.doe@web.de',
  firstName: 'John',
  lastName: 'Doe',
  businessPartner: '40f94cd865e5',
  mobilePhone: '0616748271',
  createdAt: '2019-11-19T13:13:41Z',
  address: {
    id: 'KJHUIZHJK',
    streetName: 'Ungererstrasse',
    number: '110',
    zipCode: '80805',
    city: 'Munich',
    country: 'Germany',
  },
});
