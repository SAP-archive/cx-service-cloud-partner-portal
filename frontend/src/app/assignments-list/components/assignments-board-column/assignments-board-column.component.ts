import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Observable } from 'rxjs';
import { Assignment } from '../../model/assignment';
import { AssignmentsListFacade } from '../../state/assignments-list.facade';
import { ColumnName } from '../../model/column-name';
import { FetchingFilter } from '../../model/fetching-filter';
import { CdkDrag, CdkDragDrop, CdkDragStart } from '@angular/cdk/drag-drop';
import { filter, map, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { isClosed, isNew, isOngoing, isReadyToPlan } from '../../utils/assignments-columns-helper';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../components/confirmatiom-popover/confirm-dialog.component';
import { ConfigFacade } from '../../../state/config/config.facade';
import { OnDestroyInformer } from '../../../utils/on-destroy-informer';

@Component({
  selector: 'pp-assignments-board-column',
  templateUrl: './assignments-board-column.component.html',
  styleUrls: [
    './assignments-board-column.component.scss',
    './drag-and-drop.scss',
  ],
})
export class AssignmentsBoardColumnComponent extends OnDestroyInformer implements OnInit {
  @Input() public columnName: ColumnName;
  @Input() public fetchingFilter: FetchingFilter;
  @ViewChild(CdkVirtualScrollViewport) public viewport: CdkVirtualScrollViewport;
  public assignments: Observable<Assignment[]>;
  public isLoading: Observable<boolean>;
  public canReceiveDraggedAssignment: Observable<boolean>;
  public isOriginalColumnOfDraggedAssignment: Observable<boolean>;
  public dragTimeout: number;
  private allowAssignmentClose: boolean;
  public assignmentsTotal: Observable<number>;

  constructor(
    private assignmentsListFacade: AssignmentsListFacade,
    public deviceDetectorService: DeviceDetectorService,
    private dialog: MatDialog,
    private configFacade: ConfigFacade,
  ) {
    super();
  }

  public ngOnInit(): void {
    this.dragTimeout = this.deviceDetectorService.isDesktop() ? 0 : 100;
    this.assignmentsListFacade.setFilter(this.columnName, this.fetchingFilter);
    this.assignments = this.assignmentsListFacade.getAssignments(this.columnName);
    this.assignmentsTotal = this.assignmentsListFacade.getAssignmentsTotal(this.columnName);
    this.isLoading = this.assignmentsListFacade.getIsLoading(this.columnName);
    this.canReceiveDraggedAssignment = this.assignmentsListFacade.draggedAssignment.pipe(
      filter(draggedAssignment => !!draggedAssignment),
      map(draggedAssignment => this.isAssignmentReceivable(draggedAssignment)),
    );
    this.isOriginalColumnOfDraggedAssignment = this.assignmentsListFacade.draggedAssignment.pipe(
      filter(draggedAssignment => !!draggedAssignment),
      map(draggedAssignment => this.isComingFromCurrentColumn(draggedAssignment)),
    );
    this.configFacade.allowAssignmentClose.pipe(takeUntil(this.onDestroy))
      .subscribe(allowAssignmentClose => this.allowAssignmentClose = allowAssignmentClose);
  }

  public scrolledIndexChange() {
    if (this.viewport.getRenderedRange().end === this.viewport.getDataLength()) {
      this.assignmentsListFacade.getHasFetchedAll(this.columnName)
        .pipe(
          take(1),
          filter(hasFetchedAll => !hasFetchedAll),
          withLatestFrom(this.assignmentsListFacade.getIsLoading(this.columnName)),
          filter(([, isLoading]) => !isLoading),
        )
        .subscribe(() => this.assignmentsListFacade.loadNextPage(this.columnName));
    }
  }

  public onDrop($event: CdkDragDrop<Assignment[]>) {
    const assignment = $event.item.data as Assignment;
    if (this.isAssignmentReceivable(assignment)) {
      if (isNew(assignment)) {
        this.openReminder(assignment, this.assignmentsListFacade.accept.bind(this.assignmentsListFacade));
      } else if (isReadyToPlan(assignment)) {
        this.assignmentsListFacade.release(assignment);
      } else if (isOngoing(assignment)) {
        this.openReminder(assignment, this.assignmentsListFacade.close.bind(this.assignmentsListFacade));
      }
    }
  }

  public onDragStart($event: CdkDragStart) {
    this.assignmentsListFacade.startDragging($event.source.data);
  }

  public onDragEnd() {
    this.assignmentsListFacade.endDragging();
  }

  public enterPredicate({data}: CdkDrag<Assignment>): boolean {
    return this.isAssignmentReceivable(data);
  }

  public isWindows() {
    return navigator.userAgent && navigator.userAgent.toLowerCase().includes('windows');
  }

  private openReminder(assignment: Assignment, confirmCallback: Function) {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: 'ASSIGNMENTS_BOARD_TILE_CONFIRM_REMINDER',
      },
    }).afterClosed()
      .pipe(filter((result) => result === true))
      .subscribe(() => {
        confirmCallback(assignment);
      });
  }

  private isAssignmentReceivable(draggedAssignment: Assignment) {
    return this.columnName === 'ASSIGNMENTS_BOARD_READY_TO_PLAN' && isNew(draggedAssignment)
      || this.columnName === 'ASSIGNMENTS_BOARD_ONGOING' && isReadyToPlan(draggedAssignment)
      || this.columnName === 'ASSIGNMENTS_BOARD_CLOSED' && isOngoing(draggedAssignment) && this.allowAssignmentClose;
  }

  private isComingFromCurrentColumn(draggedAssignment: Assignment) {
    return this.columnName === 'ASSIGNMENTS_BOARD_NEW' && isNew(draggedAssignment)
      || this.columnName === 'ASSIGNMENTS_BOARD_READY_TO_PLAN' && isReadyToPlan(draggedAssignment)
      || this.columnName === 'ASSIGNMENTS_BOARD_ONGOING' && isOngoing(draggedAssignment)
      || this.columnName === 'ASSIGNMENTS_BOARD_CLOSED' && isClosed(draggedAssignment);
  }
}
