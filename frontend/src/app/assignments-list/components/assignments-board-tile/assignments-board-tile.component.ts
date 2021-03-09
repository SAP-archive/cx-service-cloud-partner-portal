import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Assignment } from '../../model/assignment';
import { AssignmentsDetailsFacade } from '../../state/assignments-details/assignments-details.facade';
import { isOngoing, isReadyToPlan } from '../../utils/assignments-columns-helper';

@Component({
  selector: 'pp-assignments-board-tile',
  templateUrl: './assignments-board-tile.component.html',
  styleUrls: ['./assignments-board-tile.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AssignmentsBoardTileComponent {
  @Input() public assignment: Assignment;

  constructor(
    private assignmentsDetailsFacade: AssignmentsDetailsFacade,
    ) {
  }

  public openDetails() {
    if (this.shouldOpenDialog()) {
      this.assignmentsDetailsFacade.showAssignment(this.assignment);
    }
  }

  public shouldOpenDialog(): boolean {
    return isReadyToPlan(this.assignment);
  }

  public getPriorityKey(): string {
    switch (this.assignment.priority && this.assignment.priority.toUpperCase()) {
      case 'HIGH':
        return 'ASSIGNMENT_PRIORITY_HIGH';
      case 'MEDIUM':
        return 'ASSIGNMENT_PRIORITY_MEDIUM';
      case 'LOW':
        return 'ASSIGNMENT_PRIORITY_LOW';
      default:
        return 'ASSIGNMENT_PRIORITY_UNKNOWN';
    }
  }

  public getPriorityClass(): string {
    switch (this.assignment.priority && this.assignment.priority.toUpperCase()) {
      case 'HIGH':
        return 'high';
      case 'MEDIUM':
        return 'medium';
      case 'LOW':
        return 'low';
      default:
        return 'unknown';
    }
  }

  public isOngoingStatus() {
    return isOngoing(this.assignment);
  }
}
