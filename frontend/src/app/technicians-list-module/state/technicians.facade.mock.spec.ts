import { of } from 'rxjs';
import { TechniciansFacade } from './technicians.facade';
import { exampleTechnician } from '../models/technician.model';
import { emptyFetchingParams } from '../models/fetchingPrams.model';
import SpyObj = jasmine.SpyObj;

export class TechniciansFacadeMockBuilder {
  private mock = jasmine.createSpyObj<TechniciansFacade>([
    'loadTechnicians',
    'searchTechnicians'
  ]);

  constructor() {
    this.mock.technicians = of([exampleTechnician('1'), exampleTechnician('2')]);
    this.mock.fetchingParams = of(emptyFetchingParams());
  }

  public build(): SpyObj<TechniciansFacade> {
    return this.mock;
  }

  public setTechnicians(technicians: any) {
    this.mock.technicians = technicians;
    return this;
  }

  public setFetchingParams(fetchingParams: any) {
    this.mock.fetchingParams = fetchingParams;
    return this;
  }
}
