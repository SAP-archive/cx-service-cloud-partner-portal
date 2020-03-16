import { NgModule } from '@angular/core';
import { MatSelectModule, MatSnackBarModule, MatCardModule, MatDividerModule } from '@angular/material';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

const modules = [
  MatSnackBarModule,
  MatSelectModule,
  MatButtonModule,
  MatCardModule,
  MatDividerModule,
  MatDialogModule
];

@NgModule({
  imports: [modules],
  exports: [modules],
})
export class PartnerPortalMaterialModule {
}
