import { Assignment } from '../model/assignment';

export const isNew = (draggedAssignment: Assignment) =>
  draggedAssignment.partnerDispatchingStatus === 'NOTIFIED';

export const isReadyToPlan = (draggedAssignment: Assignment) =>
  draggedAssignment.partnerDispatchingStatus === 'ACCEPTED' && draggedAssignment.serviceAssignmentState === 'ASSIGNED';

export const isOngoing = (draggedAssignment: Assignment) =>
  draggedAssignment.serviceAssignmentState === 'RELEASED';

export const isClosed = (draggedAssignment: Assignment) =>
  draggedAssignment.serviceAssignmentState === 'CLOSED';
