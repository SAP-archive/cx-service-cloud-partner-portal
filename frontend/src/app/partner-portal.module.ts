import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { PartnerPortalComponent } from './components/partner-portal/partner-portal.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppBackendHttpInterceptor } from './app-backend-http.interceptor';
import { EffectsModule } from '@ngrx/effects';
import { PartnerPortalRoutingModule } from './partner-portal-routing.module';
import { LocalisationSelectorComponent } from './components/localisation-selector/localisation-selector.component';
import { WebStorageModule } from 'ngx-store';
import { effects } from './state/effects';
import { ngrxStoreModules } from './utils/get-ngrx-store-modules';
import { translateModule } from './utils/translate.module';
import { PageNotFoundComponentComponent } from './components/page-not-found-component/page-not-found-component.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UnifiedPersonService } from './services/unified-person.service';
import { AuthModule } from './auth-module/auth.module';
import { PartnerPortalMaterialModule } from './partner-portal-material.module';
import { UserCockpitComponent } from './components/user-cockpit/user-cockpit.component';
import { CompanyProfileModule } from './company-profile-module/company-profile.module';
import { AbbreviatePipeModule } from './abbreviate-pipe-module/abbreviate-pipe.module';
import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { TechniciansListModule } from './technicians-list-module/technicians-list.module';
import { TechnicianDetailsModule } from './technician-details-module/technician-details.module';
import { CrowdOwnerProfileModule } from './crowd-owner-profile-module/crowd-owner-profile.module';
import { UnsavedConfirmationDialogComponent } from './components/unsaved-confirmation-dialog/unsaved-confirmation-dialog.component';
import { TerminateAletDialogComponent } from './components/user-cockpit/terminateDialog/terminate-alert-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { AssignmentsListModule } from './assignments-list/assignments-list.module';
import { AssignmentsTileModule } from './assignments-tile/assignments-tile.module';
import { LocalDateTimePipeModule } from './local-date-time-pipe-module';
import { CompanySettingsService } from './services/company-settings.service';

@NgModule({
  declarations: [
    PartnerPortalComponent,
    DashboardComponent,
    LocalisationSelectorComponent,
    PageNotFoundComponentComponent,
    UserCockpitComponent,
    BreadcrumbsComponent,
    UnsavedConfirmationDialogComponent,
    TerminateAletDialogComponent
  ],
  imports: [
    AuthModule,
    PartnerPortalRoutingModule,
    ...ngrxStoreModules,
    EffectsModule.forRoot(effects),
    translateModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    PartnerPortalRoutingModule,
    WebStorageModule,
    ReactiveFormsModule,
    PartnerPortalMaterialModule,
    CompanyProfileModule,
    AbbreviatePipeModule,
    TechniciansListModule,
    TechnicianDetailsModule,
    CrowdOwnerProfileModule,
    MatIconModule,
    AssignmentsListModule,
    AssignmentsTileModule,
    LocalDateTimePipeModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppBackendHttpInterceptor,
      multi: true,
    },
    UnifiedPersonService,
    CompanySettingsService,
  ],
  entryComponents: [
    UnsavedConfirmationDialogComponent,
    TerminateAletDialogComponent
  ],
  bootstrap: [PartnerPortalComponent],
})
export class PartnerPortalModule {
}
