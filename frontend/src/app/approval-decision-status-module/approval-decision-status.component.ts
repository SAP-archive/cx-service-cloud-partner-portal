import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApprovalDecision } from '../model/approval-decision';

@Component({
  selector: 'pp-approval-decision-status',
  styleUrls: ['./approval-decision-status.component.scss'],
  templateUrl: './approval-decision-status.component.html',
})
export class ApprovalDecisionStatusComponent implements OnChanges {
  @Input() public approvalDecision: ApprovalDecision;
  public badgeTitle: string;

  public ngOnChanges(changes: SimpleChanges): void {
    this.badgeTitle = this.getBadgeTitle(this.approvalDecision);
  }

  private getBadgeTitle(approvalDecision: ApprovalDecision): string {
    if (!approvalDecision.approvalStatus) {
      return `STATUS_UNSAVED`;
    }
    return `STATUS_${approvalDecision.approvalStatus}`;
  }
}
