export interface AssignmentsStats {
  newCount: number;
  readyToPlanCount: number;
  ongoingCount: number;
  closedCount: number;
}

export const emptyAssignmentsStats = (): AssignmentsStats => ({
  newCount: 0,
  readyToPlanCount: 0,
  closedCount: 0,
  ongoingCount: 0,
});

export const exampleAssignmentsStats = (): AssignmentsStats => ({
  newCount: 31,
  readyToPlanCount: 16,
  closedCount: 1403,
  ongoingCount: 42,
});
