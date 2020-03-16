import { NgModule } from '@angular/core';
import { TechniciansListComponent } from './components/technicians-list/technicians-list.component';
import { TechniciansListMaterialModule } from './technicians-list-material.module';
import { translateModule } from '../utils/translate.module';
import { StoreModule } from '@ngrx/store';
import * as fromTechnicians from './state/technicians.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TechniciansEffects } from './state/technicians.effects';
import { TechnicianService } from './services/technicians.service';
import { CommonModule } from '@angular/common';
import { FakeDataModule } from '../fake-data-module/fake-data.module';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RemovalConfirmationDialogComponent } from './components/removal-confirmation-dialog/removal-confirmation-dialog.component';

@NgModule({
  declarations: [
    TechniciansListComponent,
    RemovalConfirmationDialogComponent,
  ],
  entryComponents: [
    RemovalConfirmationDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    FakeDataModule,
    TechniciansListMaterialModule,
    translateModule,
    StoreModule.forFeature(fromTechnicians.techniciansFeatureKey, fromTechnicians.reducer),
    EffectsModule.forFeature([TechniciansEffects]),
  ],
  exports: [
    TechniciansListComponent,
  ],
  providers: [
    TechnicianService,
  ],
})
export class TechniciansListModule {
}
