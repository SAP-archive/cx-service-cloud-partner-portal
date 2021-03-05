import { FetchingFilter } from '../model/fetching-filter';
import { EntityState } from '@ngrx/entity';
import { Assignment } from '../model/assignment';

export interface ColumnState extends EntityState<Assignment> {
  isLoading: boolean;
  pagesLoaded: number;
  totalPages: number;
  totalElements: number;
  filter?: FetchingFilter;
  updatedAssignment?: Assignment;
}
