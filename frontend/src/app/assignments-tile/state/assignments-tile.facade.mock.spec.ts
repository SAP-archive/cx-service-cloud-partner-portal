import { of } from 'rxjs';
import { AssignmentsTileFacade } from './assignments-tile.facade';
import { exampleAssignmentsStats } from '../model/assignments-stats';
import SpyObj = jasmine.SpyObj;

export class AssignmentsTileFacadeMockBuilder {
  private mock = jasmine.createSpyObj<AssignmentsTileFacade>([
    'loadAssignmentsStats',
  ]);

  constructor() {
    this.mock.assignmentsStats = of(exampleAssignmentsStats());
  }

  public setIsLoading(isLoading: any) {
    this.mock.isLoading = isLoading;
    return this;
  }

  public build(): SpyObj<AssignmentsTileFacade> {
    return this.mock;
  }
}
