import { AssignmentsListFacade } from './assignments-list.facade';
import SpyObj = jasmine.SpyObj;

export class AssignmentsListFacadeMockBuilder {
  private mock = jasmine.createSpyObj<AssignmentsListFacade>([
    'reset',
    'loadNextPage',
    'getAssignments',
    'getHasFetchedAll',
    'getFetchingParams',
    'getIsLoading',
    'setFilter',
    'reject',
    'accept',
    'release',
    'close',
    'startDragging',
    'endDragging',
    'handover',
    'getAssignmentsTotal',
    'search',
  ]);

  public setIsUpdating(isUpdating: any) {
    this.mock.isUpdating = isUpdating;
    return this;
  }

  public setDraggedAssignment(draggedAssignment: any) {
    this.mock.draggedAssignment = draggedAssignment;
    return this;
  }

  public build(): SpyObj<AssignmentsListFacade> {
    return this.mock;
  }
}
