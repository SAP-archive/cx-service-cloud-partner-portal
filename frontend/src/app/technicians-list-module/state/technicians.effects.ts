import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as TechniciansActions from './technicians.actions';
import { TechnicianService } from '../services/technicians.service';
import * as ReportingActions from '../../state/reporting/reporting.actions';


@Injectable()
export class TechniciansEffects {
  public loadTechnicians$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TechniciansActions.loadTechnicians),
      concatMap(() =>
        this.technicianService.getAll().pipe(
          map(data => TechniciansActions.loadTechniciansSuccess({data})),
          catchError((response) => of(ReportingActions.reportError({message: response.message})))),
      ),
    );
  });

  public deleteTechnician$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TechniciansActions.deleteTechnician),
      concatMap(({technician}) =>
        this.technicianService.deleteTechnician(technician).pipe(
          switchMap(() => of(
            TechniciansActions.deleteTechnicianSuccess({technician}),
            ReportingActions.reportSuccess({message: 'DASHBOARD_TECHNICIAN_HAS_BEEN_DELETED'}),
          )),
          catchError((response: { error: { message: string } }) => of(
            TechniciansActions.deleteTechnicianFailure({technician}),
            ReportingActions.reportError({message: 'DASHBOARD_TECHNICIAN_DELETION_FAILED'}),
          ))),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private technicianService: TechnicianService,
  ) {
  }

}
