import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignmentsBoardTileActionsComponent } from './assignments-board-tile-actions.component';
import { translateModule } from '../../../utils/translate.module';
import { HttpClientModule } from '@angular/common/http';
import { exampleAssignment } from '../../model/assignment';
import { exampleTechnician } from '../../../technicians-list-module/models/technician.model';
import { AssignmentsListFacade } from '../../state/assignments-list.facade';
import { AssignmentsListFacadeMockBuilder } from '../../state/assignments-list.facade.mock.spec';
import { LocalDateTimePipeModule } from '../../../local-date-time-pipe-module';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

export class MatDialogMock {
  public open: () => {};
}

describe('AssignmentsBoardTileActionsComponent', () => {
  let component: AssignmentsBoardTileActionsComponent;
  let fixture: ComponentFixture<AssignmentsBoardTileActionsComponent>;
  const dialogMock = jasmine.createSpyObj(['open']);
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        translateModule,
        HttpClientModule,
        LocalDateTimePipeModule,
      ],
      providers: [{
          provide: AssignmentsListFacade,
          useValue: new AssignmentsListFacadeMockBuilder().build(),
        },
        {
          provide: MatDialog,
          useValue: dialogMock
      }],
      declarations: [AssignmentsBoardTileActionsComponent],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentsBoardTileActionsComponent);
    component = fixture.componentInstance;
    component.assignment = exampleAssignment();
    fixture.detectChanges();
  });

  describe('ngOnChanges()', () => {
    it('should share technicians name', () => {
      const technician = exampleTechnician();
      component.ngOnChanges();
      expect(component.technicianName).toEqual(`${technician.firstName} ${technician.lastName}`);
    });
  });

  describe('acceptAssignment()', () => {
    it('should dispatch acceptAssignment action', () => {
      const facdeService = TestBed.inject(AssignmentsListFacade) as jasmine.SpyObj<AssignmentsListFacade>;
      component.acceptAssignment();
      expect(facdeService.accept).toHaveBeenCalledWith(component.assignment);
    });
  });

  describe('rejectAssignment()', () => {
    it('should dispatch rejectAssignment action', () => {
      const facdeService = TestBed.inject(AssignmentsListFacade) as jasmine.SpyObj<AssignmentsListFacade>;
      component.rejectAssignment();
      expect(facdeService.reject).toHaveBeenCalledWith(component.assignment);
    });
  });

  describe('closeAssignment()', () => {
    it('should dispatch closeAssignment action', () => {
      const facdeService = TestBed.inject(AssignmentsListFacade) as jasmine.SpyObj<AssignmentsListFacade>;
      dialogMock.open.and.returnValue({
        afterClosed: () => of(true)
      });
      component.closeAssignment();
      expect(dialogMock.open).toHaveBeenCalled();
      expect(facdeService.close).toHaveBeenCalledWith(component.assignment);
    });
  });
});
