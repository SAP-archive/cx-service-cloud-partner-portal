import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, concatMap, map } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AssignmentsDetailsActions from './assignments-details.actions';
import * as ReportingActions from '../../../state/reporting/reporting.actions';
import { TechniciansListService } from '../../services/technicians-list.service';

@Injectable()
export class AssignmentsDetailsEffects {
  public loadTechnicians = createEffect(() => {
    return this.actions$.pipe(
      ofType(AssignmentsDetailsActions.loadTechnicians),
      concatMap(() =>
        this.techniciansService.loadTechnicians().pipe(
          map(technicians => AssignmentsDetailsActions.loadTechniciansSuccess({ technicians })),
          catchError((response) => of(
            AssignmentsDetailsActions.loadTechniciansFailure(),
            ReportingActions.reportError({ message: response.message }))),
        )));
  });

  constructor(private actions$: Actions, private techniciansService: TechniciansListService) {
  }
}
