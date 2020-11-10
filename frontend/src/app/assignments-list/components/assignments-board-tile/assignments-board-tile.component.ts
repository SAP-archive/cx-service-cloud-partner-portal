import { Component, Input } from '@angular/core';
import { Assignment } from '../../model/assignment';
import { MatDialog } from '@angular/material/dialog';
import { AssignmentsDetailsComponent } from '../assignments-details/assignments-details.component';
import { AssignmentsDetailsFacade } from '../../state/assignments-details/assignments-details.facade';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DetailsDisplayMode } from '../../model/details-display-mode';

@Component({
  selector: 'pp-assignments-board-tile',
  templateUrl: './assignments-board-tile.component.html',
  styleUrls: ['./assignments-board-tile.component.scss'],
})
export class AssignmentsBoardTileComponent {
  @Input() public assignment: Assignment;

  constructor(
    private dialogService: MatDialog,
    private assignmentsDetailsFacade: AssignmentsDetailsFacade,
    private bottomSheetService: MatBottomSheet,
    private deviceDetectorService: DeviceDetectorService ) { }

  public openDetails() {
    if (this.shouldOpenDialog()) {
      this.assignmentsDetailsFacade.setCurrentAssignment(this.assignment);
      const displayMode: DetailsDisplayMode = this.deviceDetectorService.isMobile() ? 'mobile' : 'web';
      this.assignmentsDetailsFacade.setDisplayMode(displayMode);
      displayMode === 'web' ? this.dialogService.open(AssignmentsDetailsComponent, {
        width: '500px',
        height: '650px',
        maxHeight: '90vh',
        maxWidth: '90vw',
      }) : this.bottomSheetService.open(AssignmentsDetailsComponent);
    }
  }

  public shouldOpenDialog(): boolean {
    return this.assignment.partnerDispatchingStatus === 'ACCEPTED'
      && this.assignment.serviceAssignmentState === 'ASSIGNED';
  }
}
