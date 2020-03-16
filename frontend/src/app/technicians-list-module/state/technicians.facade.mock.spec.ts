import { of } from 'rxjs';
import { TechniciansFacade } from './technicians.facade';
import { exampleTechnician } from '../models/technician.model';
import SpyObj = jasmine.SpyObj;

export class TechniciansFacadeMockBuilder {
  private mock = jasmine.createSpyObj<TechniciansFacade>([
    'loadTechnicians',
    'deleteTechnician',
  ]);

  constructor() {
    this.mock.technicians = of([exampleTechnician('1'), exampleTechnician('2')]);
  }

  public build(): SpyObj<TechniciansFacade> {
    return this.mock;
  }

  public setTechnicians(technicians: any) {
    this.mock.technicians = technicians;
    return this;
  }
}
