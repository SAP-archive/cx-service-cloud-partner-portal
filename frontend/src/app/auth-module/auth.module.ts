import { NgModule } from '@angular/core';
import { AuthComponent } from './components/auth/auth.component';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthGuard } from './services/guards/auth.guard';
import { AuthMaterialModule } from './auth-material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccountComponent } from './components/account/account.component';
import { LoginComponent } from './components/login/login.component';
import { StoreModule } from '@ngrx/store';
import * as fromAuth from './state/auth.reducer';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './state/auth.effects';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AuthFacade } from './state/auth.facade';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { LogoutComponent } from './components/logout/logout.component';

@NgModule({
  imports: [
    CommonModule,
    AuthRoutingModule,
    AuthMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    StoreModule.forFeature(fromAuth.authFeatureKey, fromAuth.reducer),
    EffectsModule.forFeature([AuthEffects]),
    TranslateModule,
  ],
  declarations: [
    AuthComponent,
    AccountComponent,
    LoginComponent,
    ChangePasswordComponent,
    LogoutComponent,
  ],
  entryComponents: [
    AuthComponent,
    AccountComponent,
    LoginComponent,
    ChangePasswordComponent,
  ],
  providers: [
    AuthGuard,
    AuthFacade,
  ],
})
export class AuthModule {
}
