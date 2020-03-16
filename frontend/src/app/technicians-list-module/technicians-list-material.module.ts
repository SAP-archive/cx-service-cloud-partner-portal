import { NgModule } from '@angular/core';
import { MatCardModule, MatDividerModule, MatIconModule, MatProgressSpinnerModule } from '@angular/material';
import { AbbreviatePipeModule } from '../abbreviate-pipe-module/abbreviate-pipe.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  exports: [
    MatCardModule,
    MatDividerModule,
    AbbreviatePipeModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
})
export class TechniciansListMaterialModule {
}
