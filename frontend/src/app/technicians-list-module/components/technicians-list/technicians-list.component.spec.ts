import { TechniciansListComponent } from './technicians-list.component';
import { TechniciansFacadeMockBuilder } from '../../state/technicians.facade.mock.spec';
import { TechniciansFacade } from '../../state/technicians.facade';
import { exampleTechnician } from '../../models/technician.model';
import { cold } from 'jasmine-marbles';
import { MatDialogMockBuilder } from '../../../utils/mat-dialog-mock.spec';
import { MatDialog } from '@angular/material/dialog';
import { examplePerson } from 'src/app/model/unified-person.model';

describe('TechniciansListComponent', () => {
  const createComponent = (techniciansListFacadeMock?: jasmine.SpyObj<TechniciansFacade>, matDialogServiceMock?: jasmine.SpyObj<MatDialog>) => {
    if (!techniciansListFacadeMock) {
      techniciansListFacadeMock = new TechniciansFacadeMockBuilder().build();
    }
    if (!matDialogServiceMock) {
      matDialogServiceMock = new MatDialogMockBuilder().build();
    }
    const storeMock: any = cold('a', {
      a: {user: {person: examplePerson()}}
    });
    return new TechniciansListComponent(techniciansListFacadeMock, matDialogServiceMock, storeMock);
  };

  describe('ngOnInit', () => {

    it('loads technicians', (done) => {
      const component = createComponent();
      component.ngOnInit();
      component.techniciansFacade.technicians.subscribe(technicians => {
        expect(technicians).toEqual([exampleTechnician('1'), exampleTechnician('2')]);
        done();
      });
    });

    it('should share currently login user', () => {
      const expectedObservable = cold('a', {
        a: examplePerson()
      });
      const component = createComponent();
      component.ngOnInit();
      expect(component.person).toBeObservable(expectedObservable);
    });
  });

  describe('getFullTechnicianName', () => {
    it('returns full name', () => {
      const {firstName, lastName} = exampleTechnician();
      const result = createComponent().getFullTechnicianName(exampleTechnician());
      expect(result).toEqual(`${firstName} ${lastName}`);
    });
  });

});
