import { Injectable } from '@angular/core';
import { AppBackendService } from 'src/app/services/app-backend.service';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { AssignmentsListFacade } from '../state/assignments-list.facade';
import { CrowdApiResponse } from '../../technicians-list-module/models/crowd-api-response.model';
import { Assignment } from '../model/assignment';
import { ColumnName } from '../model/column-name';

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
          `/assignments?page=${fetchingParams.pagesLoaded}&size=50&filter=${JSON.stringify(fetchingParams.filter)}`),
      ),
      map(response => response.body),
    );
  }

  public reject(assignment: Assignment): Observable<CrowdApiResponse<string>> {
    return this.appBackend.post<CrowdApiResponse<string>>(`/assignments/${assignment.id}/actions/reject`, assignment).pipe(
      map(response => response.body),
    );
  }

  public accept(assignment: Assignment): Observable<CrowdApiResponse<string>> {
    return this.appBackend.post<CrowdApiResponse<string>>(`/assignments/${assignment.id}/actions/accept`, assignment).pipe(
      map(response => response.body),
    );
  }

  public update(assignment: Assignment): Observable<CrowdApiResponse<Assignment>> {
    return this.appBackend.post<CrowdApiResponse<Assignment>>(`/assignments/${assignment.id}/actions/update`, assignment).pipe(
      map(response => response.body),
    );
  }

  public close(assignment: Assignment): Observable<CrowdApiResponse<Assignment>> {
    return this.appBackend.post<CrowdApiResponse<Assignment>>(`/assignments/${assignment.id}/actions/close`, assignment).pipe(
      map(response => response.body),
    );
  }

  public release(assignment: Assignment): Observable<CrowdApiResponse<Assignment>> {
    return this.appBackend.post<CrowdApiResponse<Assignment>>(`/assignments/${assignment.id}/actions/release`, assignment).pipe(
      map(response => response.body),
    );
  }
}
