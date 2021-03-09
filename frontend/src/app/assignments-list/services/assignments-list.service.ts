import { Injectable } from '@angular/core';
import { AppBackendService } from 'src/app/services/app-backend.service';
import { Observable, throwError } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AssignmentsListFacade } from '../state/assignments-list.facade';
import { CrowdApiResponse } from '../../technicians-list-module/models/crowd-api-response.model';
import { Assignment } from '../model/assignment';
import { ColumnName } from '../model/column-name';
import { AssignmentDispatchActions } from '../model/assignment-dispatch-actions';
import { pageSize } from '../page-size';

@Injectable()
export class AssignmentsListService {
  constructor(
    private appBackend: AppBackendService,
    private assignmentsFacade: AssignmentsListFacade) {
  }

  public loadNextPage(columnName: ColumnName): Observable<CrowdApiResponse<Assignment>> {
    return this.assignmentsFacade.getFetchingParams(columnName).pipe(
      take(1),
      switchMap(
        (fetchingParams) => this.appBackend.get<CrowdApiResponse<Assignment>>(
          `/assignments?page=${fetchingParams.pagesLoaded}&size=${pageSize}&filter=${JSON.stringify(fetchingParams.filter)}`),
      ),
      map(response => response.body),
    );
  }

  public dispatch(assignment: Assignment, action: AssignmentDispatchActions): Observable<Assignment> {
    if (assignment.syncStatus === 'BLOCKED') {
      return throwError({error: {message: 'ASSIGNMENTS_SYNC_STATUS_ERROR'}});
    }
    return this.appBackend.post<Assignment>(`/assignments/${assignment.id}/actions/${action}`, assignment).pipe(
      map(response => response.body),
    );
  }

  public handover(assignment: Assignment): Observable<Assignment> {
    return this.appBackend.post<Assignment>(`/assignments/${assignment.id}/actions/handover`, assignment).pipe(
      map(response => response.body),
    );
  }
}
