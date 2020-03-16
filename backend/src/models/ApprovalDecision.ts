import { ApprovalStatus } from '../types/ApprovalStatus';
import { SchemaWithReferences } from '../types/SchemaWithReferences';

export interface ApprovalDecision {
  approvalStatus: ApprovalStatus | null;
  reason: string | null;
}

export const emptyApprovalDecision = (): ApprovalDecision => ({
  reason: null,
  approvalStatus: null,
});

export const approvalDecisionSchema: SchemaWithReferences = {
  schema: {
    id: '/ApprovalDecision',
    type: 'object',
    additionalProperties: false,
    properties: {
      approvalStatus: {
        type: ['string', 'null'],
        enum: ['PENDING', 'APPROVED', 'DECLINED', null]
      },
      reason: {type: ['string', 'null']},
    },
    required: ['approvalStatus', 'reason'],
  },
};
