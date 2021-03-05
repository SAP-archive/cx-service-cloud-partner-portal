import { Component, Input, OnChanges } from '@angular/core';
import { Assignment } from '../../model/assignment';
import { AssignmentsListFacade } from '../../state/assignments-list.facade';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../components/confirmatiom-popover/confirm-dialog.component';
import { filter } from 'rxjs/operators';
import { AssignmentsDetailsFacade } from '../../state/assignments-details/assignments-details.facade';
import { ConfigFacade } from '../../../state/config/config.facade';

@Component({
  selector: 'pp-assignments-board-tile-actions',
  templateUrl: './assignments-board-tile-actions.component.html',
  styleUrls: ['./assignments-board-tile-actions.component.scss'],
})
export class AssignmentsBoardTileActionsComponent implements OnChanges {
  @Input() public assignment: Assignment;
  @Input() public isFake: boolean;
  public technicianName: string;
  public allowHandover = this.configFacade.allowAssignmentHandover;
  public allowAssignmentReject = this.configFacade.allowAssignmentReject;
  public allowAssignmentClose = this.configFacade.allowAssignmentClose;

  constructor(
    private assignmentsListFacade: AssignmentsListFacade,
    private dialog: MatDialog,
    private assignmentsDetailsFacade: AssignmentsDetailsFacade,
    private configFacade: ConfigFacade,
  ) {
  }

  public ngOnChanges(): void {
    if (this.assignment && this.assignment.responsiblePerson) {
      this.technicianName = (this.assignment.responsiblePerson.firstName + ' ' + this.assignment.responsiblePerson.lastName).trim();
    }
  }

  public acceptAssignment(): void {
    this.openReminder(this.assignment,
      this.assignmentsListFacade.accept.bind(this.assignmentsListFacade));
  }

  public rejectAssignment(): void {
    this.assignmentsListFacade.reject(this.assignment);
  }

  public closeAssignment(): void {
    this.openReminder(
      this.assignment,
      this.assignmentsListFacade.close.bind(this.assignmentsListFacade),
    );
  }

  public handoverAssignment(): void {
    this.assignmentsDetailsFacade.showAssignment(this.assignment);
  }

  public isSyncStatusBlocked() {
    return this.assignment.syncStatus === 'BLOCKED';
  }

  private openReminder(assignment: Assignment, confirmCallback: Function) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'ASSIGNMENTS_BOARD_TILE_CONFIRM_REMINDER',
      },
    }).afterClosed()
      .pipe(filter((result) => result === true))
      .subscribe(() => {
        confirmCallback(assignment);
      });
  }
}
