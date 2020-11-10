import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromUser from './user.actions';
import * as fromAuth from '../../auth-module/state/auth/auth.actions';
import { map, switchMap } from 'rxjs/operators';
import { LocalisationService } from '../../services/localisation.service';

@Injectable()
export class UserEffects {
  public initLocalisation = createEffect(
    () => this.actions$.pipe(
      ofType(fromUser.initLocalisation, fromAuth.logoutSuccess),
      map(() => fromUser.setCurrentLocalisation({ localisation: this.localisationService.getInitialLocalisation() })),
    ));

  public setCurrentLocalisation = createEffect(
    () => this.actions$.pipe(
      ofType(fromUser.setCurrentLocalisation),
      map(action => action.localisation),
      switchMap(localisation => this.localisationService.setLocalLocalisation(localisation))
    ),
    { dispatch: false });

  public selectLocalisation = createEffect(
    () => this.actions$.pipe(
      ofType(fromUser.selectLocalisation),
      map(action => action.localisation),
      switchMap(localisation => this.localisationService.selectLocalisation(localisation))
    ),
    { dispatch: false });

  public loginSuccess = createEffect(
    () => this.actions$.pipe(
      ofType(fromAuth.loginSuccess),
      map(action => action.loginData.localisation),
      switchMap(localisation => this.localisationService.setLocalisationWhenLoginSuccess(localisation))
    ),
    { dispatch: false });

  constructor(
    private actions$: Actions,
    private localisationService: LocalisationService,
  ) {
  }
}
