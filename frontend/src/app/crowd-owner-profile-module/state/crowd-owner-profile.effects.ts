import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import * as CrowdOwnerProfileActions from './crowd-owner-profile.actions';
import * as ReportingActions from '../../state/reporting/reporting.actions';
import { of } from 'rxjs';
import { CrowdOwnerProfileService } from '../services/crowd-owner-profile.service';

@Injectable()
export class CrowdOwnerProfileEffects {

  public loadContactDetails = createEffect(() => {
    return this.actions$.pipe(
      ofType(CrowdOwnerProfileActions.loadCompanyContact),
      switchMap(() => this.crowdOwnerService.getContactInfo().pipe(
        map(contactDetails => CrowdOwnerProfileActions.loadCompanyContactSuccess({contactDetails})),
        catchError(() => of(
          CrowdOwnerProfileActions.loadCompanyContactFailure(),
          ReportingActions.reportError({}),
        ))),
      ),
    );
  });

  public loadCompanyLogo = createEffect(() => {
    return this.actions$.pipe(
      ofType(CrowdOwnerProfileActions.loadCompanyLogo),
      switchMap(() => this.crowdOwnerService.getCompanyLogo().pipe(
        map(companyLogo => CrowdOwnerProfileActions.loadCompanyLogoSuccess({companyLogo})),
        catchError(() => of(CrowdOwnerProfileActions.loadCompanyLogoFailure()))),
      ),
    );
  });

  public loadCrowdName = createEffect(() => {
    return this.actions$.pipe(
      ofType(CrowdOwnerProfileActions.loadCrowdName),
      switchMap(() => this.crowdOwnerService.getCrowdName().pipe(
        map(crowdName => CrowdOwnerProfileActions.loadCrowdNameSuccess({crowdName})),
        catchError(() => of(CrowdOwnerProfileActions.loadCrowdNameFailure()))),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private crowdOwnerService: CrowdOwnerProfileService,
    ) {}
}
