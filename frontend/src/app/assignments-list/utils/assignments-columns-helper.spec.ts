import { exampleAssignment } from '../model/assignment';
import {
  assignmentsSortComparer,
  isActionNotAboutMyColumn,
  isClosed,
  isNew,
  isOngoing,
  isReadyToPlan,
} from './assignments-columns-helper';

describe('isNew()', () => {
  it('should return true if assignment dispatching status is NOTIFIED', () => {
    expect(isNew(exampleAssignment('1', 'NOTIFIED'))).toBeTrue();
    expect(isNew(exampleAssignment('1', 'ACCEPTED'))).toBeFalse();
  });
});

describe('isReadyToPlan()', () => {
  it('should return true if assignment dispatching status is ACCEPTED and serviceAssignmentState is ASSIGNED', () => {
    expect(isReadyToPlan(exampleAssignment('1', 'ACCEPTED', 'ASSIGNED'))).toBeTrue();
    expect(isReadyToPlan(exampleAssignment('1', 'ACCEPTED', 'RELEASED'))).toBeFalse();
    expect(isReadyToPlan(exampleAssignment('1', 'ACCEPTED', 'CLOSED'))).toBeFalse();
    expect(isReadyToPlan(exampleAssignment('1', 'NOTIFIED'))).toBeFalse();
  });
});

describe('isOngoing()', () => {
  it('should return true if assignment serviceAssignmentState status is RELEASED', () => {
    expect(isOngoing(exampleAssignment('1', 'ACCEPTED', 'RELEASED'))).toBeTrue();
    expect(isOngoing(exampleAssignment('1', 'ACCEPTED', 'CLOSED'))).toBeFalse();
  });
});

describe('isClosed()', () => {
  it('should return true if assignment serviceAssignmentState status is RELEASED', () => {
    expect(isClosed(exampleAssignment('1', 'ACCEPTED', 'CLOSED'))).toBeTrue();
    expect(isClosed(exampleAssignment('1', 'ACCEPTED', 'RELEASED'))).toBeFalse();
  });
});

describe('assignmentsSortComparer()', () => {
  it('should sort assignments by lastChanged ASC', () => {
    const assignment = (lastChanged: number) => ({
      ...exampleAssignment(lastChanged.toString(10)),
      lastChanged: lastChanged,
    });

    expect(assignmentsSortComparer(assignment(1), assignment(2))).toEqual(1);
    expect(assignmentsSortComparer(assignment(2), assignment(1))).toEqual(-1);
    expect(assignmentsSortComparer(assignment(1), assignment(1))).toEqual(0);
  });
});

describe('isActionNotAboutMyColumn()', () => {
  it('should return true only if action has column defined and that column differs from the passed one', () => {
    expect(isActionNotAboutMyColumn(
      {type: 'whatever', columnName: 'ASSIGNMENTS_BOARD_CLOSED'},
      'ASSIGNMENTS_BOARD_NEW',
    )).toBeTrue();

    expect(isActionNotAboutMyColumn(
      {type: 'whatever', columnName: 'ASSIGNMENTS_BOARD_NEW'},
      'ASSIGNMENTS_BOARD_NEW',
    )).toBeFalse();

    expect(isActionNotAboutMyColumn(
      {type: 'whatever'},
      'ASSIGNMENTS_BOARD_NEW',
    )).toBeFalse();
  });
});
