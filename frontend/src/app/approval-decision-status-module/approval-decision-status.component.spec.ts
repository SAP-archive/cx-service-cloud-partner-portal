import { ApprovalDecisionStatusComponent } from './approval-decision-status.component';
import { exampleApprovalDecision } from '../model/approval-decision';

describe('ApprovalStatusComponent', () => {
  describe('ngOnChanges()', () => {
    it('should set badge title based on provided approval status', () => {
      const component = new ApprovalDecisionStatusComponent();

      component.approvalDecision = exampleApprovalDecision('PENDING');
      component.ngOnChanges(null);
      expect(component.badgeTitle).toEqual('STATUS_PENDING');

      component.approvalDecision = exampleApprovalDecision('APPROVED');
      component.ngOnChanges(null);
      expect(component.badgeTitle).toEqual('STATUS_APPROVED');

      component.approvalDecision = exampleApprovalDecision('DECLINED');
      component.ngOnChanges(null);
      expect(component.badgeTitle).toEqual('STATUS_DECLINED');

      component.approvalDecision = exampleApprovalDecision(null);
      component.ngOnChanges(null);
      expect(component.badgeTitle).toEqual('STATUS_UNSAVED');
    });
  });
});
