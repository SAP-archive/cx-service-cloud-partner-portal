import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TechnicianDetailsEditorComponent } from './components/technician-details-editor/technician-details-editor.component';
import { TechnicianDetailsMaterialModule } from './technician-details-material.module';
import { StoreModule } from '@ngrx/store';
import * as fromTechnicianProfile from './state/technician-profile.reducer';
import { EffectsModule } from '@ngrx/effects';
import { TechnicianProfileEffects } from './state/technician-profile.effects';
import { TechnicianProfileService } from './services/technician-profile.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AbbreviatePipeModule } from '../abbreviate-pipe-module/abbreviate-pipe.module';
import { SkillsCardComponent } from './components/skills-card/skills-card.component';
import { TagService } from './services/tag.service';
import { ApprovalDecisionStatusModule } from '../approval-decision-status-module/approval-decision-status.module';
import { saveAsInjectionToken } from './injection-tokens';
import { saveAs } from 'file-saver';
import { FileUploaderModule } from '../file-uploader/file-uploader.module';

@NgModule({
  imports: [
    ApprovalDecisionStatusModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TechnicianDetailsMaterialModule,
    TranslateModule,
    AbbreviatePipeModule,
    FileUploaderModule,
    StoreModule.forFeature(fromTechnicianProfile.technicianProfileFeatureKey, fromTechnicianProfile.reducer),
    EffectsModule.forFeature([TechnicianProfileEffects]),
  ],
  exports: [
    TechnicianDetailsEditorComponent,
  ],
  declarations: [
    TechnicianDetailsEditorComponent,
    SkillsCardComponent,
  ],
  providers: [
    TechnicianProfileService,
    TagService,
    {
      provide: saveAsInjectionToken,
      useValue: saveAs,
    },
  ]
})
export class TechnicianDetailsModule { }
