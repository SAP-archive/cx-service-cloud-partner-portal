import { of } from 'rxjs';
import { exampleAssignment } from '../../model/assignment';
import { AssignmentsDetailsFacade } from './assignments-details.facade';
import { exampleTechnician } from '../../../technicians-list-module/models/technician.model';
import { DetailsDisplayMode } from '../../model/details-display-mode';

export class AssignmentsDetailsFacadeMockBuilder {
  private mock = jasmine.createSpyObj<AssignmentsDetailsFacade>([
    'reset',
    'showAssignment',
    'setDisplayMode',
    'loadTechnicians',
  ]);

  constructor() {
    this.mock.technicians$ = of([exampleTechnician('1'), exampleTechnician('2')]);
    this.mock.displayedAssignment$ = of(exampleAssignment());
    this.mock.displayMode$ = of('web');
  }

  public setIsLoading(isLoading: any) {
    this.mock.isLoading$ = isLoading;
    return this;
  }

  public setDisplayMode(mode: DetailsDisplayMode) {
    this.mock.displayMode$ = of(mode);
    return this;
  }

  public build(): jasmine.SpyObj<AssignmentsDetailsFacade> {
    return this.mock;
  }
}
