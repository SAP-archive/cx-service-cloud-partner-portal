import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootState } from '../../state';
import { selectAuthUserData, selectCompanyName, selectIsBusy, selectIsLoggedIn, selectRedirectTo } from './auth.selectors';
import * as AuthActions from './auth.actions';
import { Credentials } from '../model/credentials.model';
import { CrowdOwnerProfileModule } from 'src/app/crowd-owner-profile-module/crowd-owner-profile.module';

@Injectable({providedIn: 'root'})
export class AuthFacade {
  public isBusy = this.store.select(selectIsBusy);
  public isLoggedIn = this.store.select(selectIsLoggedIn);
  public authUserData = this.store.select(selectAuthUserData);
  public redirectTo = this.store.select(selectRedirectTo);
  public companyName = this.store.select(selectCompanyName);

  constructor(private store: Store<RootState>) {
  }

  public login(credentials: Credentials) {
    this.store.dispatch(AuthActions.login({credentials}));
  }

  public setRedirectTo(route: string) {
    this.store.dispatch(AuthActions.setRedirectTo({route}));
  }

  public changePassword(newPassword: string) {
    this.store.dispatch(AuthActions.changePassword({newPassword}));
  }

  public logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
