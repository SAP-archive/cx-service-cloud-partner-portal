export interface PartnerContact {
  emailAddress: string;
  firstName: string;
  id: string;
  lastName: string;
  officePhone: string;
}

export const examplePartnerContact = () => ({
  emailAddress: 'example@test.com',
  firstName: 'First',
  id: '1',
  lastName: 'Last',
  officePhone: '123456'
});
