import { Action, createReducer, on } from '@ngrx/store';
import * as TechniciansActions from './technicians.actions';
import { Technician } from '../models/technician.model';
import { createEntityAdapter, EntityState, EntityAdapter } from '@ngrx/entity';
import { FetchingParams } from '../models/fetchingPrams.model';

export const techniciansFeatureKey = 'technicians';

export interface State extends EntityState<Technician> {
  isLoading: boolean;
  fetchingParams: FetchingParams;
}

export const adapter: EntityAdapter<Technician> = createEntityAdapter<Technician>({
  selectId: (technician: Technician) => technician.externalId,
});

export const initialState: State = adapter.getInitialState({
  isLoading: false,
  fetchingParams: {
    pagesLoaded: 0,
    totalPages: 0,
    totalElements: 0,
    name: '',
  }
});

const techniciansReducer = createReducer(
  initialState,

  on(TechniciansActions.searchTechnicians,
    (state, {name}) => ({
      ...adapter.removeAll(state),
      isLoading: true,
      fetchingParams: {
        name: name,
        pagesLoaded: 0,
        totalPages: 0,
        totalElements: 0,
      },
    }),
  ),
  on(TechniciansActions.searchTechniciansSuccess, (state, {results, totalPages, totalElements}): State =>
      ({
        ...adapter.addAll(results, state),
        isLoading: false,
        fetchingParams: {
          ...state.fetchingParams,
          pagesLoaded: 1,
          totalPages,
          totalElements,
        },
      }),
  ),
  on(TechniciansActions.loadTechnicians, state => ({
    ...state,
    isLoading: true,
  })),
  on(TechniciansActions.loadTechniciansSuccess, (state, {results, totalPages, totalElements}): State =>
    ({
      ...adapter.addMany(results, state),
      isLoading: false,
      fetchingParams: {
        ...state.fetchingParams,
        pagesLoaded: state.fetchingParams.pagesLoaded + 1,
        totalPages,
        totalElements,
    },
  })),
  on(TechniciansActions.loadTechniciansFailure,
    TechniciansActions.searchTechniciansFailure, (state) => ({
    ...state,
    isLoading: false,
  })),
);

export function reducer(state: State | undefined, action: Action) {
  return techniciansReducer(state, action);
}
