import { Action, createReducer, on } from '@ngrx/store';
import * as TechniciansActions from './technicians.actions';
import { Technician } from '../models/technician.model';

export const techniciansFeatureKey = 'technicians';

export interface State {
  technicians?: Technician[];
  isLoading: boolean;
}

export const initialState: State = {
  technicians: null,
  isLoading: false,
};

const updateToBeDeletedFromTechnician = (technicians: Technician[], technicianExternalId: string, value: boolean): Technician[] => {
  return technicians.map(technician => {
    if (technician.externalId ===  technicianExternalId) {
      return {
        ...technician,
        toBeDeleted: value
      };
    } else {
      return technician;
    }
  });
};

const techniciansReducer = createReducer(
  initialState,

  on(TechniciansActions.loadTechnicians, state => ({
    ...state,
    isLoading: true,
  })),
  on(TechniciansActions.loadTechniciansSuccess, (state, {data}) => ({
    ...state,
    technicians: data,
    isLoading: false,
  })),
  on(TechniciansActions.loadTechniciansFailure, (state) => ({
    ...state,
    isLoading: false,
  })),
  on(TechniciansActions.deleteTechnician, (state, {technician}) => ({
    ...state,
    technicians: updateToBeDeletedFromTechnician(state.technicians, technician.externalId, true)
  })),
  on(TechniciansActions.deleteTechnicianSuccess, (state, action) => ({
    ...state,
    technicians: state.technicians.filter(technician => technician.externalId !== action.technician.externalId)
  })),
  on(TechniciansActions.deleteTechnicianFailure, (state, {technician}) => ({
    ...state,
    technicians: updateToBeDeletedFromTechnician(state.technicians, technician.externalId, false)
  })),
);

export function reducer(state: State | undefined, action: Action) {
  return techniciansReducer(state, action);
}
