import { ApprovalDecision } from 'src/app/model/approval-decision';
import { SkillCertificate } from './skill-certificate.model';

export interface Skill {
  uuid?: string;
  tagExternalId: string;
  expiredAt?: string;
  externalId?: string;
  startedAt?: string;
  tagName?: string;
  technicianExternalId: string;
  approvalDecision?: ApprovalDecision;
  certificate?: SkillCertificate;
}

export type SkillWithViewModelId = Skill & { viewModelId: string };

export const exampleSkill = (tagExternalId: string = '12'): Skill => ({
  uuid: 'SKILL123',
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
  certificate: {
    id: '09f06634-7a6e-4be7-84e4-983c060cc899',
    externalId: 'BD9A0FAEAC444EC196521B0C931454A3',
    fileName: 'dummy_file.pdf',
  },
});
