export interface Tag {
  id: string;
  externalId: string;
  sharedForPartners: boolean;
  name: string;
  description: string;
}

export const exampleTag = (): Tag => ({
  id: 'UYHJD6767HHJA',
  externalId: 'TAG12345',
  sharedForPartners: true,
  name: 'Commodo Mollis',
  description: 'Donec ullamcorper nulla non metus auctor fringilla.',
});
