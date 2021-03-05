import { createAction, props } from '@ngrx/store';
import { Assignment } from '../../model/assignment';
import { Technician } from '../../../technicians-list-module/models/technician.model';
import { DetailsDisplayMode } from '../../model/details-display-mode';

export const reset = createAction(
    '[AssignmentsDetails] Reset',
);

export const loadTechnicians = createAction(
    '[AssignmentsDetails] Fetch Technicians',
);

export const loadTechniciansSuccess = createAction(
    '[AssignmentsDetails] Fetch Technicians Success',
    props<{ technicians: Technician[] }>(),
);

export const loadTechniciansFailure = createAction(
    '[AssignmentsDetails] Fetch Technicians Failure',
);

export const showAssignment = createAction(
    '[AssignmentsDetails] Show assignment',
    props<{ assignment: Assignment }>(),
);

export const setDisplayMode = createAction(
    '[AssignmentsDetails] Set Display Mode',
    props<{ displayMode: DetailsDisplayMode }>(),
);
