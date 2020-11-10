import { State } from './assignments-tile.reducer';
import * as fromAssignments from './assignments-tile.selectors';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as assignmentsTileActions from './assignments-tile.actions';
import { AssignmentsStats } from '../model/assignments-stats';

@Injectable({providedIn: 'root'})
export class AssignmentsTileFacade {
  public assignmentsStats: Observable<AssignmentsStats> = this.store.select(fromAssignments.selectAssignmentsStats);
  public isLoading: Observable<boolean> = this.store.select(fromAssignments.selectIsLoading);

  constructor(
    private store: Store<State>,
  ) {
  }

  public loadAssignmentsStats() {
    this.store.dispatch(assignmentsTileActions.loadAssignmentsStats());
  }
}
