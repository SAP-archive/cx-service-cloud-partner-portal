import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { switchMap, tap } from 'rxjs/operators';
import * as ReportingActions from './reporting.actions';
import { LocalisationService } from '../../services/localisation.service';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable()
export class ReportingEffects {
  public report = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ReportingActions.reportError, ReportingActions.reportSuccess, ReportingActions.reportWarning),
        tap(action => {
          this.localisationService.translate(action.message ? action.message : 'UNEXPECTED_ERROR').subscribe(message => {
            let config: MatSnackBarConfig = {};
            switch (action.type) {
              case ReportingActions.reportWarning.type:
                config = {
                  ...config,
                  panelClass: 'warning-snackbar',
                };
                break;
              default:
                config = {
                  ...config,
                  duration: 10000,
                };
                break;
            }
            this.snackBar.open(message, null, config);
          });
        })
      );
    },
    {dispatch: false});

  constructor(private actions$: Actions,
              private snackBar: MatSnackBar,
              private localisationService: LocalisationService) {
  }
}
