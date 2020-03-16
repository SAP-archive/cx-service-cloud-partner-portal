export interface SkillDto {
  uuid: string;
  externalId: string;
  technicianExternalId: string;
  tagName: string;
  tagExternalId: string;
  approvalDecision: {
      approvalStatus: 'PENDING';
      reason: string;
  };
  expiredAt: string;
  startedAt: string;
  certificate: any;
}
