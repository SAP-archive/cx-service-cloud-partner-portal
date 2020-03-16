import { ApprovalDecision } from '../../../models/ApprovalDecision';

export interface DocumentDto {
  readonly id: string;
  readonly attachmentId: string;
  readonly name: string;
  readonly description: string;
  readonly state: 'NEW' | 'READ';
  readonly validFrom: string;
  readonly validTo: string;
  readonly approvalDecision: ApprovalDecision;
  readonly objectType: {
    objectId: string,
    objectType: 'BUSINESSPARTNER'
  };
}
