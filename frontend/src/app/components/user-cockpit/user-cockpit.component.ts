import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TerminateAletDialogComponent } from './terminateDialog/terminate-alert-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CompanyProfileFacade } from '../../company-profile-module/state/company-profile.facade';

@Component({
  selector: 'pp-user-cockpit',
  templateUrl: './user-cockpit.component.html',
  styleUrls: ['./user-cockpit.component.scss'],
})
export class UserCockpitComponent {
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private companyProfileFacade: CompanyProfileFacade) {
  }

  public logout() {
    this.router.navigateByUrl('/logout', { state: { needLogout: true }});
  }

  public openTerminateDialog(): void {
    const dialogRef = this.dialog.open(TerminateAletDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'confirm') {
        this.companyProfileFacade.terminateRelationship();
      }
    });
  }

}
