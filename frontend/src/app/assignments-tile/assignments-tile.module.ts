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
import { RouterModule } from '@angular/router';
import { TruncateNumberPipeModule } from '../truncate-number-pipe-module/abbreviate-pipe.module';

@NgModule({
  declarations: [
    AssignmentsTileComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    StoreModule.forFeature(fromAssignmentsTile.assignmentsTileFeatureKey, fromAssignmentsTile.reducer),
    EffectsModule.forFeature([AssignmentsTileEffects]),
    TranslateModule,
    MatCardModule,
    TruncateNumberPipeModule,
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
