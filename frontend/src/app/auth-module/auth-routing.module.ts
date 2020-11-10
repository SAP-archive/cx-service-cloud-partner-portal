import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './components/auth/auth.component';
import { AccountComponent } from './components/account/account.component';
import { LoginComponent } from './components/login/login.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ResetPasswordAccountComponent } from './components/reset-password/account/reset-password.account.component';
import { ResetPasswordConfirmEmailComponent } from './components/reset-password/confirm-email/reset-password.confirm-email.component';
import { ResetPasswordVerifyCodeComponent } from './components/reset-password/verify-code/reset-password.verify-code.component';
import { ResetPasswordNewPasswordComponent } from './components/reset-password/new-password/reset-password.new-password.component';
import { ResetPasswordHasEmailGuard } from './services/guards/has-email.guard';
import { ResetPasswordHasVerificationCodeGuard } from './services/guards/has-verification-code.guard';
import { ResetPasswordResendCodeComponent } from './components/reset-password/resend-code/reset-password.resend-code.component';

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
      {
        path: 'resetPassword',
        children: [
          {
            path: 'account',
            component: ResetPasswordAccountComponent
          },
          {
            path: 'confirmEmail',
            component: ResetPasswordConfirmEmailComponent
          },
          {
            path: 'verifyCode',
            component: ResetPasswordVerifyCodeComponent,
            canActivate: [
              ResetPasswordHasEmailGuard
            ]
          },
          {
            path: 'resendCode',
            component: ResetPasswordResendCodeComponent,
            canActivate: [
              ResetPasswordHasEmailGuard
            ]
          },
          {
            path: 'newPassword',
            component: ResetPasswordNewPasswordComponent,
            canActivate: [
              ResetPasswordHasEmailGuard,
              ResetPasswordHasVerificationCodeGuard
            ]
          },
        ]
      }
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
