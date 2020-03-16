import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApprovalDecisionStatusComponent } from './approval-decision-status.component';
import { MatChipsModule } from '@angular/material/chips';
import { translateModule } from '../utils/translate.module';

@NgModule({
  imports: [
    CommonModule,
    MatChipsModule,
    translateModule,
  ],
  declarations: [
    ApprovalDecisionStatusComponent,
  ],
  exports: [
    ApprovalDecisionStatusComponent,
  ],
})
export class ApprovalDecisionStatusModule {
}
