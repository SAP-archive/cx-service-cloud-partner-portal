import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatMap, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AssignmentsActions from './assignments-list.actions';
import * as ReportingActions from '../../state/reporting/reporting.actions';
import { AssignmentsListService } from '../services/assignments-list.service';

@Injectable()
export class AssignmentsListEffects {
  public loadNextPage$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AssignmentsActions.loadNextPage),
      mergeMap(({columnName}) =>
        this.assignmentsService.loadNextPage(columnName).pipe(
          map(data => AssignmentsActions.loadNextPageSuccess({columnName, response: data})),
          catchError((response) => of(
            AssignmentsActions.loadNextPageFailure({columnName}),
            ReportingActions.reportError({message: response.error ? response.error.message : 'BACKEND_ERROR_UNEXPECTED'}))),
        ),
      ),
    );
  });

  public reject = createEffect(() => {
    return this.actions$.pipe(
      ofType(AssignmentsActions.reject),
      concatMap(({assignment, type}) =>
        this.assignmentsService.reject(assignment).pipe(
          map(result => AssignmentsActions.rejectSuccess({id: assignment.id})),
          catchError((response) => of(
            AssignmentsActions.rejectFailure(),
            ReportingActions.reportError({message: response.error ? response.error.message : 'BACKEND_ERROR_UNEXPECTED'}))),
        ),
      ),
    );
  });

  public accept = createEffect(() => {
    return this.actions$.pipe(
      ofType(AssignmentsActions.accept),
      concatMap(({assignment, type}) =>
        this.assignmentsService.accept(assignment).pipe(
          map(result => AssignmentsActions.acceptSuccess({assignment: {...assignment, partnerDispatchingStatus: 'ACCEPTED'}})),
          catchError((response) => of(
            AssignmentsActions.acceptFailure(),
            ReportingActions.reportError({message: response.error ? response.error.message : 'BACKEND_ERROR_UNEXPECTED'}))),
        ),
      ),
    );
  });

  public release = createEffect(() => {
    return this.actions$.pipe(
      ofType(AssignmentsActions.release),
      concatMap(({assignment, type}) =>
        this.assignmentsService.update(assignment).pipe(
          switchMap(res => this.assignmentsService.release(assignment)),
          map(result => AssignmentsActions.releaseSuccess({ assignment: {...assignment, serviceAssignmentState: 'RELEASED'} })),
          catchError((response) => of(
            AssignmentsActions.releaseFailure(),
            ReportingActions.reportError({message: response.error ? response.error.message : 'BACKEND_ERROR_UNEXPECTED'}))),
        ),
      ),
    );
  });

  public close = createEffect(() => {
    return this.actions$.pipe(
      ofType(AssignmentsActions.close),
      concatMap(({assignment, type}) =>
        this.assignmentsService.close(assignment).pipe(
          map(result => AssignmentsActions.closeSuccess({assignment: {...assignment, serviceAssignmentState: 'CLOSED'}})),
          catchError((response) => of(
            AssignmentsActions.closeFailure(),
            ReportingActions.reportError({message: response.error ? response.error.message : 'BACKEND_ERROR_UNEXPECTED'}))),
        ),
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private assignmentsService: AssignmentsListService,
  ) {
  }

}
