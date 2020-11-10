import { createAction, props } from '@ngrx/store';
import { Technician } from '../models/technician.model';
import { CrowdApiResponse } from '../models/crowd-api-response.model';

export const searchTechnicians = createAction(
  '[Technicians] Search Technicians',
  props<{ name: string }>(),
);

export const searchTechniciansSuccess = createAction(
  '[Technicians] Search Technicians Success',
  props<CrowdApiResponse<Technician>>(),
);

export const searchTechniciansFailure = createAction(
  '[Technicians] Search Technicians Failure',
);

export const loadTechnicians = createAction(
  '[Technicians] Load Technicians',
);

export const loadTechniciansSuccess = createAction(
  '[Technicians] Load Technicians Success',
  props<CrowdApiResponse<Technician>>(),
);

export const loadTechniciansFailure = createAction(
  '[Technicians] Load Technicians Failure',
  props<{ error: any }>(),
);

