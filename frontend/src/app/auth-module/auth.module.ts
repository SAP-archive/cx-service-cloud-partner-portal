import { NgModule } from '@angular/core';
import { AuthComponent } from './components/auth/auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthGuard } from './services/guards/auth.guard';
import { AuthMaterialModule } from './auth-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountComponent } from './components/account/account.component';
import { LoginComponent } from './components/login/login.component';
import { StoreModule } from '@ngrx/store';
import * as fromAuth from './state/auth/auth.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './state/auth/auth.effects';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthFacade } from './state/auth/auth.facade';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ResetPasswordVerifyCodeComponent } from './components/reset-password/verify-code/reset-password.verify-code.component';
import { ResetPasswordResendCodeComponent } from './components/reset-password/resend-code/reset-password.resend-code.component';
import { ResetPasswordAccountComponent } from './components/reset-password/account/reset-password.account.component';
import { ResetPasswordConfirmEmailComponent } from './components/reset-password/confirm-email/reset-password.confirm-email.component';
import { ResetPasswordFacade } from './state/resetPassword/reset-password.facade';
import * as fromResetPassword from './state/resetPassword/reset-password.reducer';
import { ResetPasswordEffects } from './state/resetPassword/reset-password.effects';
import { authRootKey } from './feature.selectors';
import { ResetPasswordNewPasswordComponent } from './components/reset-password/new-password/reset-password.new-password.component';
import { ResetPasswordHasEmailGuard } from './services/guards/has-email.guard';
import { ResetPasswordHasMaskedEmailGuard } from './services/guards/has-masked-email.guard';
import { ResetPasswordHasVerificationCodeGuard } from './services/guards/has-verification-code.guard';
import { AuthService } from './services/auth.service';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    AuthMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature(authRootKey, {
      auth: fromAuth.reducer,
      resetPassword: fromResetPassword.reducer,
    }),
    EffectsModule.forFeature([AuthEffects, ResetPasswordEffects]),
    TranslateModule,
  ],
  declarations: [
    AuthComponent,
    AccountComponent,
    LoginComponent,
    ChangePasswordComponent,
    LogoutComponent,
    ResetPasswordResendCodeComponent,
    ResetPasswordAccountComponent,
    ResetPasswordConfirmEmailComponent,
    ResetPasswordVerifyCodeComponent,
    ResetPasswordNewPasswordComponent,

  ],
  providers: [
    AuthGuard,
    AuthFacade,
    ResetPasswordFacade,
    ResetPasswordHasEmailGuard,
    ResetPasswordHasMaskedEmailGuard,
    ResetPasswordHasVerificationCodeGuard,
    AuthService,
  ],
})
export class AuthModule {
}
