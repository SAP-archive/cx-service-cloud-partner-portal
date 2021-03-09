import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignmentsBoardTileComponent } from './assignments-board-tile.component';
import { Assignment, exampleAssignment, newAssignment, readyToPlanAssignment } from '../../model/assignment';
import { AssignmentsDetailsFacade } from '../../state/assignments-details/assignments-details.facade';
import { AssignmentsDetailsFacadeMockBuilder } from '../../state/assignments-details/assignments-details.facade.mock.spec';
import { DispatchingStatus } from '../../model/dispatching-status';
import { ServiceAssignmentState } from '../../model/service-assignment-state';
import { LocalDateTimePipeModule } from '../../../local-date-time-pipe-module';
import { translateModule } from '../../../utils/translate.module';
import { HttpClientModule } from '@angular/common/http';

describe('AssignmentsBoardTileComponent', () => {
  let component: AssignmentsBoardTileComponent;
  let fixture: ComponentFixture<AssignmentsBoardTileComponent>;
  const assignment = (
    partnerDispatchingStatus: DispatchingStatus = 'ACCEPTED',
    serviceAssignmentState: ServiceAssignmentState = 'ASSIGNED'): Assignment => ({
      ...exampleAssignment(),
      partnerDispatchingStatus,
      serviceAssignmentState,
    });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        translateModule,
        HttpClientModule,
        LocalDateTimePipeModule
      ],
      declarations: [AssignmentsBoardTileComponent],
      providers: [
        {
          provide: AssignmentsDetailsFacade,
          useValue: new AssignmentsDetailsFacadeMockBuilder().build(),
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentsBoardTileComponent);
    component = fixture.componentInstance;
    component.assignment = exampleAssignment();
    fixture.detectChanges();
  });

  describe('openDetails()', () => {
    describe('when assignment is ready to plan', () => {
      it('should show assignment details', () => {
        const facadeService = TestBed.inject(AssignmentsDetailsFacade) as jasmine.SpyObj<AssignmentsDetailsFacade>;
        component.assignment = readyToPlanAssignment();
        component.openDetails();
        expect(facadeService.showAssignment).toHaveBeenCalledWith(readyToPlanAssignment());
      });
    });

    describe('when assignment is not ready to plan', () => {
      it('should not show the assignment details', () => {
        const facadeService = TestBed.inject(AssignmentsDetailsFacade) as jasmine.SpyObj<AssignmentsDetailsFacade>;
        component.assignment = newAssignment();
        component.openDetails();
        expect(facadeService.showAssignment).not.toHaveBeenCalled();
      });
    });
  });

  describe('getPriorityKey', () => {
    it('should return high key', () => {
      component.assignment = exampleAssignment();
      const priorityKey  = component.getPriorityKey();
      expect(priorityKey).toEqual('ASSIGNMENT_PRIORITY_HIGH');
    });

    it('should return default key', () => {
      component.assignment = {
        ...exampleAssignment(),
        priority: null
      };
      const priorityKey  = component.getPriorityKey();
      expect(priorityKey).toEqual('ASSIGNMENT_PRIORITY_UNKNOWN');
    });
  });

  describe('getPriorityClass', () => {
    it('should return high class', () => {
      component.assignment = exampleAssignment();
      const priorityClass  = component.getPriorityClass();
      expect(priorityClass).toEqual('high');
    });

    it('should return default class', () => {
      component.assignment = {
        ...exampleAssignment(),
        priority: null
      };
      const priorityClass  = component.getPriorityClass();
      expect(priorityClass).toEqual('unknown');
    });
  });
});
