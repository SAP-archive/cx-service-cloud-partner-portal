import { createAction, props } from '@ngrx/store';
import { Technician } from '../models/technician.model';

export const loadTechnicians = createAction(
  '[Technicians] Load Technicians',
);

export const loadTechniciansSuccess = createAction(
  '[Technicians] Load Technicians Success',
  props<{ data: Technician[] }>(),
);

export const loadTechniciansFailure = createAction(
  '[Technicians] Load Technicians Failure',
  props<{ error: any }>(),
);

export const deleteTechnician = createAction(
  '[Technicians] Delete Technician',
  props<{ technician: Technician }>(),
);

export const deleteTechnicianSuccess = createAction(
  '[Technicians] Delete Technician Success',
  props<{ technician: Technician }>(),
);

export const deleteTechnicianFailure = createAction(
  '[Technicians] Delete Technician Failure',
  props<{ technician: Technician }>(),
);
