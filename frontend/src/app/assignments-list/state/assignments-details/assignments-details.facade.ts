import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Assignment } from '../../model/assignment';
import { State } from './assignments-details.reducer';
import * as AssignmentsDetailsActions from './assignments-details.actions';
import * as AssignmentsDetailsSelector from './assignments-details.selectors';
import { Technician } from '../../../technicians-list-module/models/technician.model';
import { DetailsDisplayMode } from '../../model/details-display-mode';

@Injectable({providedIn: 'root'})
export class AssignmentsDetailsFacade {
  public technicians$: Observable<Technician[]> = this.store.select(AssignmentsDetailsSelector.selectTechnicians);
  public isLoading$: Observable<boolean> = this.store.select(AssignmentsDetailsSelector.selectIsLoading);
  public displayedAssignment$: Observable<Assignment> = this.store.select(AssignmentsDetailsSelector.selectDisplayedAssignment);
  public displayMode$: Observable<DetailsDisplayMode> = this.store.select(AssignmentsDetailsSelector.selectDisplayMode);

  constructor(private store: Store<State>) {
  }

  public loadTechnicians() {
    this.store.dispatch(AssignmentsDetailsActions.loadTechnicians());
  }

  public showAssignment(assignment: Assignment) {
    this.store.dispatch(AssignmentsDetailsActions.showAssignment({assignment}));
  }

  public setDisplayMode(displayMode: DetailsDisplayMode) {
    this.store.dispatch(AssignmentsDetailsActions.setDisplayMode({displayMode}));
  }

  public reset() {
    this.store.dispatch(AssignmentsDetailsActions.reset());
  }
}
