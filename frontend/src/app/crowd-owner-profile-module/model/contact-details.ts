export interface ContactDetails {
  name: string;
  emailAddress: string;
  phoneNumber: string;
}

export const emptyContactDetails = (): ContactDetails => ({
  emailAddress:  null,
  name: null,
  phoneNumber: null,
});

export const exampleContactDetails = (): ContactDetails => ({
  emailAddress:  'test@test.de',
  name: 'John Doe',
  phoneNumber: '004987268817',
});
