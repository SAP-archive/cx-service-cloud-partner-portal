export interface Technician {
  externalId: string;
  skills: any[];
  email: string;
  firstName: string;
  lastName: string;
  businessPartner: string;
  mobilePhone: string;
  address?: any;
  serviceArea?: any;
  createdAt: string;
  inactive?: boolean;
}

export const exampleTechnician = (externalId = '123213123213'): Technician => ({
  externalId,
  email: 'asdasdsad@asd.de',
  firstName: 'John',
  lastName: 'Doe',
  mobilePhone: '12345',
  skills: [],
  businessPartner: 'ASDGSDA',
  createdAt: '2019-11-19T13:13:41Z',
});

export const emptyTechnician = (externalId = ''): Technician => ({
  externalId,
  email: '',
  firstName: '',
  lastName: '',
  mobilePhone: '',
  skills: [],
  businessPartner: '',
  createdAt: '',
});
