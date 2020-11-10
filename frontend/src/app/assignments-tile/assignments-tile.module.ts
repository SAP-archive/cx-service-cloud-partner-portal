import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AssignmentsTileService } from './services/assignments-tile.service';
import { StoreModule } from '@ngrx/store';
import * as fromAssignmentsTile from './state/assignments-tile.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AssignmentsTileEffects } from './state/assignments-tile.effects';
import { AssignmentsTileComponent } from './components/assignments-tile/assignments-tile.component';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { TruncateNumberPipe } from './pipes/truncate-number.pipe';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AssignmentsTileComponent,
    TruncateNumberPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    StoreModule.forFeature(fromAssignmentsTile.assignmentsTileFeatureKey, fromAssignmentsTile.reducer),
    EffectsModule.forFeature([AssignmentsTileEffects]),
    TranslateModule,
    MatCardModule,
  ],
  providers: [
    AssignmentsTileService,
  ],
  exports: [
    AssignmentsTileComponent,
  ],
})
export class AssignmentsTileModule {
}
