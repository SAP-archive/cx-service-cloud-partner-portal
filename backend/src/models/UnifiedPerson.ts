export interface UnifiedPerson {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly createDateTime: string;
  readonly emailAddress: string;
  readonly officePhone: string;
}

export const exampleUnifiedPerson = () => ({
  id: '1',
  firstName: 'Tester',
  lastName: 'SAP',
  createDateTime: '01-01-2020',
  emailAddress: 'tester@sap.com',
  officePhone: '+00123456',
});
