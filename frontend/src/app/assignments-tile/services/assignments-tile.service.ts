import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssignmentsStats } from '../model/assignments-stats';
import { AppBackendService } from '../../services/app-backend.service';

@Injectable()
export class AssignmentsTileService {
  constructor(private appBackend: AppBackendService) {
  }

  public loadAssignmentsStats(): Observable<AssignmentsStats> {
    return this.appBackend.get<AssignmentsStats>(
      `/assignments-stats`)
      .pipe(
        map(response => response.body),
      );
  }
}
