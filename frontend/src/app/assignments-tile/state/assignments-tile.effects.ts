import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AssignmentsActions from './assignments-tile.actions';
import * as ReportingActions from '../../state/reporting/reporting.actions';
import { AssignmentsTileService } from '../services/assignments-tile.service';

@Injectable()
export class AssignmentsTileEffects {
  public loadAssignmentsStats = createEffect(() => {
    return this.actions$.pipe(
      ofType(AssignmentsActions.loadAssignmentsStats),
      concatMap(() =>
        this.assignmentsTileService.loadAssignmentsStats().pipe(
          map(assignmentsStats => AssignmentsActions.loadAssignmentsStatsSuccess({assignmentsStats})),
          catchError((response) => of(
            AssignmentsActions.loadAssignmentsStatsFailure(),
            ReportingActions.reportError({message: response.message}))),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private assignmentsTileService: AssignmentsTileService,
  ) {
  }
}
