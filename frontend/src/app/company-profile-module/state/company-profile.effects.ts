import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as CompanyProfileActions from './company-profile.actions';
import * as ReportingActions from '../../state/reporting/reporting.actions';
import { CompanyProfileService } from '../services/company-profile.service';
import { of } from 'rxjs';
import { saveAsInjectionToken } from '../injection-tokens';
import { TranslateService } from '@ngx-translate/core';
import { CompanyProfileFacade } from './company-profile.facade';


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


  public terminateRelationship = createEffect(() => {
    return this.actions$.pipe(
      ofType(CompanyProfileActions.terminateRelationship),
      switchMap(() => this.companyProfileFacade.companyDetails.pipe(
      switchMap(({ id }) => this.companyProfileService.terminateRelationship(id).pipe(
        switchMap(() => of(
          CompanyProfileActions.terminateRelationshipSuccess(),
          ReportingActions.reportSuccess({ message: 'COMPANY_PROFILE_TILE_TERMINATE_APPLY_SUCCESS'})
        )),
        catchError(() => of(
          CompanyProfileActions.terminateRelationshipFailure()
        ))),
      ),
    )));
  });

  public terminateRelationshipFailure = createEffect(() => {
    return this.actions$.pipe(
      ofType(CompanyProfileActions.terminateRelationshipFailure),
      switchMap(() => this.companyProfileFacade.companyDetails.pipe(
        switchMap(({ contact }) => this.translateService.get('COMPANY_PROFILE_TILE_TERMINATE_APPLY_FAIL',
         { name: contact.firstName +  contact.lastName}).pipe(
          switchMap(message => of(
            ReportingActions.reportError({ message })
          ))),
        ),
      )
    ));
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
    private translateService: TranslateService,
    private companyProfileService: CompanyProfileService,
    private companyProfileFacade: CompanyProfileFacade,
    @Inject(saveAsInjectionToken) private saveAs: Function
  ) { }

}
