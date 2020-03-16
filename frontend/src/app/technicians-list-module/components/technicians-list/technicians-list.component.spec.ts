import { TechniciansListComponent } from './technicians-list.component';
import { TechniciansFacadeMockBuilder } from '../../state/technicians.facade.mock.spec';
import { TechniciansFacade } from '../../state/technicians.facade';
import { exampleTechnician, Technician } from '../../models/technician.model';
import { cold } from 'jasmine-marbles';
import { MatDialogMockBuilder } from '../../../utils/mat-dialog-mock.spec';
import { RemovalConfirmationDialogComponent } from '../removal-confirmation-dialog/removal-confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
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

  it('should filter the technicians based on search query', () => {
    const johnSmith = (): Technician => ({...exampleTechnician(), firstName: 'John', lastName: 'Smith'});
    const steveJohnsson = (): Technician => ({...exampleTechnician(), firstName: 'Steve', lastName: 'Johnsson'});
    const steveBergsson = (): Technician => ({...exampleTechnician(), firstName: 'Steve', lastName: 'Bergsson'});
    const techniciansListFacadeMock = new TechniciansFacadeMockBuilder()
      .setTechnicians(cold(
        'a',
        {
          a: [
            johnSmith(),
            steveJohnsson(),
            steveBergsson(),
          ],
        },
      ))
      .build();
    const component = createComponent(techniciansListFacadeMock);

    component.ngOnInit();
    expect(component.technicians).toBeObservable(cold('a', {a: [johnSmith(), steveJohnsson(), steveBergsson()]}));

    component.searchQuery = 'john';
    component.onQueryChange();
    expect(component.technicians).toBeObservable(cold('a', {a: [johnSmith(), steveJohnsson()]}));

    component.resetSearchQuery();
    expect(component.technicians).toBeObservable(cold('a', {a: [johnSmith(), steveJohnsson(), steveBergsson()]}));
  });

  describe('ngOnInit', () => {
    it('loads technicians', () => {
      const component = createComponent();
      component.ngOnInit();
      expect(component.techniciansFacade.loadTechnicians).toHaveBeenCalled();
    });

    it('should share all technicians', (done) => {
      const component = createComponent();
      component.ngOnInit();
      component.technicians.subscribe(technicians => {
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

  describe('deleteTechnician()', () => {
    it('should open a confirmation dialog', () => {
      const matDialog = new MatDialogMockBuilder().build();
      const component = createComponent(null, matDialog);

      component.deleteTechnician(exampleTechnician());

      expect(matDialog.open).toHaveBeenCalledWith(
        RemovalConfirmationDialogComponent, {
          data: component.getFullTechnicianName(exampleTechnician()),
        },
      );
    });

    describe('after confirmation dialog is canceled', () => {
      it('should not delete technician ', () => {
        const techniciansListFacade = new TechniciansFacadeMockBuilder().build();
        const matDialog = new MatDialogMockBuilder().withResponse(of(false)).build();
        const component = createComponent(techniciansListFacade, matDialog);

        component.deleteTechnician(exampleTechnician());

        expect(techniciansListFacade.deleteTechnician).not.toHaveBeenCalled();
      });
    });

    describe('after removal is confirmed', () => {
      it('should delete the technician ', () => {
        const techniciansListFacade = new TechniciansFacadeMockBuilder().build();
        const matDialog = new MatDialogMockBuilder().withResponse(of(true)).build();
        const component = createComponent(techniciansListFacade, matDialog);

        component.deleteTechnician(exampleTechnician());

        expect(techniciansListFacade.deleteTechnician).toHaveBeenCalledWith(exampleTechnician());
      });
    });
  });
});
