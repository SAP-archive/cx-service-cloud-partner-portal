import { Skill } from './Skill';
import { Address } from './Address';
import { CrowdServiceResponse } from '../services/CrowdServiceApi';
import { CrowdType } from './CrowdType';

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
  readonly inactive: boolean;
  readonly crowdType: CrowdType;
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
  inactive: false,
  address: {
    id: 'KJHUIZHJK',
    streetName: 'Ungererstrasse',
    number: '110',
    zipCode: '80805',
    city: 'Munich',
    country: 'Germany',
  },
  crowdType: 'PARTNER_TECHNICIAN'
});

export const exampleTechnicianSearchResult = (): CrowdServiceResponse<TechnicianDto> => ({
  results: [exampleTechnicianDto()],
  numberOfElements: 1,
  size: 1,
  totalElements: 1,
  totalPages: 1,
  first: true,
  last: true
});
