import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as CompanyProfileActions from './company-profile.actions';
import * as ReportingActions from '../../state/reporting/reporting.actions';
import { CompanyProfileService } from '../services/company-profile.service';
import { of } from 'rxjs';
import { saveAsInjectionToken } from '../injection-tokens';


@Injectable()
export class CompanyProfileEffects {

  public loadCompanyProfile = createEffect(() => {
    return this.actions$.pipe(
      ofType(CompanyProfileActions.loadCompanyProfile),
      switchMap(() => this.companyProfileService.loadProfile().pipe(
        map(data => CompanyProfileActions.loadCompanyProfileSuccess(data)),
        catchError(() => of(
          CompanyProfileActions.loadCompanyProfileFailure(),
          ReportingActions.reportError({ message: 'COMPANY_PROFILE_EDITOR_LOAD_FAILED' }),
        ))),
      ),
    );
  });

  public saveCompanyProfile = createEffect(() => {
    return this.actions$.pipe(
      ofType(CompanyProfileActions.saveCompanyProfile),
      switchMap(({ saveData }) => this.companyProfileService.saveProfile(saveData).pipe(
        switchMap(data => of(
          CompanyProfileActions.saveCompanyProfileSuccess(data),
          ReportingActions.reportSuccess({ message: 'COMPANY_PROFILE_EDITOR_UPDATED_SUCCEED' }),
        )),
        catchError(() => of(
          CompanyProfileActions.saveCompanyProfileFailure(),
          ReportingActions.reportError({ message: 'COMPANY_PROFILE_EDITOR_UPDATED_FAILED' }),
        ))),
      ),
    );
  });

  public downloadDocument = createEffect(
    () => this.actions$.pipe(
      ofType(CompanyProfileActions.downloadDocument),
      switchMap(({ document }) => this.companyProfileService.downloadDocument(document.id).pipe(
        tap(fileBlob => this.saveAs(fileBlob, document.name)),
      ),
      ),
    ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private companyProfileService: CompanyProfileService,
    @Inject(saveAsInjectionToken) private saveAs: Function
  ) { }

}
