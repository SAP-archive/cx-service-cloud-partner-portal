import { ApprovalDecision } from './ApprovalDecision';

export interface Document {
  id: string;
  attachmentId: string;
  name: string;
  state: 'NEW' | 'READ';
  validFrom: string;
  validTo: string;
  approvalDecision: ApprovalDecision;
}

export const exampleDocument = (id: string = '123'): Document => ({
  id,
  name: 'filename.jpg',
  attachmentId: '456',
  state: 'NEW',
  validFrom: '2019-10-16',
  validTo: '2019-12-31',
  approvalDecision: {
    approvalStatus: 'PENDING',
    reason: '',
  },
});
