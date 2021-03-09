import { MainState } from './assignments-list.reducer';
import * as fromAssignments from './assignments-list.selectors';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as assignmentsActions from './assignments-list.actions';
import { Assignment } from '../model/assignment';
import { filter, take } from 'rxjs/operators';
import { ColumnName } from '../model/column-name';
import { FetchingFilter } from '../model/fetching-filter';

@Injectable({providedIn: 'root'})
export class AssignmentsListFacade {
  public isUpdating: Observable<boolean> = this.store.select(fromAssignments.selectIsUpdating);
  public draggedAssignment = this.store.select(fromAssignments.selectDraggedAssignment);

  constructor(
    private store: Store<MainState>,
  ) {
  }

  public setFilter(columnName: ColumnName, fetchingFilter: FetchingFilter) {
    this.store.dispatch(assignmentsActions.setFilter({columnName, fetchingFilter}));
  }

  public loadNextPage(columnName: ColumnName) {
    this.getHasFetchedAll(columnName).pipe(
      take(1),
      filter((hasFetchedAll) => !hasFetchedAll),
    ).subscribe(() => this.store.dispatch(assignmentsActions.loadNextPage({columnName})));
  }

  public getAssignments(columnName: ColumnName) {
    switch (columnName) {
      case 'ASSIGNMENTS_BOARD_NEW':
        return this.store.select(fromAssignments.selectNewAssignments);
      case 'ASSIGNMENTS_BOARD_READY_TO_PLAN':
        return this.store.select(fromAssignments.selectReadyToPlanAssignments);
      case 'ASSIGNMENTS_BOARD_ONGOING':
        return this.store.select(fromAssignments.selectOngoingAssignments);
      case 'ASSIGNMENTS_BOARD_CLOSED':
        return this.store.select(fromAssignments.selectClosedAssignments);
      default:
        throw new Error(`Unknown column ${columnName}`);
    }
  }

  public getAssignmentsTotal(columnName: ColumnName) {
    switch (columnName) {
      case 'ASSIGNMENTS_BOARD_NEW':
        return this.store.select(fromAssignments.selectNewAssignmentsTotal);
      case 'ASSIGNMENTS_BOARD_READY_TO_PLAN':
        return this.store.select(fromAssignments.selectReadyToPlanAssignmentsTotal);
      case 'ASSIGNMENTS_BOARD_ONGOING':
        return this.store.select(fromAssignments.selectOngoingAssignmentsTotal);
      case 'ASSIGNMENTS_BOARD_CLOSED':
        return this.store.select(fromAssignments.selectClosedAssignmentsTotal);
      default:
        throw new Error(`Unknown column ${columnName}`);
    }
  }

  public getHasFetchedAll(columnName: ColumnName) {
    switch (columnName) {
      case 'ASSIGNMENTS_BOARD_NEW':
        return this.store.select(fromAssignments.selectHasFetchedAllNewAssignments);
      case 'ASSIGNMENTS_BOARD_READY_TO_PLAN':
        return this.store.select(fromAssignments.selectHasFetchedAllReadyToPlanAssignments);
      case 'ASSIGNMENTS_BOARD_ONGOING':
        return this.store.select(fromAssignments.selectHasFetchedAllOngoingAssignments);
      case 'ASSIGNMENTS_BOARD_CLOSED':
        return this.store.select(fromAssignments.selectHasFetchedAllClosedAssignments);
      default:
        throw new Error(`Unknown column ${columnName}`);
    }
  }

  public getFetchingParams(columnName: ColumnName) {
    switch (columnName) {
      case 'ASSIGNMENTS_BOARD_NEW':
        return this.store.select(fromAssignments.selectNewAssignmentsFetchingParams);
      case 'ASSIGNMENTS_BOARD_READY_TO_PLAN':
        return this.store.select(fromAssignments.selectReadyToPlanAssignmentsFetchingParams);
      case 'ASSIGNMENTS_BOARD_ONGOING':
        return this.store.select(fromAssignments.selectOngoingAssignmentsFetchingParams);
      case 'ASSIGNMENTS_BOARD_CLOSED':
        return this.store.select(fromAssignments.selectClosedAssignmentsFetchingParams);
      default:
        throw new Error(`Unknown column ${columnName}`);
    }
  }

  public getIsLoading(columnName: ColumnName) {
    switch (columnName) {
      case 'ASSIGNMENTS_BOARD_NEW':
        return this.store.select(fromAssignments.selectIsLoadingNewAssignments);
      case 'ASSIGNMENTS_BOARD_READY_TO_PLAN':
        return this.store.select(fromAssignments.selectIsLoadingReadyToPlanAssignments);
      case 'ASSIGNMENTS_BOARD_ONGOING':
        return this.store.select(fromAssignments.selectIsLoadingOngoingAssignments);
      case 'ASSIGNMENTS_BOARD_CLOSED':
        return this.store.select(fromAssignments.selectIsLoadingClosedAssignments);
      default:
        throw new Error(`Unknown column ${columnName}`);
    }
  }

  public reset() {
    this.store.dispatch(assignmentsActions.reset());
  }

  public reject(assignment: Assignment) {
    this.store.dispatch(assignmentsActions.reject({assignment}));
  }

  public accept(assignment: Assignment) {
    this.store.dispatch(assignmentsActions.accept({assignment}));
  }

  public release(assignment: Assignment) {
    this.store.dispatch(assignmentsActions.release({assignment}));
  }

  public handover(assignment: Assignment) {
    this.store.dispatch(assignmentsActions.handover({assignment}));
  }

  public close(assignment: Assignment) {
    this.store.dispatch(assignmentsActions.close({assignment}));
  }

  public startDragging(assignment: Assignment) {
    this.store.dispatch(assignmentsActions.startDragging({assignment}));
  }

  public endDragging() {
    this.store.dispatch(assignmentsActions.endDragging());
  }

  public search(query: string) {
    this.store.dispatch(assignmentsActions.setSearchQuery({query}));
    this.loadNextPage('ASSIGNMENTS_BOARD_NEW');
    this.loadNextPage('ASSIGNMENTS_BOARD_READY_TO_PLAN');
    this.loadNextPage('ASSIGNMENTS_BOARD_ONGOING');
    this.loadNextPage('ASSIGNMENTS_BOARD_CLOSED');
  }
}
