import { Action, createReducer, on } from '@ngrx/store';
import { Assignment } from '../../model/assignment';
import * as AssignmentsDetailsActions from './assignments-details.actions';
import { DetailsDisplayMode } from '../../model/details-display-mode';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { Technician } from '../../../technicians-list-module/models/technician.model';

export const assignmentsDetailsFeatureKey = 'assignmentsDetails';

export interface State extends EntityState<Technician> {
    isLoading: boolean;
    displayMode: DetailsDisplayMode;
    displayedAssignment: Assignment;
}

export const adapter: EntityAdapter<Technician> = createEntityAdapter<Technician>({
    selectId: technician => technician.externalId,
});

export const initialState = () => adapter.getInitialState<State>({
    ids: [],
    entities: {},
    isLoading: false,
    displayMode: 'web',
    displayedAssignment: null,
});

const assignmentsListReducer = createReducer(
    initialState(),

    on(
        AssignmentsDetailsActions.reset,
        () => initialState(),
    ),

    on(
        AssignmentsDetailsActions.setDisplayMode,
        ((state, { displayMode }) => ({
            ...state,
            displayMode
        })),
    ),

    on(
        AssignmentsDetailsActions.loadTechnicians,
        (state) => ({
            ...state,
            isLoading: true,
        }),
    ),

    on(
        AssignmentsDetailsActions.loadTechniciansSuccess,
        ((state, { technicians }) => ({
            ...adapter.addMany(technicians, state),
            isLoading: false,
        })),
    ),

    on(
        AssignmentsDetailsActions.loadTechniciansFailure,
        (state => ({
            ...state,
            isLoading: false,
        })),
    ),

    on(
        AssignmentsDetailsActions.showAssignment,
        ((state, { assignment }) => ({
            ...state,
            displayedAssignment: assignment,
        })),
    ),
);

export function reducer(state: State | undefined, action: Action) {
    return assignmentsListReducer(state, action);
}
