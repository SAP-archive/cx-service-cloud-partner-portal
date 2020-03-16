export interface Skill {
  uuid: string;
  externalId: string;
  technicianExternalId: string;
  tagName: string;
  tagExternalId: string;
  approvalDecision: any;
  expiredAt: string;
  startedAt: string;
  certificate: object;
  viewModelId?: string;
}

export const exampleSkill = (tagExternalId: string = 'TAG123'): Skill => ({
  uuid: 'e5d8c473-3056-414f-92b2-40f94cd865e5',
  externalId: 'FKHSAHDUIZR1232',
  tagExternalId,
  tagName: `Nibh Purus ${tagExternalId}`,
  technicianExternalId: 'LKJFUZ1233KJH',
  startedAt: '2019-11-19T13:13:41Z',
  expiredAt: '2020-11-19T13:13:41Z',
  approvalDecision: {
    approvalStatus: 'PENDING',
    reason: 'Dunno',
  },
  certificate: {},
});
