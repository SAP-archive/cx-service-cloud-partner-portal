import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AssignmentsBoardTileComponent } from './assignments-board-tile.component';
import { MatDialog } from '@angular/material/dialog';
import { Assignment, exampleAssignment } from '../../model/assignment';
import { AssignmentsDetailsFacade } from '../../state/assignments-details/assignments-details.facade';
import { AssignmentsDetailsFacadeMockBuilder } from '../../state/assignments-details/assignments-details.facade.mock.spec';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { DeviceDetectorService } from 'ngx-device-detector';
import { DispatchingStatus } from '../../model/dispatching-status';
import { ServiceAssignmentState } from '../../model/service-assignment-state';
import { LocalDateTimePipeModule } from '../../../local-date-time-pipe-module';

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
      imports: [LocalDateTimePipeModule],
      declarations: [AssignmentsBoardTileComponent],
      providers: [
        {
          provide: MatDialog,
          useValue: jasmine.createSpyObj(MatDialog, ['open']),
        },
        {
          provide: AssignmentsDetailsFacade,
          useValue: new AssignmentsDetailsFacadeMockBuilder().build(),
        },
        {
          provide: MatBottomSheet,
          useValue: jasmine.createSpyObj(MatBottomSheet, ['open']),
        },
        {
          provide: DeviceDetectorService,
          useValue: jasmine.createSpyObj(DeviceDetectorService, ['isMobile']),
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
    let facadeService: jasmine.SpyObj<AssignmentsDetailsFacade>,
      dialogService: jasmine.SpyObj<MatDialog>,
      bottomSheetService: jasmine.SpyObj<MatBottomSheet>,
      deviceDetectorService: jasmine.SpyObj<DeviceDetectorService>;

    beforeEach(() => {
      facadeService = TestBed.inject(AssignmentsDetailsFacade) as jasmine.SpyObj<AssignmentsDetailsFacade>;
      dialogService = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
      bottomSheetService = TestBed.inject(MatBottomSheet) as jasmine.SpyObj<MatBottomSheet>;
      deviceDetectorService = TestBed.inject(DeviceDetectorService) as jasmine.SpyObj<DeviceDetectorService>;
    });

    describe(`if assignment's partnerDispatchingStatus equals "ACCEPTED" and state equals "ASSIGNED"`, () => {
      it('should open a dialog in web page', () => {
        deviceDetectorService.isMobile.and.returnValue(false);
        component.assignment = assignment();
        component.openDetails();
        expect(dialogService.open).toHaveBeenCalled();
      });

      it('should open a bottom sheet in mobile page', () => {
        deviceDetectorService.isMobile.and.returnValue(true);
        component.assignment = assignment();
        component.openDetails();
        expect(bottomSheetService.open).toHaveBeenCalled();
      });

      it('should set the clicked assignment as current display assignment', () => {
        component.assignment = assignment();
        component.openDetails();
        expect(facadeService.setCurrentAssignment).toHaveBeenCalledWith(assignment());
      });

      it('should set current display mode due to device', () => {
        deviceDetectorService.isMobile.and.returnValue(true);
        component.assignment = assignment();
        component.openDetails();
        expect(facadeService.setDisplayMode).toHaveBeenCalledWith('mobile');
      });
    });

    describe(`if assignment's partnerDispatchingStatus doesn't equal "ACCEPTED"`, () => {
      it('should not open a dialog or bottom sheet', () => {
        component.assignment = assignment('NOTIFIED');
        component.openDetails();
        expect(dialogService.open).not.toHaveBeenCalled();
        expect(bottomSheetService.open).not.toHaveBeenCalled();
      });
    });

    describe(`if assignment's serviceAssignmentState doesn't equal "ASSIGNED"`, () => {
      it('should not open a dialog or bottom sheet', () => {
        component.assignment = assignment('ACCEPTED', 'RELEASED');
        component.openDetails();
        expect(dialogService.open).not.toHaveBeenCalled();
        expect(bottomSheetService.open).not.toHaveBeenCalled();
      });
    });
  });
});
