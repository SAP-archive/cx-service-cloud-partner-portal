import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AuthActions from './auth.actions';
import * as ReportingActions from '../../../state/reporting/reporting.actions';
import { AuthService } from '../../services/auth.service';
import { AuthFacade } from './auth.facade';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class AuthEffects {
  public login = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({credentials}) => this.authService.login(credentials).pipe(
        map(loginData => {
          if (loginData.passwordNeedsToBeChanged) {
            return AuthActions.passwordChangeNeeded();
          }
          return AuthActions.loginSuccess({loginData});
        }),
        catchError((errorResponse: HttpErrorResponse) => of(
          AuthActions.loginFailure(),
          ReportingActions.reportError({message: errorResponse.error.error}),
        )),
        ),
      ),
    ),
  );

  public changePassword = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.changePassword),
      switchMap(({newPassword}) => this.authService.changePassword(newPassword).pipe(
        withLatestFrom(this.authFacade.authUserData),
        switchMap(([, authData]) => of(
          AuthActions.changePasswordSuccess(),
          AuthActions.login({
            credentials: {
              accountName: authData.accountName,
              userName: authData.userName,
              password: newPassword,
            },
          }),
        )),
        catchError((errorResponse) => of(
          AuthActions.changePasswordFailure({error: errorResponse.error}),
          ReportingActions.reportError({message: errorResponse.error.message}),
        )),
        ),
      ),
    ),
  );

  public logout = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      switchMap(() => this.authService.logout().pipe(
        map(() => AuthActions.logoutSuccess()),
        catchError((errorResponse: HttpErrorResponse) => of(
          AuthActions.logoutFailure(),
          ReportingActions.reportError({message: errorResponse.error.error}),
        )),
        ),
      ),
    ),
  );

  public redirectAfterLogin = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => this.authService.redirectAfterLogin()),
      ),
    {dispatch: false},
  );

  public redirectToPasswordChangeRoute = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.passwordChangeNeeded),
        tap(() => this.authService.redirectToPasswordChangeRoute()),
      ),
    {dispatch: false},
  );

  public redirectAfterLogout = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.logoutSuccess),
        tap(() => this.authService.redirectAfterLogout()),
      ),
    {dispatch: false},
  );

  constructor(private actions$: Actions,
              private authService: AuthService,
              private authFacade: AuthFacade) {
  }
}
