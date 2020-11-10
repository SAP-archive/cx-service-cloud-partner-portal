import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponentComponent } from './components/page-not-found-component/page-not-found-component.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './auth-module/services/guards/auth.guard';
import { UserCockpitComponent } from './components/user-cockpit/user-cockpit.component';
import { CompanyProfileResolver } from './company-profile-module/services/company-profile.resolver';
import { CompanyProfileEditorComponent } from './company-profile-module/components/company-profile-editor/company-profile-editor.component';
// tslint:disable-next-line: max-line-length
import { TechnicianDetailsEditorComponent, WorkingMode } from './technician-details-module/components/technician-details-editor/technician-details-editor.component';
import { UnsavedGuard } from './services/guard/unsaved.guard';
import { AssignmentsBoardComponent } from './assignments-list/components/assignments-board/assignments-board.component';

interface TechnicianEditorParameters {
  mode: WorkingMode;
}

const routes: Routes = [
  {
    path: '',
    component: UserCockpitComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DashboardComponent,
        resolve: {
          companyProfile: CompanyProfileResolver,
        },
      },
      {
        path: 'company-profile-editor',
        component: CompanyProfileEditorComponent,
        resolve: {
          companyProfile: CompanyProfileResolver,
        },
        canDeactivate: [UnsavedGuard],
      },
      {
        path: 'technician-details/:technicianId',
        component: TechnicianDetailsEditorComponent,
        data: {
          mode: 'EDIT',
        } as TechnicianEditorParameters,
        canDeactivate: [UnsavedGuard],
      },
      {
        path: 'add-technician',
        component: TechnicianDetailsEditorComponent,
        data: {
          mode: 'CREATE',
        } as TechnicianEditorParameters,
        canDeactivate: [UnsavedGuard],
      },
      {
        path: 'assignments',
        component: AssignmentsBoardComponent,
      },
    ],
  },
  {
    path: '**',
    component: PageNotFoundComponentComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class PartnerPortalRoutingModule {
}
