import { exampleAssignment } from '../model/assignment';
import { isClosed, isNew, isOngoing, isReadyToPlan } from './assignments-columns-helper';

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
