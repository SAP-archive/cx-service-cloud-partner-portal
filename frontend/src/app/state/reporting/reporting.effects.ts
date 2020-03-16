import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, tap } from 'rxjs/operators';
import * as ReportingActions from './reporting.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalisationService } from '../../services/localisation.service';

@Injectable()
export class ReportingEffects {
  public report = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ReportingActions.reportError, ReportingActions.reportSuccess),
        switchMap(({message}) => this.localisationService.translate(message ? message : 'UNEXPECTED_ERROR')),
        tap((translatedMessage) => this.snackBar.open(
          translatedMessage,
          null,
          {
            duration: 10000,
          },
        )),
      );
    },
    {dispatch: false});

  constructor(private actions$: Actions,
              private snackBar: MatSnackBar,
              private localisationService: LocalisationService) {
  }
}
