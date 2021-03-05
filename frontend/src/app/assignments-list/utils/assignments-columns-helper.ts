import { Assignment } from '../model/assignment';
import { Action } from '@ngrx/store';
import { ColumnName } from '../model/column-name';

export const isNew = (assignment: Assignment) =>
  assignment.partnerDispatchingStatus === 'NOTIFIED';

export const isReadyToPlan = (assignment: Assignment) =>
  assignment.partnerDispatchingStatus === 'ACCEPTED' && assignment.serviceAssignmentState === 'ASSIGNED';

export const isOngoing = (assignment: Assignment) =>
  assignment.serviceAssignmentState === 'RELEASED';

export const isClosed = (assignment: Assignment) =>
  assignment.serviceAssignmentState === 'CLOSED';

export const isActionNotAboutMyColumn = (action: Action & { columnName?: ColumnName }, myColumn: ColumnName): boolean =>
  !!action.columnName && action.columnName !== myColumn;

export const assignmentsSortComparer = (a: Assignment, b: Assignment): number => b.lastChanged - a.lastChanged;
