import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechniciansSelectorComponent } from './components/technicians-selector/technicians-selector.component';
import { AssignmentsListMaterialModule } from './assignments-list-material.module';
import { TranslateModule } from '@ngx-translate/core';
import { StoreModule } from '@ngrx/store';
import * as fromAssignments from './state/assignments-list.reducer';
import * as fromAssignmentsDetails from './state/assignments-details/assignments-details.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AssignmentsListEffects } from './state/assignments-list.effects';
import { AssignmentsDetailsEffects } from './state/assignments-details/assignments-details.effects';
import { TechniciansListService } from './services/technicians-list.service';
import { AssignmentsListService } from './services/assignments-list.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { CsDateTimePickerModule } from '../date-time-picker-module/date-time-picker.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssignmentsBoardComponent } from './components/assignments-board/assignments-board.component';
import { AssignmentsBoardTileComponent } from './components/assignments-board-tile/assignments-board-tile.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AssignmentsBoardColumnComponent } from './components/assignments-board-column/assignments-board-column.component';
import { AssignmentsDetailsComponent } from './components/assignments-details/assignments-details.component';
import { FakeDataModule } from '../fake-data-module/fake-data.module';
import { AssignmentsBoardTileActionsComponent } from './components/assignments-board-tile-actions/assignments-board-tile-actions.component';
import { AvatarModule } from '../avatar/avatar.module';
import { AbbreviatePipeModule } from '../abbreviate-pipe-module/abbreviate-pipe.module';
import { AssignmentsBoardFakeTileComponent } from './components/assignments-board-fake-tile/assignments-board-fake-tile.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LocalDateTimePipeModule } from '../local-date-time-pipe-module';
import { ConfirmDialogComponent } from '../components/confirmatiom-popover/confirm-dialog.component';

@NgModule({
  declarations: [
    TechniciansSelectorComponent,
    AssignmentsBoardComponent,
    AssignmentsBoardTileComponent,
    AssignmentsBoardColumnComponent,
    AssignmentsDetailsComponent,
    AssignmentsBoardTileActionsComponent,
    AssignmentsBoardFakeTileComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    AssignmentsListMaterialModule,
    TranslateModule,
    StoreModule.forFeature(fromAssignments.assignmentsListFeatureKey, fromAssignments.reducer),
    StoreModule.forFeature(fromAssignmentsDetails.assignmentsDetailsFeatureKey, fromAssignmentsDetails.reducer),
    EffectsModule.forFeature([AssignmentsListEffects, AssignmentsDetailsEffects]),
    InfiniteScrollModule,
    CsDateTimePickerModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    FakeDataModule,
    AvatarModule,
    AbbreviatePipeModule,
    DragDropModule,
    LocalDateTimePipeModule,
  ],
  providers: [
    AssignmentsListService,
    DeviceDetectorService,
    TechniciansListService,
  ],
  entryComponents: [
    ConfirmDialogComponent
  ],
})
export class AssignmentsListModule {
}
