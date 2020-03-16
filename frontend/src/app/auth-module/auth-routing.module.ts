import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { AccountComponent } from './components/account/account.component';
import { LoginComponent } from './components/login/login.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { LogoutComponent } from './components/logout/logout.component';

const routes: Routes = [
  {
    path: 'login',
    component: AuthComponent,
    children: [
      {
        path: '',
        component: AccountComponent,
      },
      {
        path: 'account/:accountName',
        component: LoginComponent,
      },
      {
        path: 'change-password',
        component: ChangePasswordComponent,
      },
    ],
  },
  {
    path: 'logout',
    component: LogoutComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
