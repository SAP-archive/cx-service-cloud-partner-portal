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
  newCount: 3,
  readyToPlanCount: 6,
  closedCount: 40,
  ongoingCount: 4,
});
