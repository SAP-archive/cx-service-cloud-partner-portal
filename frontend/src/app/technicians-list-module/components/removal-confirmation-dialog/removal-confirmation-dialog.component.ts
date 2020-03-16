import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'pp-removal-confirmation-dialog',
  templateUrl: './removal-confirmation-dialog.component.html',
  styleUrls: ['./removal-confirmation-dialog.component.css'],
})
export class RemovalConfirmationDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public technicianName: string) {
  }
}
