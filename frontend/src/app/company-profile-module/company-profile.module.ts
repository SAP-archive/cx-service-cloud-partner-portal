import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyProfileTileComponent } from './components/company-profile-tile/company-profile-tile.component';
import { CompanyProfileMaterialModule } from './company-profile-material.module';
import { translateModule } from '../utils/translate.module';
import { AbbreviatePipeModule } from '../abbreviate-pipe-module/abbreviate-pipe.module';
import { StoreModule } from '@ngrx/store';
import * as fromCompanyProfile from './state/company-profile.reducer';
import * as fromNewDocuments from './state/new-documents/new-documents.reducer';
import * as fromRemovedDocuments from './state/removed-documents/removed-documents.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CompanyProfileEffects } from './state/company-profile.effects';
import { FakeDataModule } from '../fake-data-module/fake-data.module';
import { CompanyProfileEditorComponent } from './components/company-profile-editor/company-profile-editor.component';
import { AvatarModule } from '../avatar/avatar.module';
import { ReactiveFormsModule } from '@angular/forms';
import { DocumentsListComponent } from './components/documents-list/documents-list.component';
import { saveAsInjectionToken } from './injection-tokens';
import { saveAs } from 'file-saver';
import { ApprovalDecisionStatusModule } from '../approval-decision-status-module/approval-decision-status.module';
import { FileUploaderModule } from '../file-uploader/file-uploader.module';
import { companyProfileFeatureKey } from './state/feature.selectors';
import { ServiceAreaModule } from '../service-area-module/service-area.module';
import { CompanyProfileService } from './services/company-profile.service';
import { NewDocumentsFacade } from './state/new-documents/new-documents.facade';
import { RemovedDocumentsFacade } from './state/removed-documents/removed-documents.facade';
import { CompanyProfileFacade } from './state/company-profile.facade';
import { CompanyProfileResolver } from './services/company-profile.resolver';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { CompanySettingsResolver } from '../services/company-settings.resolver';

@NgModule({
  declarations: [
    CompanyProfileTileComponent,
    CompanyProfileEditorComponent,
    DocumentsListComponent,
  ],
  imports: [
    CommonModule,
    CompanyProfileMaterialModule,
    translateModule,
    AbbreviatePipeModule,
    FakeDataModule,
    StoreModule.forFeature(companyProfileFeatureKey, {
      companyDetails: fromCompanyProfile.reducer,
      newDocuments: fromNewDocuments.reducer,
      removedDocuments: fromRemovedDocuments.reducer,
    }),
    EffectsModule.forFeature([CompanyProfileEffects]),
    AvatarModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    ApprovalDecisionStatusModule,
    FileUploaderModule,
    ServiceAreaModule,
  ],
  providers: [
    {provide: saveAsInjectionToken, useValue: saveAs},
    CompanyProfileService,
    NewDocumentsFacade,
    RemovedDocumentsFacade,
    CompanyProfileFacade,
    CompanyProfileResolver,
    CompanySettingsResolver,
  ],
  exports: [
    CompanyProfileTileComponent,
    CompanyProfileEditorComponent,
  ],
})
export class CompanyProfileModule {
}
