export interface Tag {
  id: string;
  externalId: string;
  name: string;
  description: string;
  sharedForPartners: boolean;
}

export const exampleTag = (externalId: string = '11'): Tag => ({
  id: 'FKJHDJHFJKHDF123451KJASD',
  externalId,
  name: `Nibh Purus ${externalId}`,
  description: 'Maecenas sed diam eget risus varius blandit sit amet non magna.',
  sharedForPartners: true,
});

export const emptyTag = (): Tag => ({
  id: '',
  externalId: '',
  name: ``,
  description: '',
  sharedForPartners: true,
});
