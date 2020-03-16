import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as fromUser from './user.actions';
import * as fromAuth from '../../auth-module/state/auth.actions';
import { map, switchMap, tap } from 'rxjs/operators';
import { LocalisationService } from '../../services/localisation.service';

@Injectable()
export class UserEffects {
  public initLocalisation = createEffect(
    () => this.actions$.pipe(
      ofType(fromUser.initLocalisation, fromAuth.logoutSuccess),
      map(() => fromUser.changeLocalisation({localisation: this.localisationService.getInitialLocalisation()})),
    ));

  public changeLocalisation = createEffect(
    () => this.actions$.pipe(
      ofType(fromUser.changeLocalisation, fromAuth.loginSuccess),
      map(action => 'loginData' in action ? action.loginData.localisation : action.localisation),
      switchMap(localisation => this.localisationService.setLocalisation(localisation))
    ),
    {dispatch: false});

  constructor(
    private actions$: Actions,
    private localisationService: LocalisationService,
  ) {
  }
}
