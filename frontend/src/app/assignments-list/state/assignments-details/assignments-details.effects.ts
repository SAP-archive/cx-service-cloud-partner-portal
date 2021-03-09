import { of } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, concatMap, map, tap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as AssignmentsDetailsActions from './assignments-details.actions';
import * as ReportingActions from '../../../state/reporting/reporting.actions';
import { TechniciansListService } from '../../services/technicians-list.service';
import { AssignmentsDetailsService } from '../../services/assignments-details.service';

@Injectable()
export class AssignmentsDetailsEffects {
  public loadTechnicians = createEffect(() =>
    this.actions$.pipe(
      ofType(AssignmentsDetailsActions.loadTechnicians),
      concatMap(() =>
        this.techniciansService.loadTechnicians().pipe(
          map(technicians => AssignmentsDetailsActions.loadTechniciansSuccess({technicians})),
          catchError((response) => of(
            AssignmentsDetailsActions.loadTechniciansFailure(),
            ReportingActions.reportError({message: response.message}))),
        ))));

  public showAssignmentDetails = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AssignmentsDetailsActions.showAssignment),
        tap(() => this.assignmentsDetailsService.openDetails()),
      ),
    {dispatch: false},
  );

  constructor(
    private actions$: Actions,
    private techniciansService: TechniciansListService,
    private assignmentsDetailsService: AssignmentsDetailsService,
  ) {
  }
}
