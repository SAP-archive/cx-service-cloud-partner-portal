import { AssignmentsDetailsComponent } from '../components/assignments-details/assignments-details.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { AssignmentsDetailsService } from './assignments-details.service';
import { AssignmentsDetailsFacade } from '../state/assignments-details/assignments-details.facade';
import { AssignmentsDetailsFacadeMockBuilder } from '../state/assignments-details/assignments-details.facade.mock.spec';

describe('AssignmentsDetailsService', () => {
  let assignmentsDetailsService: AssignmentsDetailsService;
  let deviceDetectorServiceMock: jasmine.SpyObj<DeviceDetectorService>;
  let bottomSheetServiceMock: jasmine.SpyObj<MatBottomSheet>;
  let dialogServiceMock: jasmine.SpyObj<MatDialog>;
  let assignmentsDetailsFacadeMock: jasmine.SpyObj<AssignmentsDetailsFacade>;

  beforeEach(() => {
    bottomSheetServiceMock = jasmine.createSpyObj(MatBottomSheet, ['open']);
    deviceDetectorServiceMock = jasmine.createSpyObj(DeviceDetectorService, ['isMobile']);
    dialogServiceMock = jasmine.createSpyObj(MatDialog, ['open']);
    assignmentsDetailsFacadeMock = new AssignmentsDetailsFacadeMockBuilder().build();
    assignmentsDetailsService = new AssignmentsDetailsService(
      deviceDetectorServiceMock,
      bottomSheetServiceMock,
      dialogServiceMock,
      assignmentsDetailsFacadeMock,
    );
  });

  describe('openDetails()', () => {
    it('should update display mode', () => {
      deviceDetectorServiceMock.isMobile.and.returnValue(true);
      assignmentsDetailsService.openDetails();
      expect(assignmentsDetailsFacadeMock.setDisplayMode).toHaveBeenCalledWith('mobile');
    });

    describe('when device is mobile', () => {
      it('should open a bottom sheet', () => {
        deviceDetectorServiceMock.isMobile.and.returnValue(true);
        assignmentsDetailsService.openDetails();
        expect(bottomSheetServiceMock.open).toHaveBeenCalledWith(AssignmentsDetailsComponent as any);
      });
    });

    describe('when device is mobile', () => {
      it('should open a bottom sheet', () => {
        deviceDetectorServiceMock.isMobile.and.returnValue(false);
        assignmentsDetailsService.openDetails();
        expect(dialogServiceMock.open).toHaveBeenCalled();
      });
    });
  });
});
