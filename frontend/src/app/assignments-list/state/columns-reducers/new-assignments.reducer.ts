import { Action, createReducer, on } from '@ngrx/store';
import * as AssignmentsActions from '../assignments-list.actions';
import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Assignment } from '../../model/assignment';
import { ColumnName } from '../../model/column-name';
import { ColumnState } from '../column-state';
import { assignmentsSortComparer, isActionNotAboutMyColumn } from '../../utils/assignments-columns-helper';
import { downgradePagingTotalsByOneItem } from './downgrade-paging-totals-by-one-item';

const myColumn: ColumnName = 'ASSIGNMENTS_BOARD_NEW';

export const adapter: EntityAdapter<Assignment> = createEntityAdapter<Assignment>({
  selectId: assignment => assignment.id,
  sortComparer: assignmentsSortComparer,
});

export const initialState = (): ColumnState => adapter.getInitialState({
  isLoading: false,
  pagesLoaded: 0,
  totalPages: 0,
  totalElements: 0,
  updatedAssignment: null,
  filter: null,
});

const newAssignmentsReducer = createReducer(
  initialState(),

  on(
    AssignmentsActions.reset,
    () => initialState(),
  ),

  on(
    AssignmentsActions.setFilter,
    (state, {fetchingFilter}) => ({
      ...state,
      filter: fetchingFilter,
    }),
  ),

  on(
    AssignmentsActions.loadNextPage,
    (state) => ({
      ...state,
      isLoading: true,
    }),
  ),

  on(
    AssignmentsActions.loadNextPageSuccess,
    (state, {response}): ColumnState =>
      ({
        ...adapter.addMany(response.results, state),
        isLoading: false,
        pagesLoaded: state.pagesLoaded + 1,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
      }),
  ),

  on(
    AssignmentsActions.loadNextPageFailure,
    (state) => ({
      ...state,
      isLoading: false,
    }),
  ),

  on(
    AssignmentsActions.reject, AssignmentsActions.accept,
    (state, {assignment}) => ({
      ...adapter.removeOne(assignment.id, state),
      updatedAssignment: assignment,
    }),
  ),

  on(
    AssignmentsActions.rejectFailure, AssignmentsActions.acceptFailure,
    state => ({
      ...adapter.addOne(state.updatedAssignment, state),
      updatedAssignment: null,
    }),
  ),

  on(
    AssignmentsActions.rejectSuccess,
    (state) => ({
      ...state,
      updatedAssignment: null,
    }),
  ),

  on(
    AssignmentsActions.acceptSuccess,
    (state) => ({
      ...state,
      updatedAssignment: null,
      ...downgradePagingTotalsByOneItem(state.totalPages, state.totalElements),
    }),
  ),

  on(
    AssignmentsActions.setSearchQuery,
    (state, {query}) =>
      ({
        ...adapter.removeAll(state),
        filter: {
          ...state.filter,
          query,
        },
        pagesLoaded: 0,
        totalElements: 0,
        totalPages: 0,
      }),
  ),
);


export function reducer(state: ColumnState | undefined, action: Action & { columnName?: ColumnName }) {
  if (isActionNotAboutMyColumn(action, myColumn)) {
    return state;
  }
  return newAssignmentsReducer(state, action);
}
