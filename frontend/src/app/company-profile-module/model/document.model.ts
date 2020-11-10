import { ApprovalDecision } from '../../model/approval-decision';

export interface Document {
  id: string | null;
  attachmentId: string | null;
  name: string | null;
  state: 'NEW' | 'READ' | null;
  validFrom: string | null;
  validTo: string | null;
  approvalDecision: ApprovalDecision;
  description: string;
}

export const exampleDocument = (id: string = '123'): Document => ({
  id,
  name: 'filename.jpg',
  description: 'filename',
  attachmentId: '456',
  state: 'NEW',
  validFrom: '2019-10-16',
  validTo: '2019-12-31',
  approvalDecision: {
    approvalStatus: 'PENDING',
    reason: '',
  },
});
