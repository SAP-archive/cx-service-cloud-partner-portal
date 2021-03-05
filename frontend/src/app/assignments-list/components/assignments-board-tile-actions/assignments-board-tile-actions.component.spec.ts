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
import { AssignmentsDetailsFacade } from '../../state/assignments-details/assignments-details.facade';
import { AssignmentsDetailsFacadeMockBuilder } from '../../state/assignments-details/assignments-details.facade.mock.spec';
import { ConfigFacade } from '../../../state/config/config.facade';
import { ConfigFacadeMockBuilder } from '../../../state/config/config.facade.mock.spec';
import { take } from 'rxjs/operators';

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
      providers: [
        {
          provide: AssignmentsListFacade,
          useValue: new AssignmentsListFacadeMockBuilder().build(),
        },
        {
          provide: AssignmentsDetailsFacade,
          useValue: new AssignmentsDetailsFacadeMockBuilder().build(),
        },
        {
          provide: MatDialog,
          useValue: dialogMock,
        },
        {
          provide: ConfigFacade,
          useValue: new ConfigFacadeMockBuilder()
            .setAllowAssignmentHandover(of(true))
            .setAllowAssignmentReject(of(true))
            .setAllowAssignmentClose(of(true))
            .build(),
        },
      ],
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

  it('should share allowHandover based on state', done => {
    component.allowHandover
      .pipe(take(1))
      .subscribe(allowHandover => {
        expect(allowHandover).toBeTrue();
        done();
      });
  });

  it('should share allowAssignmentReject based on state', done => {
    component.allowAssignmentReject
      .pipe(take(1))
      .subscribe(allowAssignmentReject => {
        expect(allowAssignmentReject).toBeTrue();
        done();
      });
  });

  it('should share allowAssignmentClose based on state', done => {
    component.allowAssignmentClose
      .pipe(take(1))
      .subscribe(allowAssignmentClose => {
        expect(allowAssignmentClose).toBeTrue();
        done();
      });
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
      const facadeService = TestBed.inject(AssignmentsListFacade) as jasmine.SpyObj<AssignmentsListFacade>;
      dialogMock.open.and.returnValue({
        afterClosed: () => of(true),
      });
      component.acceptAssignment();
      expect(dialogMock.open).toHaveBeenCalled();
      expect(facadeService.accept).toHaveBeenCalledWith(component.assignment);
    });
  });

  describe('rejectAssignment()', () => {
    it('should dispatch rejectAssignment action', () => {
      const facadeService = TestBed.inject(AssignmentsListFacade) as jasmine.SpyObj<AssignmentsListFacade>;
      component.rejectAssignment();
      expect(facadeService.reject).toHaveBeenCalledWith(component.assignment);
    });
  });

  describe('handoverAssignment()', () => {
    it('should dispatch showAssignment action', () => {
      const facadeService = TestBed.inject(AssignmentsDetailsFacade) as jasmine.SpyObj<AssignmentsDetailsFacade>;
      component.handoverAssignment();
      expect(facadeService.showAssignment).toHaveBeenCalledWith(component.assignment);
    });
  });

  describe('closeAssignment()', () => {
    it('should dispatch closeAssignment action', () => {
      const facadeService = TestBed.inject(AssignmentsListFacade) as jasmine.SpyObj<AssignmentsListFacade>;
      dialogMock.open.and.returnValue({
        afterClosed: () => of(true),
      });
      component.closeAssignment();
      expect(dialogMock.open).toHaveBeenCalled();
      expect(facadeService.close).toHaveBeenCalledWith(component.assignment);
    });
  });
});
