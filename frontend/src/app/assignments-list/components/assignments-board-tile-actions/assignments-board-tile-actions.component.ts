import { Component, Input, OnChanges } from '@angular/core';
import { Assignment } from '../../model/assignment';
import { AssignmentsListFacade } from '../../state/assignments-list.facade';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../components/confirmatiom-popover/confirm-dialog.component';

@Component({
  selector: 'pp-assignments-board-tile-actions',
  templateUrl: './assignments-board-tile-actions.component.html',
  styleUrls: ['./assignments-board-tile-actions.component.scss'],
})
export class AssignmentsBoardTileActionsComponent implements OnChanges {
  @Input() public assignment: Assignment;
  @Input() public isFake: boolean;
  public technicianName: string;

  constructor(
    private assignmentsListFacade: AssignmentsListFacade,
    private dialog: MatDialog) { }

  public ngOnChanges(): void {
    if (this.assignment && this.assignment.responsiblePerson) {
      this.technicianName = (this.assignment.responsiblePerson.firstName + ' ' + this.assignment.responsiblePerson.lastName).trim();
    }
  }

  public acceptAssignment(): void {
    this.assignmentsListFacade.accept(this.assignment);
  }

  public rejectAssignment(): void {
    this.assignmentsListFacade.reject(this.assignment);
  }

  public closeAssignment(): void {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'ASSIGNMENTS_BOARD_TILE_CONFIRM_REMINDER'
      }
    });
    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.assignmentsListFacade.close(this.assignment);
      }
    });
  }
}
