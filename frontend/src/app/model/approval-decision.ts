import { ApprovalStatus } from './approval-status';

export interface ApprovalDecision {
  approvalStatus: ApprovalStatus | null;
  reason: string | null;
}

export const emptyApprovalDecision = (): ApprovalDecision => ({
  reason: null,
  approvalStatus: null,
});

export const exampleApprovalDecision = (approvalStatus: ApprovalStatus = 'PENDING'): ApprovalDecision => ({
  reason: 'Because.',
  approvalStatus
});
