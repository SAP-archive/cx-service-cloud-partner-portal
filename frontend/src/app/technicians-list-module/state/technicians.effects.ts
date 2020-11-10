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
        this.technicianService.loadTechnicians().pipe(
          map(data => TechniciansActions.loadTechniciansSuccess(data)),
          catchError((response) => of(ReportingActions.reportError({ message: response.message })))),
      ),
    );
  });

  public searchTechnicians$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TechniciansActions.searchTechnicians),
      concatMap(({name}) =>
      this.technicianService.searchTechnicians(name).pipe(
          map(data => TechniciansActions.searchTechniciansSuccess(data)),
          catchError((response) => of(ReportingActions.reportError({ message: response.message })))),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private technicianService: TechnicianService,
  ) {
  }

}
