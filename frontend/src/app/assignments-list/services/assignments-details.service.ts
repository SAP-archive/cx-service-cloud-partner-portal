import { Injectable } from '@angular/core';
import { DetailsDisplayMode } from '../model/details-display-mode';
import { AssignmentsDetailsComponent } from '../components/assignments-details/assignments-details.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { AssignmentsDetailsFacade } from '../state/assignments-details/assignments-details.facade';

@Injectable()
export class AssignmentsDetailsService {
  constructor(
    private deviceDetectorService: DeviceDetectorService,
    private bottomSheetService: MatBottomSheet,
    private dialogService: MatDialog,
    private assignmentsDetailsFacade: AssignmentsDetailsFacade,
  ) {
  }

  public openDetails() {
    const displayMode: DetailsDisplayMode = this.deviceDetectorService.isMobile() ? 'mobile' : 'web';
    this.assignmentsDetailsFacade.setDisplayMode(displayMode);
    if (displayMode === 'web') {
      this.dialogService.open(
        AssignmentsDetailsComponent,
        {
          width: '500px',
          height: 'fit-content',
          maxHeight: '90vh',
          maxWidth: '90vw',
        });
    } else {
      this.bottomSheetService.open(AssignmentsDetailsComponent);
    }
  }
}
