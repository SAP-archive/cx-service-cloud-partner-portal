import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignmentsDetailsComponent } from './assignments-details.component';
import { AssignmentsListMaterialModule } from '../../assignments-list-material.module';
import { translateModule } from '../../../utils/translate.module';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { HttpClientModule } from '@angular/common/http';
import { exampleTechnician } from '../../../technicians-list-module/models/technician.model';
import { Assignment, exampleAssignment } from '../../model/assignment';
import { AssignmentsListFacade } from '../../state/assignments-list.facade';
import { AssignmentsListFacadeMockBuilder } from '../../state/assignments-list.facade.mock.spec';
import { AssignmentsDetailsFacade } from '../../state/assignments-details/assignments-details.facade';
import { AssignmentsDetailsFacadeMockBuilder } from '../../state/assignments-details/assignments-details.facade.mock.spec';
import { LocalDateTimePipeModule } from '../../../local-date-time-pipe-module';
import { marbles } from 'rxjs-marbles';

describe('AssignmentsDetailsComponent', () => {
  let component: AssignmentsDetailsComponent;
  let fixture: ComponentFixture<AssignmentsDetailsComponent>;
  let dialogService: jasmine.SpyObj<MatDialog>;
  let detailsFacadeService: jasmine.SpyObj<AssignmentsDetailsFacade>;
  const techniciansList = [
    exampleTechnician('1'),
    exampleTechnician('2'),
  ];
  const updatedAssignment = {...exampleAssignment(), responsiblePerson: exampleTechnician('someone else')};

  beforeEach(marbles(m => {
    TestBed.configureTestingModule({
      imports: [
        translateModule,
        HttpClientModule,
        AssignmentsListMaterialModule,
        LocalDateTimePipeModule,
      ],
      declarations: [AssignmentsDetailsComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: jasmine.createSpyObj(MatDialog, ['closeAll']),
        },
        {
          provide: AssignmentsListFacade,
          useValue: new AssignmentsListFacadeMockBuilder().build(),
        },
        {
          provide: MatBottomSheet,
          useValue: jasmine.createSpyObj(MatBottomSheet, ['dismiss']),
        },
        {
          provide: AssignmentsDetailsFacade,
          useValue: new AssignmentsDetailsFacadeMockBuilder()
            .setIsLoading(m.cold('ftf', {f: false, t: true}))
            .setDisplayMode('web')
            .build(),
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentsDetailsComponent);
    component = fixture.componentInstance;
    dialogService = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    detailsFacadeService = TestBed.inject(AssignmentsDetailsFacade) as jasmine.SpyObj<AssignmentsDetailsFacade>;
    fixture.detectChanges();
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should change isLoading status due to state changes', marbles(m => {
      m.expect(component.isLoading).toBeObservable('ftf', {
        f: false,
        t: true,
      });
    }));

    it('should get technicians list', marbles(m => {
      m.expect(detailsFacadeService.technicians$).toBeObservable('(a|)', {
        a: techniciansList,
      });
    }));

    it('should get display mode', marbles(m => {
      m.expect(detailsFacadeService.displayMode$).toBeObservable('(a|)', {
        a: 'web',
      });
    }));
  });

  describe('closeDetails()', () => {
    it('should close dialog', () => {
      fixture.detectChanges();
      component.closeDetails();
      expect(dialogService.closeAll).toHaveBeenCalled();
    });
  });

  describe('update()', () => {
    beforeEach(() => {
      component.assignment = exampleAssignment();
      component.formErrorsCounter = [];
    });

    it('should update start date time', () => {
      const dateTime = new Date('2020-09-09');
      component.updateStartDateTime(dateTime);
      expect(component.assignment).toEqual({...exampleAssignment(), startDateTime: dateTime.toJSON()});
    });

    it('should update end date time', () => {
      const dateTime = new Date('2020-09-09');
      component.updateEndDateTime(dateTime);
      expect(component.assignment).toEqual({...exampleAssignment(), endDateTime: dateTime.toJSON()});
    });

    it('should update responsible person', () => {
      component.updateResponsiblePerson(exampleTechnician('987'));
      expect(component.assignment).toEqual({...exampleAssignment(), responsiblePerson: exampleTechnician('987')});
    });

    it('should add error field to formErrorsCounter when error happens', () => {
      component.updateValidation(false, 'endDateTime');
      expect(component.formErrorsCounter).toEqual(['endDateTime']);
    });

    it('should remove error field from formErrorsCounter when error solved', () => {
      component.formErrorsCounter = ['endDateTime', 'startDateTime'];
      component.updateValidation(true, 'endDateTime');
      expect(component.formErrorsCounter).toEqual(['startDateTime']);
    });
  });

  describe('releaseAssignment()', () => {
    it('should call for update and value changes', () => {
      const facadeService = TestBed.inject(AssignmentsListFacade) as jasmine.SpyObj<AssignmentsListFacade>;
      component.originalAssignment = exampleAssignment();
      component.releaseAssignment(updatedAssignment);
      expect(facadeService.release).toHaveBeenCalledWith(updatedAssignment);
    });

    it('should close dialog after release', () => {
      component.releaseAssignment(exampleAssignment());
      expect(dialogService.closeAll).toHaveBeenCalledWith();
    });
  });

  describe('handoverAssignment()', () => {
    it('should call for update and value changes', () => {
      const facadeService = TestBed.inject(AssignmentsListFacade) as jasmine.SpyObj<AssignmentsListFacade>;
      component.originalAssignment = exampleAssignment();
      component.updateHandoverToPerson(exampleTechnician('handee'));
      component.handoverAssignment(exampleAssignment());
      expect(facadeService.handover).toHaveBeenCalledWith({
        ...exampleAssignment(),
        responsiblePerson: exampleTechnician('handee'),
      } as Assignment);
    });

    it('should close the dialog', () => {
      component.handoverAssignment(exampleAssignment());
      expect(dialogService.closeAll).toHaveBeenCalledWith();
    });
  });
});
