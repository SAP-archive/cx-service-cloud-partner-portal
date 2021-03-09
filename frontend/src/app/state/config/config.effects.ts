import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { CompanySettingsService } from '../../services/company-settings.service';
import * as ConfigActions from './config.actions';
import { of } from 'rxjs';
import * as ReportingActions from '../reporting/reporting.actions';

@Injectable()
export class ConfigEffects {
  public report = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ConfigActions.fetchCompanySettings),
        mergeMap(() =>
          this.companySettingsService.fetch().pipe(
            map(settings => ConfigActions.fetchCompanySettingsSuccess({settings})),
            catchError((response) => of(
              ConfigActions.fetchCompanySettingsFailure(),
              ReportingActions.reportError({message: response.error ? response.error.message : 'BACKEND_ERROR_UNEXPECTED'}))),
          )),
      );
    },
  );

  constructor(
    private actions$: Actions,
    private companySettingsService: CompanySettingsService,
  ) {
  }
}
